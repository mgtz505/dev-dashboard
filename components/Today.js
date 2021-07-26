import React, { useState, useEffect, useCallback } from "react"
import useInterval from "@use-it/interval"
import figlet from "figlet"
import weather from "weather-js"
import util from "util"

const findWeather = util.promisify(weather.find)

const FONTS = [
    "Straight",
    "ANSI Shadow",
    "Shimrod",
    "doom",
    "Big",
    "Ogre",
    "Small",
    "Standard",
    "Mini",
    "Small Script",
    "Small Shadow"
]

const formatWeather = ([ results ]) => {
    const { location, current, forecast } = results
    
    const temperature = `${current.temperature}°F`
    const conditions = current.skytext
    const low = `${forecast[1].low}°F`
    const high = `${forecast[1].high}°F`

    return `${temperature} and ${conditions} (${low} -> ${high})`
}


export default function Today ({ updateInterval = 900000, search = "New York, NY", degreeType = "F" }) {  //15 minutes
const [fontIndex, setFontIndex] = useState(0)

const [now, setNow] = useState(new Date())

const [weather, setWeather] = useState({
    status: "loading",
    error: null,
    data: null
})

const fetchWeather = useCallback(async () => {
    setWeather({ status: "loading", error: null, data: null})
    let data;
    try {
        data = await findWeather({ search, degreeType})
        setWeather({ status: "complete", error: null, data})
    } catch( error ) {
        setWeather({ status: "error", error, data: null})
    }
}, [search, degreeType])

useEffect(() => {
    fetchWeather()
},[fetchWeather])

useInterval(() => {
    setNow(new Date())
}, 60000)   //1 Minute


useInterval(() => {
    fetchWeather()
}, updateInterval)

const date = now.toLocaleString(
    "en-US",
    {
        month: "long",
        day: "numeric",
        year: "numeric",
    
    }
)

const time = figlet.textSync( now.toLocaleString(
    "en-US",
    {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }
),{
    font: FONTS[fontIndex % FONTS.length]
})

    return <box
    top="center"
    left="center"
    width="50%"
    height="50%"
    border={{ type: "line"}}
    style={{border: {fg: "blue"}}}
    >{`Today is ${date}
    
    
   ${time}
   
   ${weather.status === "loading" ? "Loading..." : weather.error ? `Error: ${weather.error}` : formatWeather(weather.data) }`}</box>
}