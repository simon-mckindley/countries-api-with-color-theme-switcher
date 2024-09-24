import { insertCommas } from "./Utils.js";

export function createCountryTile(data) {
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
    flag.loading = "lazy";

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
