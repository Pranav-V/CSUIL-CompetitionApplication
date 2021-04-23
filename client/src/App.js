import React, {useEffect} from "react"
import {Route, Switch} from "react-router-dom"
import clientHome from "./components/clientHome"
import LogIn from "./components/LogIn"
//import MultipleChoice from "./components/MultipleChoice"
export default function App()
{
    return ( 
        <div> 
            
            <Switch>
                <Route path = "/" component={LogIn} exact/>
                <Route path = "/home" component = {clientHome} />
                <Route path = "/multiplechoice" component = {LogIn} />
            </Switch>
        </div>
    )
}