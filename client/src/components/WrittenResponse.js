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
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin','frqproblems','frqstatus'])
    const [problemNames, setProblemNames] = useState(cookies.frqproblems!=null?cookies.frqproblems:[])
    const [timeLeft,settimeLeft] = useState("")
    const history = useHistory()
    if(cookies.authorized==null)
    {
        history.push("/")
    }
    const q = {
    "username" : cookies.data!=null?cookies.data[0].username:"", 
    "password" : cookies.data!=null?cookies.data[0].password:""
    }
    var statusInfo = []
    if(cookies.frqproblems!=null && cookies.frqstatus!=null)
    {
        statusInfo = problemNames.map((name,index) => {
            return(
            <div key={name} id="frqlist">
                <u>Problem {index+1} - {name}</u>
                <p id="extrainfof">Attempts - {cookies.frqstatus[index][0]}  | Status - {cookies.frqstatus[index][1]} | Points - {cookies.frqstatus[index][2]}</p>
            </div>)
        })
    }
  useEffect(() => {
    if(cookies.data==null || cookies.authorized==null)
    {
        return
    }
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
    axios.post("/team/getTeamInfo",{"team":cookies.data[0].team})
        .then(res => {
            setCookie('frqstatus',res.data,{path:'/'})
        })
        .catch(err => console.log(err))
},[])

    function submitFR()
    {
        if(cookies.frqstatus[document.getElementById("question-select").value][1]=="Correct")
        {
            alert("You have already gotten this question correct.")
            return
        }
        if(cookies.frqstatus[document.getElementById("question-select").value][0]>=12)
        {
            alert("You have exceeded that maximum attempts for this problem.")
            return
        }
        var info = [code,document.getElementById("question-select").value,cookies.data[0].team]
        axios.post("/question/addtoFRQ",{"info":info})
            .then(() => {
                alert("Submitted")
            })
            .catch(err => console.log(err))
        const q =  {
                "problem": document.getElementById("question-select").value, 
                "status": "Grading...",
                "team":cookies.data[0].team
            }
        axios.post("/team/changeStatus",q)
            .then(res => window.location.reload())
            .catch(err => console.log(err))
    }
    
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
                                        <option value="0">{problemNames.length!=0?problemNames[0]:""}</option>
                                        <option value="1">{problemNames.length!=0?problemNames[1]:""}</option>
                                        <option value="2">{problemNames.length!=0?problemNames[2]:""}</option>
                                        <option value="3">{problemNames.length!=0?problemNames[3]:""}</option>
                                        <option value="4">{problemNames.length!=0?problemNames[4]:""}</option>
                                        <option value="5">{problemNames.length!=0?problemNames[5]:""}</option>
                                        <option value="6">{problemNames.length!=0?problemNames[6]:""}</option>
                                        <option value="7">{problemNames.length!=0?problemNames[7]:""}</option>
                                        <option value="8">{problemNames.length!=0?problemNames[8]:""}</option>
                                        <option value="9">{problemNames.length!=0?problemNames[9]:""}</option>
                                        <option value="10">{problemNames.length!=0?problemNames[10]:""}</option>
                                        <option value="11">{problemNames.length!=0?problemNames[11]:""}</option>
                                    </select>
                                    <button onClick={submitFR} id="submit-fr" style={{float:"right"}}> Submit</button>
                                </span>
                                <br/>
                                <br/>
                                <Editor
                                    value={code}
                                    onValueChange={(code) => {
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
  if(cookies.data==null || cookies.authorized==null)
  {
      return <div></div>
  }
  return (
    Written()
  )
}

