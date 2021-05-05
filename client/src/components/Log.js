import React, {useState} from "react"
import axios from "axios"
import {useCookies} from 'react-cookie'
import {useHistory} from "react-router-dom"

export default function Log()
{
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies(['authorized','data','id'])
    const history = useHistory()
    function checkUser() 
    {
        console.log()
        const info = {
            "username" : username, 
            "password" : password
        }
        axios.post("/users/authenticate", info)
            .then(res => {
                const [status,info] = res.data
                if(status === "Authorized")
                {
                    removeCookie('authorized')
                    removeCookie('data')
                    removeCookie('team')
                    setCookie("authorized",true,{path:'/'})
                    setCookie("data",info,{path:'/'})
                    if(info[0].isAdmin)
                    {
                        history.push('/admin_home')
                    }
                    else
                    {
                        history.push('/home')

                    }
                }
                else
                {
                    document.getElementById("login-fail").style.color = "red"
                }
            })
            .catch(err => console.log(err))
    }
    return ( 
        <div id = "co" className = "col-lg-6 col-md-8 col-sm-8">
            <h2 id = "head">Round Rock HS UIL Meet</h2>
            <div id="login-box">
                <p>Username: </p>
                <input id = "l1" type = "text" value = {username} onChange = {(event) => setusername(event.target.value)}/>
                <br/>
                <p>Password: </p>
                <input id = "l2" type = "text" value = {password} onChange = {(event) => setpassword(event.target.value)}/>
                <br/>
                <p id="login-fail"> △ Unable to log in with provided credentials.</p>
                <button id ="signin" onClick = {checkUser}>Sign-in</button>
            </div>
        </div>
    )

}