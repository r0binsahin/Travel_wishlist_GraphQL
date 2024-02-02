const path = require("path");
const fsPromises = require("fs/promises");
const { fileExists, getDirectoryFileNames } = require("../utils/fileHandling");
const { GraphQLError, printType, visit } = require("graphql");
const { dir } = require("console");
//const crypto = require('crypto')
const axios = require("axios").default;

const directory = path.join(__dirname, "..", "data", "cities");

exports.resolvers = {
  Query: {
    getAllCities: async (_, args) => {
      let cityData = await getDirectoryFileNames(directory);
      let cities = [];

      for (const file of cityData) {
        const filePath = path.join(directory, file);
        const fileContents = await fsPromises.readFile(filePath, {
          encoding: "utf-8",
        });
        const data = JSON.parse(fileContents);
        cities.push(data);
      }

      return cities;
    },

    getCityByName: async (_, args) => {
      const cityName = args.cityName;
      const filePath = path.join(directory, `${cityName}.json`);

      const citiesExists = await fileExists(filePath);

      if (!citiesExists) return new GraphQLError("The data does not exist");

      const citiesData = await fsPromises.readFile(filePath, {
        encoding: "utf-8",
      });
      const city = JSON.parse(citiesData);

      return city;
    },
  },

  Mutation: {
    updateCity: async (_, args) => {
      const { cityName, visited } = args;
      const filePath = path.join(directory, `${cityName}.json`);

      const projectExists = await fileExists(filePath);
      if (!projectExists)
        return new GraphQLError("That project does not exist");

      const updatedCity = {
        cityName,
        visited,
      };

      await fsPromises.writeFile(filePath, JSON.stringify(updatedCity));

      return updatedCity;
    },

    addCity: async (_, args) => {
      const cityName = args.cityName;
      const visited = args.visited;

      if (args.cityName.length === 0)
        return new GraphQLError("City name must be at least 1 character");

      const newCity = {
        cityName,
        visited: visited || false,
      };

      const filePath = path.join(directory, `${cityName}.json`);

      const exists = await fileExists(filePath);

      if (exists) {
        return new GraphQLError("City already exists");
      }

      await fsPromises.writeFile(filePath, JSON.stringify(newCity));
      console.log(cities);

      return newCity;
    },
  },
};
