import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";

export default function SignUp() {
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
          ini demo project. kamu bisa SignUp dengan email dan password kamu atau dengan google
        </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Username" />
              <TextInput 
                type="text"
                placeholder="Username"
                id="username"
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput 
                type="text"
                placeholder="name@company.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput 
                type="password"
                placeholder="Password"
                id="password"
              />
            </div>
            <Button gradientDuoTone={"purpleToBlue"} type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Sudah punya akun?</span>
            <Link to={'/signin'} className="text-blue-500">
            Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
