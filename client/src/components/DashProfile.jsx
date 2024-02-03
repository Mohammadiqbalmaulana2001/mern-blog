import {useSelector} from "react-redux";
import {Alert, Button, TextInput} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart, updateSuccess, updateFailure} from "../redux/user/userSlice"
import {useDispatch} from 'react-redux'

export default function DashProfile() {
  const {currentUser} = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileProgress, setImageFileProgress] = useState(null)
  const [imageFileError, setImageFileError] = useState(null)
  const [imageFileUploding , setImageFileUploding] = useState(false)
  const [updateUserSucces ,setUpdateUserSucces] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const fileRef = useRef()
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  useEffect(() => {
    if(imageFile) {
      uploudImage()
    }
  },[imageFile])

  const uploudImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploding(true)
    setImageFileError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setImageFileProgress(progress.toFixed(0))
    },
    (error) => {
      setImageFileError('Tidak dapat mengunggah gambar (file harus kurang dari 2 MB)')
      setImageFileProgress(null)
      setImageFile(null)
      setImageFileUrl(null)
      setImageFileUploding(false)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL)
        setFormData({...formData, profilePicture: downloadURL})
        setImageFileUploding(false)
      })
    }
    )
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserError(null)
    setUpdateUserSucces(null)
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('tidak ada Perubahan ')
      return;
    }
    if(imageFileUploding){
      setUpdateUserError('harap tunggu hingga gambar diunggah')
      return;
    }
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }else{
        dispatch(updateSuccess(data))
        setUpdateUserSucces("Profil berhasil diperbarui")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden border-4 border-[lightgray] rounded-full" onClick={() => fileRef.current.click()}>
          {imageFileProgress && (
            <CircularProgressbar value={imageFileProgress || 0} text={`${imageFileProgress || 0}%`} strokeWidth={5} styles={{root: {width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}}/>
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
                className={`rouded-full w-full h-full object-cover ${imageFileProgress && imageFileProgress < 100 && 'opacity-60'}`}/>
        </div>
        {imageFileError && <Alert color={"failure"}>{imageFileError}</Alert>}
        <TextInput 
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput 
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
        type="password"
        id="password"
        placeholder="password"
        onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>Update</Button>
      </form>
      <div className="text-red-400 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSucces && (
        <Alert color="success" className="mt-5" >
          {updateUserSucces}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className="mt-5">
          {updateUserError}
        </Alert>
      )}
    </div>
  )
}
