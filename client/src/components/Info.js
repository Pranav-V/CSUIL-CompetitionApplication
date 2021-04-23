import React from "react"
import dragon from "../images/rrhsdragon.jpg"
export default function Info()
{
    return(
        <div id = "login-background" className = "col-lg-6 col-md-4 col-sm-4">
            <h3 id="head">Important Information</h3>
            <div id="info">
                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            </div>
            <img id = "dragon-img" alt="Dragon" src = {dragon}/>
        </div>
    )
}