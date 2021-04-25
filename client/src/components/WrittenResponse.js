import React, {useState,useEffect} from "react";
import Editor from "react-simple-code-editor";
import NavBar from "./NavBar"
import {useCookies} from "react-cookie"
import {useHistory} from "react-router-dom"
import axios from "axios"
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

export default function WrittenResponse() {
  const [code, setCode] = React.useState(
    `//Paste your code here.`
  )
  const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin'])
  const [timer, setTimer] = useState(new Date(cookies.data[0].timeStarted))
  const [timeLeft,settimeLeft] = useState("")
  const history = useHistory()
  const q = {
    "username" : cookies.data[0].username, 
    "password" : cookies.data[0].password
}
  useEffect(() => {
    axios.post("/users/authenticate", q)
    .then(res => {
        const [status,info] = res.data
        if(status === "Authorized")
        {
            setCookie('data',info)
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
            .then(res => {setCookie('admin',res.data,{path: '/'})})
            .catch(err => console.log(err))
},[timer])
  function Written()
  {
      if((!cookies.data[0].hasTakenWritten && cookies.admin[0].WrittentestEnabled))
      {
          return ( 
            <>
                <NavBar current = "Written" />
                <div className = "container-fluid">
                    <div className = "row">
                        <div className = "col-lg-6 col-md-6 col-sm-12">
                            <div id="frqsub-area">
                                <h2>Select Question</h2>
                                <Editor
                                    value={code}
                                    onValueChange={(code) => {
                                        console.log(code)
                                        setCode(code)}}
                                    highlight={(code) => highlight(code, languages.js)}
                                    padding={10}
                                    style={{
                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                        fontSize: 12,
                                        height: 400,
                                    }}
                                />
                            </div>
                            
                        </div>
                        <div className = "col-lg-6 col-md-6 col-sm-12">
                            <h4>Hey Team {cookies.data[0].team}! It's time to code. 😉💻</h4>
                        </div>
                    </div>
                </div>
            </>
          )
      }
      else if(!cookies.data[0].hasTakenWritten)
      {
          return (
              <div id="content-mc-after">
                  <NavBar current = "Written" />
                  <h2 id="mcafter-message">Written Response has not been enabled yet.</h2>
              </div>
          )
      }
      else
      {
          return (
              <div id="content-mc-after">
                  <NavBar current = "Written" />
                  <h2 id="mcafter-message">You have completed the Written Response.</h2>
              </div>
          )
      }
  }
  return (
    Written()
  )
}

