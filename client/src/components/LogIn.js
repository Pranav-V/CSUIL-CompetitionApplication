import React from "react"
import Log from "./Log"
import Info from "./Info"
export default function LogIn()
{
    
    return ( 
        <>
            <div className = "container-fluid">
                <div id = "wrapper" className = "row">
                    <Log/>
                    <Info />
                </div>
            </div>
        </>
    )
}