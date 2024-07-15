const modeInput = document.getElementById("mode");

const filterToggleBtn = document.querySelector(".filter-input");
const filterChevron = document.querySelector(".fa-chevron-up");
const filterOptions = document.querySelector(".filter-options");

const sortDirection = document.getElementById("sort");
const sortDataInput = document.querySelectorAll("input[name=sort-data");
const sortLabel = document.querySelector(".sort-label i");

const searchInput = document.getElementById("search");

const contentWrapper = document.querySelector(".content-wrapper");


let regions = new Set();
let currentRegion = "None";
let sortData = { data: "name", direction: "down" };


const mode = sessionStorage.getItem("mode");
if (mode) {
    modeInput.checked = (mode === "dark");
    changeMode();
}

const savedSort = JSON.parse(sessionStorage.getItem("sort"));
if (savedSort) {
    sortData = savedSort;

    sortDataInput.forEach((input) => {
        if (input.value === sortData.data) {
            input.checked = true;
        }
    });

    (sortData.direction === "up") ?
        sortDirection.checked = true :
        sortDirection.checked = false;
}


async function fetchJsonData() {
    try {
        // const response = await fetch('data.json');
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch the JSON data:', error);
    }
}

async function assignData() {
    data = JSON.parse(sessionStorage.getItem("country-data"));

    if (!data) {
        data = await fetchJsonData();
    }

    if (data) {
        console.log("DATA");
        sessionStorage.setItem("country-data", JSON.stringify(data));
        data.forEach((item) => {
            regions.add(item.region);
            const country = createCountry(item);
            contentWrapper.appendChild(country);
        });

        createFilterOptions();
        sort();
    }
}


function createCountry(data) {
    const outer = document.createElement("a");
    outer.className = "country-wrapper";
    outer.href = `/detail.html?country=${data.cca3}`;
    outer.setAttribute("data-region", data.region);
    outer.setAttribute("data-name", data.name.common.toLowerCase());
    outer.setAttribute("aria-hidden", false);

    const flag = document.createElement("img");
    flag.src = data.flags.svg;
    flag.width = "400";
    flag.alt = `${data.name.common} flag`;

    const dataWrapper = createCountryData(data);

    outer.append(flag, dataWrapper);
    return outer;
}


function createCountryData(data) {
    const dataWrapper = document.createElement("div");
    dataWrapper.className = "country-data";

    const title = document.createElement("div");
    title.className = "country-title";
    title.textContent = data.name.common;

    const pop = document.createElement("div");
    pop.textContent = "Population: ";
    if (data.population) {
        pop.appendChild(createDataSpan(insertCommas(data.population.toString())));
    } else {
        pop.appendChild(createDataSpan("0"));
    }

    const reg = document.createElement("div");
    if (data.region) {
        reg.textContent = "Region: ";
        reg.appendChild(createDataSpan(data.region));
    }

    const area = document.createElement("div");
    if (data.area) {
        area.textContent = "Area: ";
        const aSpan = createDataSpan(insertCommas(data.area.toString()));
        const sup = document.createElement("sup");
        sup.textContent = "2";
        aSpan.append(" km", sup);
        area.appendChild(aSpan);
    }

    const cap = document.createElement("div");
    if (data.capital) {
        cap.textContent = "Capital: ";
        cap.appendChild(createDataSpan(data.capital));
    }

    dataWrapper.append(title, pop, reg, area, cap);

    return dataWrapper;
}


function createDataSpan(data) {
    const span = document.createElement("span");
    span.className = "data";
    span.textContent = data;
    return span;
}


function createFilterOptions() {
    const regArray = Array.from(regions);
    regArray.sort((a, b) => a.localeCompare(b));

    regArray.forEach((region) => {
        const option = document.createElement("button");
        option.type = "button";
        option.id = region;
        option.className = "filter-btn";
        option.role = "option";
        option.setAttribute("onclick", "filterByRegion(this)");
        option.textContent = region;

        filterOptions.appendChild(option);
    });

    retrieveSavedFilter();
}


