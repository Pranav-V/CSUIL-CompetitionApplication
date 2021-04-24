import React, {useState,useEffect} from "react"
import axios from "axios"
import dragon from "../images/rrhsdragon.jpg"
export default function Info()
{
    const [recentImage,setRecentImage] = useState({})
    const [caption, setCaption] = useState("")
    const [uploadedImageUrl,setuploadedImageUrl] = useState("")
    const [uploadedImage,setuploadedImage] = useState({})

    function uploadImage() 
    {
        if (!caption.trim() || !uploadedImage.name) {
            return alert('Caption or file is missing');
        }

        let formData = new FormData();
        formData.append('caption', caption);
        formData.append('file',uploadedImage);

        axios.post('/image/', formData)
            .then((response) => {
                response.data.success ? alert('File successfully uploaded') : alert('File already exists');
            })
            .catch(err => alert('Error: ' + err));
    }

    return(
        <div id = "login-background" className = "col-lg-6 col-md-4 col-sm-4">
            <h3 id="head">Important Information</h3>
            <div id="info">
                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            </div>
            <img id = "dragon-img" alt="Dragon" src = {dragon}/>
            <input
                type="text"
                placeholder="Enter caption..."
                onChange={event => setCaption(event.target.value )}
                value={caption}
            />
            <input
                type="file"
                className="Upload__Input"
                onChange={(event) => {
                    setuploadedImageUrl(URL.createObjectURL(event.target.files[0]))
                    setuploadedImage(event.target.files[0])   
                }}
            />
            <button onClick={uploadImage} className="Upload__Button">Upload</button>
        </div>
    )
}