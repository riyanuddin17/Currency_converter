const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

const countryList = {
  USD: "US",
  NPR: "NP",
  SAR: "SA",
  QAR: "QA",
  EUR: "FR",
  INR: "IN",
  AED: "AE",
  CAD: "CA",
  PKR: "PK",
};

for (let i = 0; i < dropList.length; i++) {
  for (let currencyCode in countryList) {
    let selected = (i === 0 && currencyCode === "USD") || (i === 1 && currencyCode === "INR") ? "selected" : "";
    let optionTag = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in countryList) {
    if (code === element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${countryList[code].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  if (amountVal === "" || amountVal === "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let baseCurrency = fromCurrency.value;
  let targetCurrency = toCurrency.value;
  let url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.rates[targetCurrency];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${baseCurrency} = ${totalExRate} ${targetCurrency}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}

