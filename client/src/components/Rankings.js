import AdminBar from "./AdminBar"
import React, {useState,useEffect} from "react";
import {useCookies} from "react-cookie"
import {useHistory} from "react-router-dom"
import axios from "axios"
export default function Rankings()
{
    const [irank,setirank] = useState([])
    const [trank,settrank] = useState([])
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin','frqproblems','teamscoremc','currentTeams','currentAnswers','frnames'])
    const history = useHistory()
    const [checked,setchecked] = useState(false)
    if(cookies.authorized==null)
    {
        history.push("/")
    }
    const q = {
        "username" : cookies.data!=null?cookies.data[0].username:"", 
        "password" : cookies.data!=null?cookies.data[0].password:""
    }
    useEffect(() => {
        axios.post("/users/authenticate", q)
            .then(res => {
                const [status,info] = res.data
                if(status === "Authorized" && info[0].isAdmin)
                {
                    setCookie('data',info,{path: '/'})
                }
                else
                {
                    removeCookie('authorized')
                    removeCookie('data')
                    removeCookie('team')
                    history.push("/")
                }   
            })
            .catch(err => console.log(err))
        axios.post("/users/individualrank")
            .then(res => setirank(res.data))
            .catch(err => console.log(err))
    },[])
    function toggle()
    {
        if(document.getElementById("filter").checked)
        {
            axios.post("/team/teamrank")
                .then(res => {
                    settrank(res.data)
                    setchecked(true)
                })
                .catch(err => console.log(err))
        }
        else
        {
            axios.post("/users/individualrank")
            .then(res => {
                setirank(res.data)
                setchecked(false)})
            .catch(err => console.log(err))
        }
    }
    var display = []
    if(!checked)
    {
        
        if(irank.length!=0)
        {
            display = irank.map((e,i) => {
                return(
                <div className = "col-lg-12 col-md-12 col-sm-12">
                    <div id="placement-container">
                        <h4 style={{textAlign:"left"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{i+1}.&nbsp; {e[0]} &nbsp;&nbsp;&nbsp;[Score: {e[1]} | Team: {e[2]}]</h4>
                    </div>  
                </div>)
            })
        }
    }
    else
    {
        if(trank.length!=0)
        {
            display = trank.map((e,i) => {
                return(
                    <div className = "col-lg-12 col-md-12 col-sm-12">
                        <div id="placement-container">
                            <h4 style={{textAlign:"left"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{i+1}.&nbsp; Team {e[0]} &nbsp;&nbsp;&nbsp;[Team Score: {e[1]} | Team Written Score: {e[2]} | Team Multiple Choice Score: {e[1]-e[2]}]</h4>
                        </div>  
                    </div>)
            })
        }
    }
        
    return ( 
        <div>
            <AdminBar />
            <br/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div id="ranking-content">
                            <h2>🏆 Contest Rankings 🏆</h2>
                            <br/>
                            <div id="filter-toggle">
                                <h4>Change Filter</h4>
                                <label className="switch">
                                    <input checked = {checked} onClick={toggle} id="filter" type="checkbox"/>
                                    <span className="slider" />
                                </label>
                                <h4> (Individual | Team)</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12" id="ranking-container">
                        <br/>
                        <h3>{checked==true?"Team":"Individual"} Ranking</h3>
                        <br/>
                        {display}
                        <br/>
                        <br/>
                    </div>     
                </div>
            </div>
            
        </div>
    )
}