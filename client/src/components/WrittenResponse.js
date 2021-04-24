import React, {useState,useEffect} from "react"
import {useCookies} from "react-cookie"
import axios from "axios"
import {useHistory} from "react-router-dom"
import NavBar from "./NavBar"

export default function WrittenResponse()
{
    const [recentImage,setRecentImage] = useState({})
    const [caption, setCaption] = useState("")
    const [uploadedImageUrl,setuploadedImageUrl] = useState("")
    const [uploadedImage,setuploadedImage] = useState({})
    const [imageList, setImageList] = useState([])

    useEffect(() => {
        console.log("here")
        axios.post('/image/getImages/')
            .then(response => {
                setImageList(response.data.images);
            })
            .catch(err => alert(err));
        console.log('here')
    },[])

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
    return ( 
        <div>
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
            {
                        (imageList!=[])?
                        <div className="ListImageContainer">
                        {imageList.map((file) => (
                            <div className="ListImage">
                                <p className="ListImage__Caption">{file.caption}</p>
                                <p className="ListImage__Date">{file.createdAt}</p>
                                <img
                                    src={'/image/image/' + file.filename}
                                    alt="list-image"
                                    className="ListImage__Image"
                                />

                                <button className="ListImage__Delete" onClick={() => this.deleteFile(file._id)}>Delete</button>
                            </div>
                        ))}
                    </div>:null
            }
                    
        </div>
    )
}