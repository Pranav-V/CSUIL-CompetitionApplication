import React, {useEffect, useState} from "react"
import {useCookies} from "react-cookie"
import axios from "axios"
import {useHistory} from "react-router-dom"
import NavBar from "./NavBar"
export default function ClientHome()
{
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin'])
    const [teamnames, setteamnames] = useState([])
    const [teamscore, setteamscore] = useState(-500)
    var teamcount = 0
    const history = useHistory()
    const q = {
        "username" : cookies.data[0].username, 
        "password" : cookies.data[0].password
    }
    if(!cookies.authorized)
    {   
        history.push('/')

    }

    useEffect(() => {
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
                })
                .catch(err => console.log(err))

            axios.post("/admin/adminSettings")
                .then(res => setCookie('admin',res.data,{path: '/'}))
                .catch(err => console.log(err))
    }, [])

    const disect = cookies.data[0].iScoreinfo.split(',')
    return( 
        <div>
            <NavBar current = "Home"/>
            <div id="client-home-body">
                <br/>
                <h4>Hey {cookies.data[0].name}! Ready to get coding? 😎</h4>
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
                                <h3>Multiple Choice Score (Individual): {cookies.data[0].iScore === -500?"_____":cookies.data[0].iScore} <b id="extrainfo">{cookies.data[0].iScore !== -500?"   [Correct-"+ disect[0]+", Incorrect-"+disect[1]+", Unattempted-"+disect[2]+"]":null}</b></h3>
                                <h3>Multiple Choice Score (Team): {cookies.data[0].iScore === -500?"_____":teamscore}</h3>
                                <h3>Written Response Score (Team): {cookies.data[0].iScore === -500?"_____":cookies.data[0].iScore}</h3>
                                <hr id = "sepline" />
                                <h3>= Contest Score (Team): {cookies.data[0].iScore === -500?"_____":cookies.data[0].iScore}</h3>
                            </div>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12">
                            <div id = "score-home">
                                <h3>Important Information: </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}