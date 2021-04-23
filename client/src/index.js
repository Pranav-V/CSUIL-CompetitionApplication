import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import {BrowserRouter} from "react-router-dom"
import {CookiesProvider} from 'react-cookie'
import "./index.css"
ReactDOM.render(
<CookiesProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</CookiesProvider>, document.getElementById("root"))