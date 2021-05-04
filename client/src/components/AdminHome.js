import React, {useEffect,useState} from "react"
import {useCookies} from "react-cookie"
import axios from "axios"
import {useHistory} from "react-router-dom"
import AdminBar from "./AdminBar"

export default function AdminHome()
{
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','admin','frqproblems','currentTeams','currentAnswers','frnames'])
    const [mcCheck,setmcCheck] = useState(false)
    const [frCheck,setfrCheck] = useState(false)
    const [content,setcontent] = useState(cookies.currentTeams!=null?cookies.currentTeams:"")
    const [mcAnswers,setmcAnswers] = useState(cookies.currentAnswers!=null?cookies.currentAnswers:"")
    const [frNames,setfrNames] = useState(cookies.frnames!=null?cookies.frnames:"")
    
    const history = useHistory()
    if(cookies.authorized==null)
    {
        history.push("/")
    }
    const q = {
        "username" : cookies.data[0].username, 
        "password" : cookies.data[0].password
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
        axios.post("/answer/getProblemNames",{"frqID":0})
            .then(res => {
                setCookie('frqproblems',res.data,{path: '/'})
            })
            .catch(err => console.log(err))
        axios.post("/admin/adminSettings")
            .then(res => {
                setmcCheck(res.data[0].MCtestEnabled)
                setfrCheck(res.data[0].WrittentestEnabled)
                setCookie('admin',res.data,{path:'/'})})
            .catch(err => console.log(err))
        
        axios.post("/answer/retrieveanswers",{"frqID":"0"})
            .then(res => {
                setCookie('currentAnswers',res.data[0].answers,{path: '/'})
                setCookie('frnames',res.data[0].frqNames,{path:'/'})
                setfrNames(res.data[0].frqNames)
                setmcAnswers(res.data[0].answers)
            })
            .catch(err => console.log(err))
        
        axios.post("/users/getMap")
            .then(res => {
                setCookie('currentTeams',res.data,{path: '/'})
                setcontent(res.data)
            })
        axios.post("/admin/adminSettings")
            .then(res => setCookie('admininfo',res.data,{path:'/'}))
            .catch(err => console.log(err))
        
    }, [])
    function deleteInfo()
    {
        var retInfo = document.getElementById("team-adder").value
        if(!retInfo.includes("#!#"))
        {
            alert("Lack Database Credentials")
            return
        }
        axios.post("/users/deleteAll")
            .then(() => {
                axios.post("/admin/clearCount")
                    .then(() => {
                        axios.post("/question/delete")
                        .then(() => {
                            axios.post("/team/delete")
                                .then(() => {
                                    window.location.reload()
                                })
                                .catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                    })
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
                "number" : currentCount
            }))
            
            currentCount++
            promises.push(axios.post("/admin/updateCount"))

        }
        Promise.allSettled(promises).then(()=> {
            window.location.reload()
        })   
    }
    function changeMC(event)
    {
        setmcCheck(!mcCheck)
        axios.post("/admin/updateMC")
            .then(() => console.log("updated"))
            .catch(err => console.log(err))
    }
    function changeFR(event)
    {
        setfrCheck(!frCheck)
        axios.post("/admin/updateFR")
            .then(() => console.log("updated"))
            .catch(err => console.log(err))
    }
    function addMCInfo()
    {
        var retInfo = document.getElementById("mc-adder").value
        if(!retInfo.includes("#!# "))
        {
            alert("Lack Database Credentials")
            return
        }
        var answerData = retInfo.split(" ")[1]
        axios.post('/answer/changeMC', {"answers":answerData})
            .then(() => {
                window.location.reload()
            })
            .catch(err => console.log(err))
    }
    function addFRQNames()
    {
        var retInfo = document.getElementById("question-adder").value
        if(!retInfo.includes("#!# "))
        {
            alert("Lack Database Credentials")
            return
        }
        var answerData = retInfo.split(" ")[1]
        axios.post('/answer/changeFRQ', {"frqNames":answerData})
            .then(() => {
                window.location.reload()
            })
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
                                        <input checked = {mcCheck} onChange = {changeMC} type="checkbox"/>
                                        <span className="slider round"/>
                                    </label>
                                </span>
                                <br/>
                                <span>
                                    <b>Written Response Enabled:&nbsp;&nbsp; </b>
                                    <label className="switch">
                                        <input checked = {frCheck} onChange = {changeFR} type="checkbox"/>
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
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <h3><u>Manage Teams</u></h3>
                                </div>
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
                        <div className = "col-lg-6 col-md-6 col-sm-12">
                            <div id = "current-answers">
                                <h3><u>Change MC Answers</u></h3>
                                <textarea spellCheck="false" value={mcAnswers} readOnly disabled id="mc-answers"/>
                                <textarea spellCheck="false" id="mc-adder"/>
                                <button onClick={addMCInfo} id="submit-fr">Submit</button>
                            </div>
                        </div>
                        <div className = "col-lg-6 col-md-6 col-sm-12">
                            <div id = "current-answers">
                                <h3><u>Change WR Names</u></h3>
                                <textarea spellCheck="false" value={frNames} readOnly disabled id="question-display"/>
                                <textarea spellCheck="false" id="question-adder"/>
                                <button onClick={addFRQNames} id="submit-fr">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}