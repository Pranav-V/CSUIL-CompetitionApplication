import React from "react"
import {Link} from "react-router-dom"
export default function AdminBar(props)
{
    return (
        <nav className="navbar navbar-expand-md bg-dark navbar-dark">
            <p className="navbar-brand">RRHS CS UIL</p>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavbar">
                <ul className="navbar-nav">
                <li className="nav-item">
                    {props.current === "Home" ? <b className="nav-link" to="/">General Settings</b> :<Link className="nav-link" to="/home">General Settings</Link>}
                </li>
                <li className="nav-item">
                    {props.current === "MC" ? <b className="nav-link" to="/">Written Response Grading</b> :<Link className="nav-link" to="/multiplechoice">Written Response Grading</Link>}  
                </li>
                <li className="nav-item">
                    {props.current === "Written" ? <b className="nav-link" to="/">Rankings</b> :<Link className="nav-link" to="/writtenresponse">Rankings</Link>}
                </li> 
                <li className="nav-item">
                    {props.current === "Clarifications" ? <b className="nav-link" to="/">Clarifications</b> :<Link className="nav-link" to="/writtenresponse">Clarifications</Link>}
                </li>   
                </ul>
            </div>  
        </nav>
    )
}