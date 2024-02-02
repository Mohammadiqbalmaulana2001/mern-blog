import {useSelector} from "react-redux";
import {Alert, Button, TextInput} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
  const {currentUser} = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileProgress, setImageFileProgress] = useState(null)
  const [imageFileError, setImageFileError] = useState(null)
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
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL)
      })
    }
    )
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <TextInput 
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput
        type="password"
        id="password"
        placeholder="password"
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>Update</Button>
      </form>
      <div className="text-red-400 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
