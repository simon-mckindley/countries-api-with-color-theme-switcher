class Api {

    async getCountryData() {
        try {
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

}

export default new Api;