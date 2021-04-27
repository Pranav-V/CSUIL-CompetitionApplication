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
    `//Paste your Java code here\n`
  )
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin','frqproblems'])
    const [timer, setTimer] = useState(new Date(cookies.data[0].timeStarted))
    const [problemNames, setProblemNames] = useState(cookies.frqproblems!=null?cookies.frqproblems:[])
    const [timeLeft,settimeLeft] = useState("")
    const history = useHistory()
  
    const q = {
    "username" : cookies.data[0].username, 
    "password" : cookies.data[0].password
    }
    var statusInfo = []

    if(cookies.frqproblems!=null)
    {
        statusInfo = problemNames.map((name,index) => {
            return(
            <div key={name} id="frqlist">
                <u>Problem {index+1} - {name}</u>
                <p id="extrainfof">Attempts - 0  | Status - Unattempted | Points - 0</p>
            </div>)
        })
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
    axios.post("/answer/getProblemNames",{"frqID":0})
        .then(res => {
            setCookie('frqproblems',res.data,{path: '/'})
        })
        .catch(err => console.log(err))
},[timer])
  function Written()
  {
      if((!cookies.data[0].hasTakenWritten && cookies.admin[0].WrittentestEnabled))
      {
          return ( 
            
            <>
                <NavBar current = "Written" />
                <br/>
                <h4 style={{textAlign:"center"}}>Hey Team {cookies.data[0].team}! It's time to code. 😉💻</h4>
                <hr id="sepline"/>
                <br/>
                <div className = "container-fluid">
                    <div className = "row">
                        <div className = "col-lg-7 col-md-7 col-sm-12">
                            <div id="frqsub-area">
                                <span>
                                    <label style={{float:"left"}} htmlFor="cars">Select Question: </label> 
                    
                                    <select  id="question-select" name="cars" style={{float:"left"}}>
                                        <option value="volvo">Volvo</option>
                                        <option value="saab">Saab</option>
                                        <option value="fiat">Fiat</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                    <button id="submit-fr" style={{float:"right"}}> Submit</button>
                                </span>
                                <br/>
                                <br/>
                                <Editor
                                    value={code}
                                    onValueChange={(code) => {
                                        console.log(code)
                                        setCode(code)}}
                                    highlight={(code) => highlight(code, languages.js)}
                                    padding={10}
                                    id="code-editor"
                                    style={{
                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                        fontSize: 13
                                    }}
                                />
                                <br/>
                            </div>
                            
                        </div>
                        <div className = "col-lg-5 col-md-5 col-sm-12">
                            <div id="frq-status">
                                    <h4>Question Status</h4>
                                    {statusInfo}
                            </div>
                            <br/>
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

