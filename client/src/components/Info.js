import React, {useState,useEffect} from "react"
import dragon from "../images/rrhsdragon.jpg"
export default function Info()
{
    return(
        <div id = "login-background" className = "col-lg-6 col-md-4 col-sm-4">
            <h3 id="head">Important Information</h3>
            <div id="info" style={{textAlign:"left",color:"black"}}>
                <div style={{marginLeft:"10px"}}>
                    <h4>About the Test</h4>
                    <ul>
                        <li>45 minute - 40 Question Multiple Choice Test</li>
                        <li>2 hour - 12 Question - 3 Person Team Hands-On Programming</li>
                        <li><a target="_blank" href="https://drive.google.com/file/d/1N6l3W4-oBWYyhAQIRvC4QtLmBkNZRR7w/view">Topic List</a></li>
                    </ul>
                    
                    <h4>Dry Run</h4>
                    <ul>
                        <li><a target="_blank" href="https://www.cs.utexas.edu/~scottm/uil/2007/Dry%20Run.pdf">Dry Run Problem</a></li>
                        <li><a target="_blank" href="https://drive.google.com/file/d/1_teFDc8n9rTXlUqDi4ka0VuD11XUM6ez/view?usp=sharing">Dry Run Solution</a></li>
                        <li><a target="_blank" href="https://docs.oracle.com/javase/7/docs/api/java/util/Scanner.html">Scanner Documentation</a></li>
                    </ul>
                    <h4>Java IDE</h4>
                    <ul>
                        <li>IntelliJ IDEA (Recommended)</li>
                        <li>Eclipse</li>
                    </ul>
                    <h4>Java Documentation</h4>
                    <ul>
                        <li><a target="_blank" href="https://www.google.com/url?q=https%3A%2F%2Fdocs.oracle.com%2Fjavase%2F8%2Fdocs%2Fapi%2Findex.html%3Foverview-summary.html&sa=D&sntz=1&usg=AFQjCNFXFnUq7MLxoahXVeKhqMZQG49_5w">Java Docs</a></li>
                    </ul>
                </div>  
            </div>

            <img id = "dragon-img" alt="Dragon" src = {dragon}/>
        </div>
    )
}