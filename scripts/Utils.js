
export function insertCommas(numberStr) {
    if (numberStr.includes(".")) {
        let parts = numberStr.split('.');
        let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let decimalPart = parts.length > 1 ? '.' + parts[1] : '';
        return integerPart + decimalPart;
    }

    return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function setMode(modeInput) {
    const mode = sessionStorage.getItem("mode");
    if (mode) {
        modeInput.checked = (mode === "dark");
        changeMode(modeInput);
    }
}

export function changeMode(modeInput) {
    const body = document.querySelector("body");
    const icon = document.querySelector(".fa-moon");
    if (modeInput.checked) {
        body.classList.add("dark");
        body.classList.remove("light");
        icon.className = "fa-solid fa-moon"
        sessionStorage.setItem("mode", "dark");
    } else {
        body.classList.add("light");
        body.classList.remove("dark");
        icon.className = "fa-regular fa-moon";
        sessionStorage.setItem("mode", "light");
    }
}