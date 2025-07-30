import { insertCommas } from "./Utils.js";

export function createCountryTile(data) {
    const outer = document.createElement("a");
    outer.className = "country-wrapper";
    outer.href = `/detail.html?country=${data.alpha3Code}`;
    outer.setAttribute("data-region", data.region);
    outer.setAttribute("data-name", data.name.toLowerCase());
    outer.setAttribute("aria-hidden", false);

    const flag = document.createElement("img");
    flag.src = data.flags.svg;
    flag.width = "400";
    flag.alt = `${data.name} flag`;
    flag.loading = "lazy";

    const dataWrapper = createCountryData(data);

    outer.append(flag, dataWrapper);
    return outer;
}


function createCountryData(data) {
    const dataWrapper = document.createElement("dl");
    dataWrapper.className = "country-data";

    const title = document.createElement("h2");
    title.className = "country-title";
    title.textContent = data.name;

    const pop = document.createElement("div");
    pop.appendChild(createDataTitle("Population: "));
    if (data.population) {
        pop.appendChild(createDataDescription(insertCommas(data.population.toString())));
    } else {
        pop.appendChild(createDataDescription("0"));
    }

    const reg = document.createElement("div");
    if (data.region) {
        reg.appendChild(createDataTitle("Region: "));
        reg.appendChild(createDataDescription(data.region));
    }

    const area = document.createElement("div");
    if (data.area) {
        area.appendChild(createDataTitle("Area: "));
        const aSpan = createDataDescription(insertCommas(data.area.toString()));
        const sup = document.createElement("sup");
        sup.textContent = "2";
        aSpan.append(" km", sup);
        area.appendChild(aSpan);
    }

    const cap = document.createElement("div");
    if (data.capital) {
        cap.appendChild(createDataTitle("Capital: "));
        cap.appendChild(createDataDescription(data.capital));
    }

    dataWrapper.append(title, pop, reg, area, cap);

    return dataWrapper;
}

function createDataTitle(data) {
    const dt = document.createElement("dt");
    dt.className = "data-title";
    dt.textContent = data;
    return dt;
}

function createDataDescription(data) {
    const dd = document.createElement("dd");
    dd.className = "data";
    dd.textContent = data;
    return dd;
}


// Template
//  <a href = "newpage.html?country=AFG" class="country-wrapper" >
//     <img width="400" src="https://flagcdn.com/af.svg" alt="">
//         <div class="country-data">
//             <div class="country-title">Afghanistan</div>
//             <div>Population: <span class="data">40218234</span></div>
//             <div>Region: <span class="data">Asia</span></div>
//             <div>Capital: <span class="data">Kabul</span></div>
//         </div>
// </a>