const Base_URL = "https://api.fxratesapi.com/latest";
const API_KEY = "YOUR_API_KEY"; 
let msg=document.querySelector("#msg")
let btn = document.querySelector("#btn");
let dropdowns = document.querySelectorAll(".dropdown select");
let fromCurr = document.querySelector("#selectfrom");
let toCurr = document.querySelector("#selectto");

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "BDT") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal == "" || amtVal < 0) {
        amtVal = 0;
        amount.value = "0";
    }
    let URL = `${Base_URL}?base=${fromCurr.value.toUpperCase()}&symbols=${toCurr.value.toUpperCase()}&apikey=${API_KEY}`;
    try {
        let response = await fetch(URL);
        let data = await response.json();
    
        if (!response.ok || data.error) {
            throw new Error(data.error?.message || "Invalid API response");
        }
    
        let conversionRate = data.rates[toCurr.value.toUpperCase()];
        if (!conversionRate) {
            throw new Error("Conversion rate not found");
        }
    
        let convertedAmount = (amtVal * conversionRate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } catch (error) {
        console.error('Error fetching data:', error);
        msg.innerText = "Error: Unable to fetch conversion rate.";
    }
    
});
