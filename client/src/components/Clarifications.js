import React from "react"
import NavBar from "./NavBar"
import discord from "../images/discord.jpg"
export default function Clarifications()
{
    return ( 
        <div>
            <NavBar current = "Clarifications" />
            <div className = "container-fluid" style={{textAlign:"center"}}>
                <div className="row">
                    <div className = "col-lg-12 col-md-12 col-sm-12">
                        <div id="info">
                            <br/>
                            <h3>😕 Have any questions?</h3>
                            <br/>
                            <h4>Ask on the <u>Clarifications</u> channel on the RRHS CS UIL Discord Server.</h4>
                        </div>
                        <h4><a>Join Link: https://discord.gg/8WDPSwq7jG</a></h4>
                        <img src={discord} width={400} alt="discord_img"/>
                    </div>
                </div>
            </div>
        </div>
    )
}