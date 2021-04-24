import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import {HashRouter} from "react-router-dom"
import {CookiesProvider} from 'react-cookie'
import "./index.css"
ReactDOM.render(
<CookiesProvider>
    <HashRouter>
        <App />
    </HashRouter>
</CookiesProvider>, document.getElementById("root"))