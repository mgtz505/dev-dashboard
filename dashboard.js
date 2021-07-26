import React from "react"
import blessed from "blessed"
import { render } from "react-blessed"
import Today from "./components/Today"



const App = () => {

    return (
        <Today updateInterval={1000}/>
    )
}


const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: "Develop Dashboard"  
})


screen.key(
    ["escape", "q", "C-c"],
    () => process.exit(0)
)

render(<App />, screen)