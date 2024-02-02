const fetch = require("node-fetch");

const graphQLQuery = async (url, query, variables = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const res = await response.json();
  return res.data;
};

const addCityQuery = `mutation Mutation($cityName: String!, $visited: Boolean) {
    addCity(cityName: $cityName, visited: $visited) {
      cityName
      visited
    }
  }`;

const updateCityQuery = `mutation Mutation($cityName: String!, $visited: Boolean!) {
    updateCity(cityName: $cityName, visited: $visited) {
      cityName
      visited
    }
  }`;

const getAllCitiesQuery = ` query GetAllCities {
            getAllCities {
                cityName
                visited
            }
          }`;

const getCityByNameQuery = `
          query GetCityByName($cityName: String!) {
          getCityByName(cityName: $cityName) {
          cityName
          visited
           }
              }`;

const getByNameQueryVars = {
  cityName: "Lisbon",
};

const updateCityQueryVars = {
  cityName: "Berlin",
  visited: false,
};
const getAllCitiesQueryVars = `{
            cityName,
            visited,
          }; `;

const url = "http://localhost:5000/graphql";

///--------

const listTheCities = document.querySelector(".listTheCities");
const cityContainer = document.querySelector(".cityContainer");
const citySelection = document.querySelector("#city-selection");

//filter and return not-visited cities
const myCities = async () => {
  let response = await graphQLQuery(url, getAllCitiesQuery);
  let cityList = response.getAllCities;

  let newList = cityList.filter((city) => {
    return city.visited === false;
  });

  return newList;
};

//filter and return visited cities
const myVisitedCities = async () => {
  let response = await graphQLQuery(url, getAllCitiesQuery);
  let cityList = response.getAllCities;

  let visitedCities = cityList.filter((city) => {
    return city.visited === true;
  });

  return visitedCities;
};

let cities = [];
let visitedCities = [];

const displayCities = async () => {
  cities = await myCities();

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.cityName;
    option.innerText = city.cityName;
    option.setAttribute("id", "cityOption");
    citySelection.append(option);
  });
  console.log(cities);
};

displayCities();

const updateCity = async (cityName, visited) => {
  console.log(visited);

  let response = await graphQLQuery(url, updateCityQuery, {
    cityName,
    visited,
  });

  return response.data;
};

const displayAcity = async (cityName) => {
  let response = await graphQLQuery(url, getCityByNameQuery, {
    cityName,
  });

  return response.getCityByName;
};

citySelection.addEventListener("change", async (e) => {
  cityContainer.innerHTML = "";
  const cityName = e.target.value;
  const city = await displayAcity(cityName);

  const changeForm = document.createElement("form");
  const submitChange = document.createElement("button");
  const changeBox = document.createElement("div");
  changeBox.classList.add("changeBox");
  submitChange.type = "submit";
  submitChange.classList.add("submitChange");
  submitChange.innerHTML = "Been there!";

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = "";
  const checkLabel = document.createElement("label");
  checkBox.name = "city";
  checkBox.classList.add("cityCheck");
  checkLabel.classList.add("cityLabel");
  checkLabel.name = "city";
  checkLabel.innerHTML = city.cityName;
  changeForm.classList.add("changeForm");

  changeBox.append(checkBox, checkLabel);
  changeForm.append(changeBox, submitChange);
  cityContainer.append(changeForm);

  checkBox.addEventListener("click", async (e) => {
    const visited = e.target.checked;

    const updatedCity = await updateCity(city.cityName, visited);
    console.log(updatedCity);
  });
});

const displayVisitedCities = async () => {
  visitedCities = await myVisitedCities();
  const visitedCitiesContainer = document.querySelector(".visitedCities");
  visitedCities.forEach((city) => {
    const cityElement = document.createElement("p");
    cityElement.innerHTML = city.cityName;
    visitedCitiesContainer.appendChild(cityElement);
  });

  const citiesAmount = document.querySelector(".citiesAmount");
  citiesAmount.innerHTML = visitedCities.length;

  console.log(visitedCities);
  console.log(visitedCities.length);
};

displayVisitedCities();

const addCityToTheWishlist = async () => {
  const addForm = document.querySelector(".addACity");
  const cityNameInput = document.querySelector("#cityInput");

  addForm.addEventListener("submit", async () => {
    alert(
      "A friendly reminder! Don't forget to choose sustainable transportation means while traveling!"
    );
    let newCity = await graphQLQuery(url, addCityQuery, {
      cityName: cityNameInput.value,
    });
    console.log(newCity);
  });
};

addCityToTheWishlist();
