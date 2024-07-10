const modeInput = document.getElementById("mode");

let areas;

const mode = sessionStorage.getItem("mode");
if (mode) {
    modeInput.checked = (mode === "dark");
    changeMode();
}

const data = JSON.parse(sessionStorage.getItem("country-data"));
if (data) {
    console.log("data");
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
    const country = data.find((el) => el.cca3 === params.country);
    areas = data.map(country => country.area);

    if (country) {
        document.querySelector("title").textContent = country.name.common;

        if (country.latlng && country.area) {
            showMap(country.latlng[0], country.latlng[1], country.area);
        }

        document.getElementById("flag").src = country.flags.svg;
        document.getElementById("flag").alt = `${country.name.common} flag`;

        document.getElementById("detail-title").textContent = country.name.common;

        const nnKeys = Object.keys(country.name.nativeName);
        document.getElementById("native").textContent = country.name.nativeName[nnKeys[0]].common;

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

        document.getElementById("domain").textContent = country.tld.join(" ");

        if (country.currencies) {
            document.getElementById("currencies").textContent = getNameValuesList(country.currencies).join(', ');
        }

        if (country.languages) {
            document.getElementById("languages").textContent = getValuesList(country.languages).join(', ');
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

function getNameValuesList(obj) {
    return Object.keys(obj)
        .map(key => obj[key].name)
        .filter(name => name !== undefined); // Filter out undefined values
}

function getValuesList(obj) {
    return Object.keys(obj).map(key => obj[key]);
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
        const country = data.find((el) => el.cca3 === code);
        const link = document.createElement("a");
        link.textContent = country.name.common;
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

// Function to calculate zoom level
function calculateZoomLevel(area) {
    // Define the min and max zoom levels
    const minZoom = 4;
    const maxZoom = 13;

    // Find the min and max area in your dataset
    const minArea = Math.min(...areas);
    const maxArea = Math.max(...areas);
    // Normalize the area using logarithmic scaling
    const normalizedArea = (Math.log(area) - Math.log(minArea)) / (Math.log(maxArea) - Math.log(minArea));
    // Scale the normalized value to the desired zoom range
    const zoomLevel = minZoom + (maxZoom - minZoom) * (1 - normalizedArea); // 1 - normalizedArea to flip the scale
    return zoomLevel;
}


function showMap(lat, lng, area) {
    const zoom = calculateZoomLevel(area);
    console.log(zoom);
    const map = L.map('map').setView([lat, lng], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}


const params = getQueryParams();
assignData(params);