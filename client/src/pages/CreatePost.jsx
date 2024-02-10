import {Alert, Button, FileInput, Select, TextInput} from "flowbite-react"
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate} from "react-router-dom"

export default function CreatePost() {
    const [file,setFile] = useState(null)
    const [imageUploudProgress,setImageUploudProgress] = useState(null)
    const [imageUploudError,setImageUploudError] = useState(null)
    const [formData,setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)

    const navigate = useNavigate()

    const handleUploud = async () =>{
        try {
            if(!file){
                setImageUploudError('File harus di pilih')
                return
            }
            setImageUploudError(null)
            const storage = getStorage(app);
            const fileName = new Date().getTime() +'-'+ file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageUploudProgress(progress.toFixed(0))
                },
                (error) => {
                    setImageUploudError('Tidak dapat mengunggah gambar')
                    setImageUploudProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploudProgress(null)
                        setImageUploudError(null)
                        setFormData({...formData,image:downloadURL})
                    })
                }
            )
        } catch (error) {
            setImageUploudError('Tidak dapat mengunggah gambar')
            setImageUploudProgress(null)
            console.log(error)
        }
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        try {
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(!res.ok){
                setPublishError(data.message)
                return
            }
            if(res.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Tidak dapat menambahkan postingan')
        }
    }
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3">
        <h1 className="my-7 text-center font-semibold text-3xl">Membuat Postingan</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" id="title" placeholder="Title" className="flex-1" onChange={(e)=>setFormData({...formData,title:e.target.value})}/>
                <Select onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                    <option value="uncategorized">Pilih Kategori</option>
                    <option value="javascripts">Javascripts</option>
                    <option value="python">Python</option>
                    <option value="reactjs">React.Js</option>
                    <option value="nextjs">Next.Js</option>
                    <option value="expressjs">Express.js</option>
                    <option value="mongodb">Mongo.db</option>
                    <option value="machine_learning">Machine Learning</option>
                </Select>
            </div>

            <div className="flex gap-4 items-center justify-between border-4 border-teal-300 border-dotted p-3">
                <FileInput type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])}/>
                <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline onClick={handleUploud} disabled={imageUploudProgress}>
                    {imageUploudProgress? (
                        <div className="w-16 h-16">
                            <CircularProgressbar value={imageUploudProgress} text={`${imageUploudProgress || 0}%`} />
                        </div>
                    ):(
                        'Unggah Gambar'
                    )
                    }
                </Button>
            </div>
            {
                imageUploudError && <Alert color={"failure"}>{imageUploudError}</Alert>
            }
            { formData.image && (<img src={formData.image} alt="uploud" className="w-full h-80 object-cover"/>)}
            <ReactQuill theme="snow" placeholder="Tulis sesuatu" className="h-72 mb-12" required  onChange={(value) => setFormData({...formData,content:value})}/>

            <Button type="submit" gradientDuoTone="purpleToBlue" className="mt-5">
                Publish
            </Button>
            {
                publishError && <Alert color={"failure"} className="mt-5">{publishError}</Alert>
            }
        </form>
    </div>
  )
}
