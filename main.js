// API keys
// .gitignore
// chaining calls

// create event listener


// pull out value from text boxes
// make api call with address & api key
// `https://geocode.maps.co/search?q=${city},tn&api_key=${key}`
// we get the coordinates => make sat api call with coordinates & NORAD code
// https://sat.terrestre.ar/passes/25544?lat=35.14&lon=-90.05&limit=1
// we get the data on the rise, set, etc => display to html



document.getElementById("search").addEventListener("click", function () {
    const locationInput = document.getElementById("location").value
    const noradInput = document.getElementById("norad").value


    if (!locationInput || !noradInput) {
        alert("Please enter both an address and a NORAD ID.");
        return;
    }

    const encodedLocation = encodeURI(locationInput)
    const geoUrl = `https://geocode.maps.co/search?q=${locationInput},tn&api_key=${key}`

    fetch(geoUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (geoData) {
            if (!geoData || geoData.length === 0) {
                alert("Location not found. Please try again.");
                return;
            }

            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            console.log("Latitude:", lat);
            console.log("Longitude:", lon);

            document.getElementById("coordinates").innerHTML =
                `<strong>Latitude:</strong> ${lat} <br> <strong>Longitude:</strong>
            ${lon}`;

            const satUrl = "https://satellites.fly.dev/passes/" + noradInput +
                "?lat=" + lat + "&lon=" + lon +
                "&limit=1&days=15&visible_only=true";

            return fetch(satUrl);
        })
        .then(function (response) {
            if (!response) return;
            return response.json();
        })
        .then(function (satData) {
            if (!satData || satData.length === 0) {
                alert("No visible passes found for that satellite.");
                return;
            }

            const riseTime = new Date(satData[0].rise.utc_datetime);
            const culminationTime = new Date(satData[0].culmination.utc_datetime)
            const setTime = new Date(satData[0].set.utc_datetime)

            alert("Next visible pass: " + riseTime.toLocaleString());

            document.getElementById("satellite-info").innerHTML = `
        <strong>Next Visible Pass:</strong><br>
        <strong>Rise:</strong> ${riseTime.toLocaleString()}<br>
        <strong>Culmination:</strong>
         ${culminationTime.toLocaleString()}<br>
        <strong>Set:</strong> ${setTimeout.toLocaleString()}`;
        })
        .catch(function (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });
});

