import { Link ,useNavigate} from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import {signInStart, signInSuccess, signInFailure} from "../redux/user/userSlice"


export default function Signin() {
  const [formData, setFormData] = useState({})
  const {loading, error: errorMessage} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !formData.email || !formData.password) {
      return dispatch(signInFailure("Silakan isi semua kolom"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false) {
        return dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  return (
    <div className="min-h-screen mt-20 ">
      <div className=" flex p-3 max-w-3xl flex-col md:flex-row mx-auto md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
        <Link to={'/'} className={'font-bold dark:text-white text-4xl'}>
            <span className='px-2 py-1 bg-gradient-to-r from-sky-500 via-slate-500 to-fuchsia-500 rounded-lg text-white'>ML4BQ1_</span>
            Blog
        </Link>
        <p className="text-sm mt-5">
          ini demo project. kamu bisa Signin dengan email dan password kamu atau dengan google
        </p>
        </div>
        {/* right */}
        <div className="flex-1">
        {
            errorMessage && (
              <Alert className="mb-3" color={"failure"}>
                {errorMessage}
              </Alert>
            )
          }
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput 
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput 
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone={"purpleToBlue"} type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size={"sm"} />
                  <span className="ml-2">Loding...</span>
                  </>
                ): (
                  "Sign In"
                )
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Tidak punya akun?</span>
            <Link to={'/signup'} className="text-blue-500">
            Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
