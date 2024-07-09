const modeInput = document.getElementById("mode");

const mode = sessionStorage.getItem("mode");
if (mode) {
    modeInput.checked = (mode === "dark");
    changeMode();
}

const data = JSON.parse(sessionStorage.getItem("country-data"));
if (data) {
    console.log("Got data");
} else {
    console.log("NOT LOaDED");
    window.location.replace("/");
}

// Function to get query parameters from the URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}


function assignData(params) {
    const country = data.find((el) => el.alpha3Code === params.country);

    if (country) {
        document.querySelector("title").textContent = country.name;
        document.getElementById("flag").src = country.flag;
        document.getElementById("flag").alt = `${country.name} flag`;
        document.getElementById("detail-title").textContent = country.name;
        document.getElementById("native").textContent = country.nativeName;
        if (country.population) {
            document.getElementById("population").textContent = insertCommas(country.population.toString());
        }
        document.getElementById("region").textContent = country.region;
        if (country.subregion) {
            document.getElementById("sub-region").textContent = country.subregion;
        }
        if (country.capital) {
            document.getElementById("capital").textContent = country.capital;
        }
        if (country.area) {
            const areaData = insertCommas(country.area.toString());
            const sup = document.createElement("sup");
            sup.textContent = "2";
            const area = document.getElementById("area");
            area.textContent = "";
            area.append(areaData, " km", sup);
        }
        document.getElementById("domain").textContent = country.topLevelDomain;
        if (country.currencies) {
            document.getElementById("currencies").textContent = createList(country.currencies, "name").join(', ');
        }
        if (country.languages) {
            document.getElementById("languages").textContent = createList(country.languages, "name").join(', ');
        }
        if (country.borders) {
            createBorderLinks(country.borders);
        } else {
            const span = document.createElement("span");
            span.className = "data border-label";
            span.textContent = "None";
            document.querySelector(".border-link-wrapper").appendChild(span);
        }
    } else {
        console.error("Country not found");
    }
}


function createList(items, index) {
    return items.map(item => item[index]);
}


function insertCommas(numberStr) {
    if (numberStr.includes(".")) {
        let parts = numberStr.split('.');
        let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let decimalPart = parts.length > 1 ? '.' + parts[1] : '';
        return integerPart + decimalPart;
    }

    return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function createBorderLinks(borderCodes) {
    const wrapper = document.querySelector(".border-link-wrapper");

    borderCodes.forEach((code) => {
        const country = data.find((el) => el.alpha3Code === code);
        const link = document.createElement("a");
        link.textContent = country.name;
        link.className = "border-link"
        link.href = `/detail.html?country=${code}`;

        wrapper.appendChild(link);
    });
}


function changeMode() {
    const body = document.querySelector("body");
    const icon = document.querySelector(".fa-moon");
    if (modeInput.checked) {
        body.className = "detail dark";
        icon.className = "fa-solid fa-moon"
        sessionStorage.setItem("mode", "dark");
    } else {
        body.className = "detail light";
        icon.className = "fa-regular fa-moon";
        sessionStorage.setItem("mode", "light");
    }
}

modeInput.addEventListener("change", () => {
    changeMode();
});


const params = getQueryParams();
assignData(params);