function retrieveSavedFilter() {
    const savedFilter = sessionStorage.getItem("regionFilter");
    if (!savedFilter) {
        return;
    }

    const filterBtns = filterOptions.querySelectorAll(".filter-btn");
    const matchingFilterBtn = Array.from(filterBtns).find(btn => btn.id === savedFilter);

    if (matchingFilterBtn) {
        filterByRegion(matchingFilterBtn);
    }
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


function closeFilterOptions() {
    filterOptions.classList.add("filters-hidden");
    filterChevron.classList.remove("icon-rotate");
}


function toggleFilterOptions() {
    filterOptions.classList.toggle("filters-hidden");
    filterChevron.classList.toggle("icon-rotate");
}


function filterByRegion(option) {
    closeFilterOptions();
    currentRegion = option.id;
    sessionStorage.setItem("regionFilter", currentRegion);

    filterOptions.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("selected-filter");
    });
    option.classList.add("selected-filter");
    searchInput.value = "";

    contentWrapper.querySelectorAll(".country-wrapper").forEach((country) => {
        if (currentRegion === "None") {
            country.setAttribute("aria-hidden", false);
        } else {
            country.setAttribute("aria-hidden", true);
            const elementRegion = country.getAttribute("data-region");
            setTimeout(() => {
                if (elementRegion === currentRegion) {
                    country.setAttribute("aria-hidden", false);
                }
            }, 500);
        }
    });

    setTimeout(() => {
        filterToggleBtn.querySelector("span").textContent = (currentRegion === "None") ? "Filter by Region" : currentRegion;
    }, 500);
}


// Filters the list of countries on entering search string
function filterByName() {
    const keyword = searchInput.value.toLowerCase();

    contentWrapper.querySelectorAll(".country-wrapper").forEach((country) => {
        if (currentRegion === "None" || country.getAttribute("data-region") === currentRegion) {
            const name = country.getAttribute("data-name");
            if (name.includes(keyword)) {
                country.setAttribute("aria-hidden", false);
            } else {
                country.setAttribute("aria-hidden", true);
            }
        }
    });
}


function sort() {
    searchInput.value = "";
    sortLabel.className = (sortData.direction === "up") ?
        "fa-solid fa-arrow-down-short-wide" :
        "fa-solid fa-arrow-up-wide-short";

    sessionStorage.setItem("sort", JSON.stringify(sortData));

    if (sortData.data === "name") {
        (sortData.direction === "up") ?
            data.sort((b, a) => a.name.common.localeCompare(b.name.common)) :
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortData.data === "population") {
        (sortData.direction === "up") ?
            data.sort((a, b) => a.population - b.population) :
            data.sort((b, a) => a.population - b.population);
    } else if (sortData.data === "area") {
        (sortData.direction === "up") ?
            data.sort((a, b) => a.area - b.area) :
            data.sort((b, a) => a.area - b.area);
    }

    sessionStorage.setItem("country-data", JSON.stringify(data));
    contentWrapper.innerHTML = "";
    data.forEach((item) => {
        const country = createCountry(item);
        contentWrapper.appendChild(country);
    });

    retrieveSavedFilter();
}


function changeMode() {
    const body = document.querySelector("body");
    const icon = document.querySelector(".fa-moon");
    if (modeInput.checked) {
        body.className = "home dark";
        icon.className = "fa-solid fa-moon"
        sessionStorage.setItem("mode", "dark");
    } else {
        body.className = "home light";
        icon.className = "fa-regular fa-moon";
        sessionStorage.setItem("mode", "light");
    }
}


searchInput.addEventListener('input', () => {
    filterByName();
});


sortDirection.addEventListener("change", function () {
    sortData.direction = (this.checked) ? "up" : "down";
    sort();
})


sortDataInput.forEach((input) => {
    input.addEventListener("change", function () {
        sortData.data = this.value;
        sort();
    });
});


document.addEventListener("click", function (e) {
    if (e.target != filterToggleBtn && e.target != filterOptions) {
        closeFilterOptions();
    }
});


Array.from(filterToggleBtn.children).forEach((el) => {
    el.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFilterOptions();
    });
});


filterToggleBtn.addEventListener("click", () => {
    toggleFilterOptions();
});


modeInput.addEventListener("change", () => {
    changeMode();
});


assignData();
