import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {Alert, Button, Textarea} from "flowbite-react"
import { useState } from "react"

export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state) => state.user)
    const [comments, setComments] = useState('')
    const [commentError, setCommentError] = useState(null)

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try {
            if (comments.length > 300) {
                return
            }
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comments,
                    postId,
                    userId: currentUser._id
                })
            })
            const data = await res.json()
            if (res.ok) {
                setComments('')
                setCommentError(null)
            }
        } catch (error) {
            setCommentError(error.message)
        }
       
    }
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
        {currentUser ?
            (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Masuk sebagai:</p>
                    <img className="w-5 h-5 object-cover rounded-full "src={currentUser.profilePicture} alt={currentUser.username}  />
                    <Link to="/dashboard?tab=profile" className="text-xs text-teal-400 hover:underline">
                    @{currentUser.username}
                    </Link>
                </div>
            )
            :
            (
                <div className="text-sm text-teal-400 my-5 flex gap-1">
                    Anda harus masuk untuk berkomentar.
                    <Link to="/signin" className="text-blue-500 hover:underline">
                    Sign In
                    </Link>
                </div>
            )
        }
        {
            currentUser && (
                <form className="border border-teal-400 rounded-md p-3" onSubmit={handleSubmit}>
                    <Textarea placeholder="Tulis komentar" rows="3" maxLength="300" onChange={(e) => setComments(e.target.value)} value={comments}/>
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-400 text-xs">sisa {300 - comments.length} karakter </p>
                        <Button outline gradientDuoTone={"purpleToBlue"} type="submit">Submit</Button>
                    </div>
                    {commentError &&
                    <Alert color="failure" className="mt-5">{commentError}</Alert>
                    }
                </form>
            )
        }
    </div>
  )
}
