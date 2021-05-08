import React, {useEffect, useState} from "react"
import {useCookies} from "react-cookie"
import axios from "axios"
import {useHistory} from "react-router-dom"
import NavBar from "./NavBar"
export default function ClientHome()
{
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin','frqproblems','teamscoremc','teamscorewr','frqstatus'])
    const [teamnames, setteamnames] = useState([])
    const [teamscore, setteamscore] = useState(cookies.teamscoremc!=null?cookies.teamscoremc:-500)
    var teamcount = 0
    const history = useHistory()
    if(cookies.authorized==null || cookies.data==null)
    {
        history.push("/")
    }
    if(!cookies.authorized)
    {   
        history.push('/')

    }
    const q = {
        "username" : cookies.data!=null?cookies.data[0].username:"", 
        "password" : cookies.data!=null?cookies.data[0].password:""
    }
    
    useEffect(() => {
        if(cookies.data==null)
        {
            return
        }
        axios.post("/users/findTeam", {"team": cookies.data[0].team})
            .then(res => {
                let arr = res.data
                const teammates  = []
                for(let i=0; i<arr.length; i++)
                {
                    if(arr[i]._id === cookies.data[0]._id)
                    {
                        teammates.unshift(arr[i].name)
                        continue
                    }
                    teammates.push(arr[i].name)
                }
                setCookie('team',arr,{path: '/'})
                setteamnames(teammates)
            })
            .catch(err => console.log(err))
            axios.post("/users/authenticate", q)
            .then(res => {
                const [status,info] = res.data
                if(status === "Authorized")
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
            axios.post("/team/getscore",{"team":cookies.data[0].team})
                .then(res => setCookie("teamscorewr",res.data,{path:'/'}))
                .catch(err => console.log(err))
            axios.post("/users/findTeam", {"team": cookies.data[0].team})
                .then(res => {
                    let arr = res.data
                    var tempscore = 0
                    for(let i=0; i<arr.length; i++)
                    {
                        if(arr[i].iScore!=-500)
                        {
                            tempscore += arr[i].iScore
                            teamcount++;
                        }
                    }
                    setteamscore(tempscore)
                    setCookie("teamscoremc",tempscore,{path:'/'})
                })
                .catch(err => console.log(err))

            axios.post("/admin/adminSettings")
                .then(res => setCookie('admin',res.data,{path: '/'}))
                .catch(err => console.log(err))
            axios.post("/answer/getProblemNames",{"frqID":0})
                .then(res => {
                    setCookie('frqproblems',res.data,{path: '/'})
                })
                .catch(err => console.log(err))
            axios.post("/team/getTeamInfo",{"team":cookies.data[0].team})
                .then(res => {
                    setCookie('frqstatus',res.data,{path:'/'})
                })
    }, [])
    const disect = cookies.data!=null?cookies.data[0].iScoreinfo.split(','):[]
    if(cookies.data==null || cookies.authorized==null)
    {
        return <div></div>
    }
    
    return( 
        <div>
            <NavBar current = "Home"/>
            <div id="client-home-body">
                <br/>
                <h4>Hey {cookies.data!=null?cookies.data[0].name:""}! Ready to get coding? 😎</h4>
                <div className = "container-fluid">
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div id = "team-mates">
                                <h3>Team: {teamnames.join(", ")}</h3>
                            </div>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div id = "score-home">
                                {cookies.data==null || cookies.admin==null?null:
                                    <>
                                    <h3>Multiple Choice Score (Individual): {cookies.data[0].iScore === -500?"_____":cookies.data[0].iScore} <b id="extrainfo">{cookies.data[0].iScore !== -500?"   [Correct-"+ disect[0]+", Incorrect-"+disect[1]+", Unattempted-"+disect[2]+"]":null}</b></h3>
                                    <h3>Multiple Choice Score (Team): {cookies.data[0].iScore === -500?"_____":teamscore}</h3>
                                    <h3>Written Response Score (Team): {cookies.admin!=null?(!cookies.admin[0].WrittentestEnabled?"_____":cookies.teamscorewr):"_____"}</h3>
                                    <hr id = "sepline" />
                                    <h3>= Contest Score (Team): {!(cookies.data[0].iScore !== -500 && cookies.admin[0].WrittentestEnabled)?"_____":(parseInt(teamscore)+parseInt(cookies.teamscorewr))}</h3>
                                    </>
                                }
                                
                            </div>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div id = "score-home">
                                <h3>Important Information: </h3>
                                <br/>
                                <h4>About the Test</h4>
                                    <ul>
                                        <li>45 minute - 40 Question Multiple Choice Test</li>
                                        <li>2 hour - 12 Question - 3 Person Team Hands-On Programming</li>
                                        <li><a target="_blank" href="https://drive.google.com/file/d/1N6l3W4-oBWYyhAQIRvC4QtLmBkNZRR7w/view">Topic List</a></li>
                                    </ul>
                                    <h4>Test Documents</h4>
                                    <ul>
                                        <li><a href="https://drive.google.com/drive/folders/1mGifLJiil-4l9dIuscN_44mWk33hWMf2">Multiple Choice Questions</a></li>
                                        <li>Written Response Questions (disabled)</li>
                                        <li>Written Response Data Files (disabled)</li>
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
                    </div>
                </div>
            </div>
        </div>
        
    )
}