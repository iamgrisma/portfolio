function loadForex() {
    var today = new Date();
    var fromDate = formatDate(today);
    var toDate = formatDate(today);
    var perPage = 100; // Number of items per page
    var page = 1; // Current page
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.nrb.org.np/api/forex/v1/rates?from=" + fromDate + "&to=" + toDate + "&per_page=" + perPage + "&page=" + page);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status.code === 200) {
                var data = response.data;
                var ratesData = data.payload[0];
                var rates = ratesData.rates;
                var tableTitleElement = document.getElementById("table-title");
                var headerDate = new Date(ratesData.date);
                tableTitleElement.textContent = "Foreign Exchange Rates as Per Nepal Rastra Bank for " + formatDateLong(headerDate);
                var tableContainer = document.createElement("div");
                tableContainer.className = "forex-table-container";
                var table = document.createElement("table");
                table.className = "forex-table";
                // Create table header
                var headerRow = table.insertRow();
                var headers = ["SN", "Currency Name (ISO3)", "Unit", "Buying Rate", "Selling Rate"];
                for (var j = 0; j < headers.length; j++) {
                    var th = document.createElement("th");
                    th.textContent = headers[j];
                    headerRow.appendChild(th);
                }
                // Create table rows
                for (var k = 0; k < rates.length; k++) {
                    var rate = rates[k];
                    var currency = rate.currency;
                    var row = table.insertRow();
                    row.insertCell().textContent = (k + 1).toString();
                    var currencyCell = row.insertCell();
                    currencyCell.className = "currency";
                    // Add country flag to the currency column
                    var flagEmoji = getFlagEmoji(currency.iso3);
                    currencyCell.innerHTML = `${flagEmoji} ${currency.name} (${currency.iso3})`;
                    row.insertCell().textContent = currency.unit;
                    row.insertCell().textContent = rate.buy;
                    row.insertCell().textContent = rate.sell;
                }
                tableContainer.appendChild(table);
                document.getElementById("forex-table").appendChild(tableContainer);
                // Create a ticker with exchange rates and country flags (represented by emojis)
                var tickerElement = document.getElementById("ticker");
                for (var i = 0; i < rates.length; i++) {
                    var rate = rates[i];
                    var currencyCode = rate.currency.iso3;
                    var flagEmoji = getFlagEmoji(currencyCode);
                    var rateElement = `${flagEmoji} ${currencyCode}: ${rate.buy}/${rate.sell}   `;
                    tickerElement.innerHTML += rateElement;
                }
            } else {
                alert("Error loading forex rates: " + response.status.code);
            }
        } else {
            alert("Error loading forex rates: " + xhr.status);
        }
    };
    xhr.send();
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
}

function formatDateLong(date) {
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
}

function getFlagEmoji(iso3) {
    // Replace with actual flag emojis for each country code
    var flagEmojis = {
        "USD": "🇺🇸",
        "EUR": "🇪🇺",
        "GBP": "🇬🇧",
        "CHF": "🇨🇭",
        "AUD": "🇦🇺",
        "CAD": "🇨🇦",
        "SGD": "🇸🇬",
        "JPY": "🇯🇵",
        "CNY": "🇨🇳",
        "SAR": "🇸🇦",
        "QAR": "🇶🇦",
        "THB": "🇹🇭",
        "AED": "🇦🇪",
        "MYR": "🇲🇾",
        "KRW": "🇰🇷",
        "SEK": "🇸🇪",
        "DKK": "🇩🇰",
        "HKD": "🇭🇰",
        "KWD": "🇰🇼",
        "BHD": "🇧🇭",
    };
    return flagEmojis[iso3] || "🇮🇳"; // Default flag emoji if not found
}

loadForex();
