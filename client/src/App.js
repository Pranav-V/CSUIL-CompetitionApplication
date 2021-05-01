import React, {useEffect} from "react"
import {Route, Switch} from "react-router-dom"
import clientHome from "./components/clientHome"
import LogIn from "./components/LogIn"
import adminHome from "./components/AdminHome"
import MultipleChoice from "./components/MultipleChoice"
import writtenResponse from "./components/WrittenResponse"
import WRGrading from "./components/WRGrading"
export default function App()
{
    return ( 
        <div> 
            
            <Switch>
                <Route path = "/" component={LogIn} exact/>
                <Route path = "/home" component = {clientHome} />
                <Route path = "/multiplechoice" component = {MultipleChoice} />
                <Route path = "/writtenresponse" component = {writtenResponse} />
                <Route path = "/admin_home" component = {adminHome} />
                <Route path = "/admin_wrgrading" component = {WRGrading} />
            </Switch>
        </div>
    )
}