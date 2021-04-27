import React, {useEffect,useState} from "react"
import {useCookies} from "react-cookie"
import axios from "axios"
import {useHistory} from "react-router-dom"
import AdminBar from "./AdminBar"

export default function AdminHome()
{
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin','frqproblems','teamscoremc','currentTeams'])
    const [content,setcontent] = useState(cookies.currentTeams!=null?cookies.currentTeams:"")
    const q = {
        "username" : cookies.data[0].username, 
        "password" : cookies.data[0].password
    }
    const history = useHistory()

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
        axios.post("/admin/adminSettings")
            .then(res => setCookie('admin',res.data,{path: '/'}))
            .catch(err => console.log(err))
        
        axios.post("/users/getMap")
            .then(res => {
                setCookie('currentTeams',res.data,{path: '/'})
                setcontent(res.data)
            })
        
    }, [])
    function deleteInfo()
    {
        var retInfo = document.getElementById("team-adder").value
        if(!retInfo.includes("#!#!"))
        {
            alert("Lack Database Credentials")
            return
        }
        axios.post("/users/deleteAll")
            .then(() => {
                console.log("worked")
                axios.post("/admin/clearCount")
                    .then(() => window.location.reload())
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))  
    }
    function addInfo()
    {
        var retInfo = document.getElementById("team-adder").value
        if(!retInfo.includes("#!# "))
        {
            alert("Lack Database Credentials")
            return
        }
        var newInfo = retInfo.substring(4).split(" ")
        var currentCount = cookies.admin[0].currentTeamCount
        for(var i=0; i<newInfo.length; i++)
        {
            var promises = []
            var names = newInfo[i].substring(1,newInfo[i].length-1).split(",")
            for(var j=0; j<names.length;j++)
            {
                promises.push(axios.post("/users/adduser", {
                    "username" : (""+names[j]+(Math.floor(Math.random()*1000))),
                    "password" : (""+Math.floor(Math.random()*10000+999)), 
                    "team" : currentCount,
                    "name" : names[j],
                    "isAdmin" : false 
                }))

            }
            promises.push(axios.post("/team/createteam",{
                "teamNumber" : currentCount
            }))
            
            currentCount++
            promises.push(axios.post("/admin/updateCount"))

        }
        Promise.allSettled(promises).then(()=> {
            window.location.reload()
        })   
    }
    function changeMC()
    {
        axios.post("/admin/updateMC")
            .then(() => console.log("updated"))
            .catch(err => console.log(err))
    }
    return ( 
        <div>
            <AdminBar current = "Home"/>
            <div id="client-home-body">
                <br/>
                <h4>Hey {cookies.data[0].name}! Ready to grade? 😃</h4>
                <div className = "container-fluid">
                    <div className = "row">
                        <div className = "col-lg-3 col-md-3 col-sm-0">

                        </div>
                        <div className = "col-lg-6 col-md-6 col-sm-12">
                            <div id = "live-settings">
                                <span>
                                    <b>Multiple Choice Enabled: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                                    <label className="switch">
                                        <input onClick = {changeMC} type="checkbox"/>
                                        <span className="slider round"/>
                                    </label>
                                </span>
                                <br/>
                                <span>
                                    <b>Written Response Enabled:&nbsp;&nbsp; </b>
                                    <label className="switch">
                                        <input type="checkbox"/>
                                        <span className="slider round"/>
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div className = "col-lg-3 col-md-3 col-sm-0">
                            
                        </div>
                    </div>
                    <div className = "row">
                       <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div  className = "row" id="manage-teams">
                                <div className = "col-lg-6 col-md-6 col-sm-12">
                                    <textarea spellCheck="false" value={content} readOnly disabled id="team-displayer"/>
                                </div>
                                <div className = "col-lg-6 col-md-6 col-sm-12">
                                    <div className = "row">
                                        <div className = "col-lg-9 col-md-9 col-sm-12">
                                            <textarea spellCheck="false" id="team-adder"/>                              
                                        </div>
                                        <div className = "col-lg-3 col-md-3 col-sm-12">
                                            <br/>
                                            <button onClick = {addInfo} id="submit-fr">Add</button>
                                            <br/>
                                            <br/>
                                            <button onClick = {deleteInfo} id="submit-fr">Clear All</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div id = "current-answers">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}