import AdminBar from "./AdminBar"
import React, {useState,useEffect} from "react";
import {useCookies} from "react-cookie"
import {useHistory} from "react-router-dom"
import axios from "axios"
import FRBlock from "./FRBlock"

export default function WRGrading()
{
    const [cookies, setCookie,removeCookie] = useCookies(['authorized','data','team','admin','frqproblems','teamscoremc','currentTeams','currentAnswers','frnames'])
    const [data,setData] = useState([])
    const history = useHistory()
    if(cookies.authorized==null)
    {
        history.push("/")
    }
    const q = {
        "username" : cookies.data!=null?cookies.data[0].username:"", 
        "password" : cookies.data!=null?cookies.data[0].password:""
    }
    function reload(i)
    {
        var check = data[i]
        axios.post("/question/giveFRQ")
            .then(res => {
                setData(res.data)
                console.log(res.data[i])
                console.log(check)
                if(JSON.stringify(res.data[i])!=JSON.stringify(check))
                {
                    alert("Question has already been graded by another admin.")
                    window.location.reload()
                }
            })
            .catch(err => console.log(err))
        
    }
    function del(i)
    {
        console.log(i)
        axios.post("/question/deleteQ",{index:i})
        .then(() => window.location.reload())
        .catch(err => console.log(err))
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
        axios.post("/admin/adminSettings")
            .then(res => setCookie('admin',res.data,{path: '/'}))
            .catch(err => console.log(err))
        axios.post("/question/giveFRQ")
            .then(res => setData(res.data))
            .catch(err => console.log(err))
        axios.post("/answer/getProblemNames",{"frqID":0})
            .then(res => {
                setCookie('frqproblems',res.data,{path: '/'})
            })
            .catch(err => console.log(err))
        
        return () => {
            setData([])
        }
        
    }, [])
    var info = []
    if(data.length!=0 && cookies.frqproblems!=null)
    {
        info = data.map((an,index) => {
            return(
            <FRBlock check = {reload} delete = {del} i={index} code={an[0]} team={an[2]} key = {Math.random()} name = {cookies.frqproblems[parseInt(an[1])]} problem={parseInt(an[1])} />)
        })
    }

    return ( 
        <div>
            <AdminBar current="WRGrade" />
            {info.length!=0?info:<h2 style={{textAlign:"center",marginTop:"20px"}}>🐦🐦Chirp..Chirp...Nothing Submitted Yet.</h2>}
        </div>
    )
}