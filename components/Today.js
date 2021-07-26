import React, { useState} from "react"
import useInterval from "@use-it/interval"
import figlet from "figlet"



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


export default function Today ({ updateInterval = 1000 }) {
const [fontIndex, setFontIndex] = useState(0)

useInterval(() => {
    setFontIndex(fontIndex + 1)
}, updateInterval) 


const now = new Date()
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
    
    
   ${time}`}</box>
}