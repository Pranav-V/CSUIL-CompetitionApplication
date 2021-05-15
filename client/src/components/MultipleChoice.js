import React, {useEffect, useState} from "react"
import {useCookies} from "react-cookie"
import axios from "axios"
import {useHistory} from "react-router-dom"
import NavBar from "./NavBar"
import {SketchField,Tools} from './ReactSketch'


export default function MultipleChoice()
{
    
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin'])
    const [timer, setTimer] = useState(new Date(cookies.data!=null?cookies.data[0].timeStarted:0))
    const [timeLeft,settimeLeft] = useState("")
    const [sans,setsans] = useState(new Array(40))
    const history = useHistory()
    if(cookies.authorized==null)
    {
        history.push("/")
    }
    var t
    const arr = Array.from({length: 40}, (_, index) => index + 1);
    const q = {
        "username" : cookies.data!=null?cookies.data[0].username:"", 
        "password" : cookies.data!=null?cookies.data[0].password:""
    }
    useEffect(() => {
        t=setInterval(() => {
            if(timer.getTime()!=(new Date(0).getTime()))
            {
                var calc = (45*60000)-((new Date).getTime()-timer.getTime())
                var min = Math.floor(calc/60000)
                var sec = Math.floor((calc%60000)/1000)
                var mins = min<10?("0"+min):(""+min)
                var secs = sec<10?("0"+sec):(""+sec)
                settimeLeft(mins+":"+secs)
            }
        },1000)
        return () => {
            clearInterval(t)}

    },[timer])
    
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
    const inputs = arr.map(num => {
        if(num<41)
        {
            return (
        <div className = "col-lg-12 col-md-12 col-sm-12" key={num}>
            <div id = "question_styling">
                <b>{(num<10?"0"+num:num) + ". "}</b>
                <label className="radio-inline">
                    <input type="radio" onClick = {handleClick} id="mc-answerchoice" name={num} value="A"/>A
                </label>
                <label className="radio-inline">
                    <input type="radio" onClick = {handleClick} id="mc-answerchoice" name={num} value="B"/>B
                </label>
                <label className="radio-inline">
                    <input type="radio" onClick = {handleClick} id="mc-answerchoice" name = {num}value = "C"/>C
                </label>
                <label className="radio-inline">
                    <input type="radio" onClick = {handleClick} id="mc-answerchoice" name = {num} value="D"/>D
                </label>
                <label className="radio-inline">
                    <input type="radio" onClick = {handleClick} id="mc-answerchoice" name = {num} value="E"/>E
                </label>
            </div>
        </div>)}
        else
        {
            return( 
                <div className = "col-lg-12 col-md-12 col-sm-12" key={num}>
                    <div id = "question_styling">
                        <b>{(num<10?"0"+num:num) + ". "}</b>
                        <input type="text" onChange = {(event) => sans[parseInt(event.target.name)-1] = event.target.value} id="mc-answerchoice-fr" name={num}/>
                    </div> 
                </div>
            )
        }
        
    })
    
    function handleClick(event){
        let val = event.target.value
        let name = parseInt(event.target.name)
        if(sans[name-1]==val)
        {
            event.target.checked = false;
            sans[name-1] = null;
            return; 
        }
        sans[name-1] = val
    }
    if(!cookies.authorized)
    {   
        history.push('/')
    }
    function handleMCSubmit()
    {
        document.getElementById("submit-mc").style.display = "none"
        axios.post("/answer/retrieveanswers",{"frqID":0})
            .then(res => {
                let ranswers = res.data[0].answers.split(',')
                let correct = 0
                let incorrect = 0 
                let nanswered = 0
                for(let i=0; i<ranswers.length;i++)
                {
                    (ranswers[i]===sans[i])?correct++:(sans[i]!=null?incorrect++:nanswered++)
                }
                let score = (correct*6) + (incorrect*-2)

                axios.post("/users/addMCScore/"+cookies.data[0]._id, {
                    "iScore":score, 
                    "iScoreinfo": (""+correct+","+incorrect+","+nanswered)
                })
                .then(() => 
                    axios.post("/users/updateMCStatus/"+cookies.data[0]._id)
                    .then(() => {
                        axios.post("/team/updateScore",{"team":cookies.data[0].team,"score":score})
                        .then(res => history.push("/home"))
                        .catch(err => console.log(err))

                        
                    } )
                    .catch(err => console.log(err)))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }
    function active()
    {   if((45*60000)-((new Date).getTime()-timer.getTime())<=0)
        {
           handleMCSubmit(); 
        }
        return(
            <div>
                <NavBar current = "MC" />
                <div className = "container-fluid">
                    <div className = "row">
                        <div className = "col-lg-12 col-md-12 col-sm-12" id="mctimer">
                            <h4>Time Remaining -  {timeLeft} </h4>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-lg-6 col-md-6 col-sm-12" id="selection">
                            <div className = "row">
                                {inputs}
                                <div className = "col-lg-12 col-md-12 col-sm-12">
                                    <button id="submit-mc" onClick={handleMCSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className = "col-lg-6 col-md-6 col-sm-12" id="sketch">
                            <h3>Sketch Pad</h3>
                            <div id="sketchpad">
                             <SketchField 
                                    width='100%' 
                                    height='100%' 
                                    tool={Tools.Pencil}
                                    lineColor='black'
                                    lineWidth={3}/>
                            </div>                   
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    function startTimer()
    {
        axios.post("/users/updateTime/"+cookies.data[0]._id)
            .then(res => {
                setTimer(new Date(res.data))})
            .catch(err => console.log(err))
    }
    function MC()
    {
        if((!cookies.data[0].hasTakenMC && cookies.admin[0].MCtestEnabled))
        {
            var today = new Date(0)
            if(timer.getTime()==today.getTime())
            {
                return ( 
                    <div id="content-mc-after">
                        <NavBar current = "MC" />
                        <h2 id="mcafter-message">Multiple Choice Exam Enabled</h2>
                        <p>You have 45 minutes to complete a 40 question exam.</p>
                        <button id="submit-mc" onClick = {startTimer}>Start Multiple Choice Exam</button>
                    </div>
                )
            }
            return active() 
        }
        else if(!cookies.data[0].hasTakenMC)
        {
            return (
                <div id="content-mc-after">
                    <NavBar current = "MC" />
                    <h2 id="mcafter-message">Multiple Choice Exam has not been enabled yet.</h2>
                </div>
            )
        }
        else
        {
            return (
                <div id="content-mc-after">
                    <NavBar current = "MC" />
                    <h2 id="mcafter-message">You have completed the Multiple Choice Exam.</h2>
                </div>
            )
        }
    }
    if(cookies.data==null || cookies.authorized==null)
    {
        return <div></div>
    }
    return( 
        MC()    
    )
}