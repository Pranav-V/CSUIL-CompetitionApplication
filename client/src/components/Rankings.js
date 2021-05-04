import AdminBar from "./AdminBar"
import React, {useState,useEffect} from "react";
import {useCookies} from "react-cookie"
import {useHistory} from "react-router-dom"
import axios from "axios"
export default function Rankings()
{

    return ( 
        <div>
            <AdminBar />
            <br/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div id="ranking-content">
                            <h3>Contest Rankings</h3>
                            <br/>
                            <b>Info</b>
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider" />
                            </label>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}