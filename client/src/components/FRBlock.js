import React, {useState,useEffect}from "react"
import { highlight, languages } from "prismjs/components/prism-core";
import Editor from "react-simple-code-editor";
import axios from "axios"
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
export default function FRBlock(props)
{
    var [code,setCode] = useState(props.code)

    function press(event)
    {
        const q =  {
            "problem": props.problem, 
            "status":event.target.value,
            "team":props.team
        }
        props.check(props.i)
        axios.post("/team/changeStatus",q)
        .then(() => props.delete(props.i))
        .catch(err => console.log(err))
    }

    return( 
        <div className = "container-fluid">
            <div className = "row">
                <div className = "col-lg-12 col-md-12 col-sm-12">
                    <div id="response-container">
                        <br/>
                        <h2>Problem: {props.name}</h2><h2>Team: {props.team} </h2>
                        <Editor
                            value={code}
                            onValueChange={(code) => {
                                setCode(code)}}
                            highlight={(code) => highlight(code, languages.js)}
                            padding={10}
                            id="new-code-editor"
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 13
                            }}
                        />
                        <br/>
                        <button type="button" onClick = {press} id="response-button" value="Correct" className="btn btn-success">Correct</button>
                        <button type="button" onClick = {press} id="response-button" value="Incorrect" className="btn btn-danger">Incorrect</button>
                        <button type="button" onClick = {press} id="response-button" value="Runtime Error" className="btn btn-warning">Runtime Error</button>
                        <button type="button" onClick = {press} id="response-button" value="Compile Time Error" className="btn btn-warning">Compile Time Error</button>
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
        
    )
}