import { createCountryTile } from "./CreateElements.js";
import { setMode, changeMode } from "./Utils.js";
import Api from "./Api.js";


const filterToggleBtn = document.querySelector(".filter-input");
const filterChevron = document.querySelector(".fa-chevron-up");
const filterOptions = document.querySelector(".filter-options");

const sortDirection = document.getElementById("sort");
const sortDataInput = document.querySelectorAll("input[name=sort-data");
const sortLabel = document.querySelector(".sort-label i");

const searchInput = document.getElementById("search");

const contentWrapper = document.querySelector(".content-wrapper");

const modeInput = document.getElementById("mode");
setMode(modeInput);

let countries;

let regions = new Set();
let currentRegion = "None";
let sortData = { data: "name", direction: "down" };


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


async function assignData() {
    countries = JSON.parse(sessionStorage.getItem("country-data"));

    if (!countries) {
        countries = await Api.getCountryData();
    }

    if (countries) {
        sessionStorage.setItem("country-data", JSON.stringify(countries));
        countries.forEach((item) => {
            regions.add(item.region);
            const country = createCountryTile(item);
            contentWrapper.appendChild(country);
        });

        createFilterOptions();
        sort();
    }
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
            countries.sort((b, a) => a.name.common.localeCompare(b.name.common)) :
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortData.data === "population") {
        (sortData.direction === "up") ?
            countries.sort((a, b) => a.population - b.population) :
            countries.sort((b, a) => a.population - b.population);
    } else if (sortData.data === "area") {
        (sortData.direction === "up") ?
            countries.sort((a, b) => a.area - b.area) :
            countries.sort((b, a) => a.area - b.area);
    }

    sessionStorage.setItem("country-data", JSON.stringify(countries));
    contentWrapper.innerHTML = "";
    countries.forEach((item) => {
        const country = createCountryTile(item);
        contentWrapper.appendChild(country);
    });

    retrieveSavedFilter();
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
    changeMode(modeInput);
});


assignData();
