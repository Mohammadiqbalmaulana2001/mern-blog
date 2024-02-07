import { Button } from "flowbite-react"
export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-400 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-2xl">Ingin Belajar lebih banyak tentang Javascripts ?</h2>
            <p className="text-gray-400 my-2">Periksa sumber daya ini dengan 100 proyek Javascript</p>
            <Button gradientDuoTone="purpleToBlue" className="rounded-tl-xl rounded-bl-none" >
                <a href="https://www.100jsprojects.com" target="_blank" rel="noreferrer">Belajarlah lagi</a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_3840,q_auto" alt="javascript" />
        </div>
    </div>
  )
}
