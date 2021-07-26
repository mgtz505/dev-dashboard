import React, { useState, useEffect, useCallback, useMemo } from "react"
import useInterval from "@use-it/interval"
import figlet from "figlet"
import weather from "weather-js"
import util from "util"
import useDeepCompareEffect from "use-deep-compare-effect"
import chalk from "chalk"
import graident from "gradient-string"

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


//Custom Hook
const useRequest = (promise, options, interval = null) => {
    const [state, setState] = useState({
        status: "loading",
        error: null,
        data: null
    })
    
    const request = useCallback(async options => {
        setState({ status: "loading", error: null, data: null})
        let data;
        try {
            data = await promise(options)
            setState({ status: "complete", error: null, data})
        } catch ( error ) {
            setState({ status: "error", error, data: null})
        }
    }, [promise])
    
    useDeepCompareEffect(() => {
        request(options)
    },[options, request])
    
    useInterval(() => {
        request(options)
    }, interval)

    return state
}



const formatWeather = ([ results ]) => {
    const { location, current, forecast } = results
    
    const temperature = `${current.temperature}°F`
    const conditions = current.skytext
    const low = `${forecast[1].low}°F`
    const high = `${forecast[1].high}°F`

    return `${chalk.yellow(temperature)} and ${chalk.green(conditions)} (${chalk.blue(low)} -> ${chalk.red(high)})`
}


export default function Today ({ updateInterval = 900000, search = "New York, NY", degreeType = "F" }) {  //15 minutes
const [fontIndex, setFontIndex] = useState(0)

const [now, setNow] = useState(new Date())

const options = useMemo(() => ({search, degreeType}),[search,degreeType])

const weather = useRequest(
    findWeather,
    options,
    updateInterval
)


// const [weather, setWeather] = useState({
//     status: "loading",
//     error: null,
//     data: null
// })

// const fetchWeather = useCallback(async () => {
//     setWeather({ status: "loading", error: null, data: null})
//     let data;
//     try {
//         data = await findWeather({ search, degreeType})
//         setWeather({ status: "complete", error: null, data})
//     } catch( error ) {
//         setWeather({ status: "error", error, data: null})
//     }
// }, [search, degreeType])

// useEffect(() => {
//     fetchWeather()
// },[fetchWeather])

// useInterval(() => {
//     fetchWeather()
// }, updateInterval)

useInterval(() => {
    setNow(new Date())
}, 60000)   //1 Minute



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
    >{`Today is ${chalk.blue(date)}
    
    
   ${time}
   
   ${weather.status === "loading" ? "Loading..." : weather.error ? `Error: ${weather.error}` : formatWeather(weather.data) }`}</box>
}