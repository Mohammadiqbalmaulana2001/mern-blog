import { Button } from "flowbite-react"

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-2 sm:p-3 border border-teal-400 justify-center items-center rounded-tl-xl rounded-br-xl text-center">
        <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-xl sm:text-2xl">Ingin Belajar lebih banyak tentang Javascripts ?</h2>
            <p className="text-gray-400 my-1 sm:my-2">Periksa sumber daya ini dengan 100 proyek Javascript</p>
            <Button gradientDuoTone="purpleToBlue" className="rounded-xl sm:rounded-tl-none sm:rounded-bl-xl">
                <a href="https://www.100jsprojects.com" target="_blank" rel="noreferrer">Belajarlah lagi</a>
            </Button>
        </div>
        <div className="p-3 sm:p-5 flex-1">
            <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_3840,q_auto" alt="javascript" className="w-full h-auto" />
        </div>
    </div>
  )
}

