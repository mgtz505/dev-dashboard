const weather = require("weather-js")
const util = require("util")

const findWeather = util.promisify(weather.find)

findWeather({search: "New York, NY", degreeType: "F"})
    .then(result => {
        console.log(JSON.stringify(result, null, 2))
    })
    .catch(error => {
        console.error(error)
    })
    