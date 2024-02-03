import {Button, FileInput, Select, TextInput} from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export default function CreatePost() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3">
        <h1 className="my-7 text-center font-semibold text-3xl">Membuat Postingan</h1>
        <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput type="text" id="title" placeholder="Title" className="flex-1"/>
                <Select>
                    <option value="uncategorized">Pilih Kategori</option>
                    <option value="javascripts">Javascripts</option>
                    <option value="reactjs">React.Js</option>
                    <option value="nextjs">Next.Js</option>
                </Select>
            </div>

            <div className="flex gap-4 items-center justify-between border-4 border-teal-300 border-dotted p-3">
                <FileInput type="file" accept="image/*" />
                <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline>
                    Unggah Gambar
                </Button>
            </div>

            <ReactQuill theme="snow" placeholder="Tulis sesuatu" className="h-72 mb-12" required />

            <Button type="submit" gradientDuoTone="purpleToBlue" className="mt-5">
                Publish
            </Button>
        </form>
    </div>
  )
}
