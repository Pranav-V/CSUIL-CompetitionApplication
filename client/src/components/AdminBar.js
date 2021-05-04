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
                    {props.current === "Home" ? <b className="nav-link" to="/">General Settings</b> :<Link className="nav-link" to="/admin_home">General Settings</Link>}
                </li>
                <li className="nav-item">
                    {props.current === "WRGrade" ? <b className="nav-link" to="/">Written Response Grading</b> :<Link className="nav-link" to="/admin_wrgrading">Written Response Grading</Link>}  
                </li>
                <li className="nav-item">
                    {props.current === "Written" ? <b className="nav-link" to="/">Rankings</b> :<Link className="nav-link" to="/admin_rankings">Rankings</Link>}
                </li>    
                </ul>
            </div>  
        </nav>
    )
}