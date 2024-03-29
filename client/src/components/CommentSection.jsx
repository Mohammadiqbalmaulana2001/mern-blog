import {useSelector} from "react-redux"
import {Link , useNavigate} from "react-router-dom"
import {Alert, Button, Modal, Textarea} from "flowbite-react"
import { useEffect, useState } from "react"
import Comment from "./Comment"
import { HiOutlineExclamationCircle } from "react-icons/hi"

export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state) => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments , setComments] = useState([])
    const [modal, setModal] = useState(false)
    const [commentDelete, setCommentDelete] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try {
            if (comment.length > 300) {
                return
            }
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            })
            const data = await res.json()
            if (res.ok) {
                setComment('')
                setCommentError(null)
                setComments([data ,...comments])
            }
        } catch (error) {
            setCommentError(error.message)
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                if(res.ok){
                    const data = await res.json()
                    setComments(data)
                }

            } catch (error) {
                console.log(error)
            }
        }
        getComments()
    },[postId])

    const handleLike = async (commentId) =>{
        try {
            if(!currentUser){
                navigate('/signin')
                return
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            })
            if(res.ok){
                const data = await res.json()
                setComments(comments.map((comment) => 
                    comment._id === commentId ? {
                        ...comment,
                        likes : data.likes,
                        numberOfLikes : data.likes.length
                    }: comment
                    )
                )   
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = async (commentId , setEditContent) =>{
        setComments(
            comments.map((c) =>
            c._id === commentId ? {
                ...c ,
                content: setEditContent
            }: c
        ))
        
    }

    const handleDelete = async (commentId) =>{
        setModal(false)
        try {
            if(!currentUser){
                navigate('/signin')
                return
            }
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
            })
            if(res.ok){
                const data = await res.json()
                setComments(comments.filter((comment) => comment._id !== commentId))
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
        {currentUser ?
            (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p className="dark:text-gray-200">Masuk sebagai:</p>
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
                    <Textarea placeholder="Tulis komentar" rows="3" maxLength="300" onChange={(e) => setComment(e.target.value)} value={comment}/>
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-400 text-xs">sisa {300 - comment.length} karakter </p>
                        <Button outline gradientDuoTone={"purpleToBlue"} type="submit">Submit</Button>
                    </div>
                    {commentError &&
                    <Alert color="failure" className="mt-5">{commentError}</Alert>
                    }
                </form>
            )
        }
        {
            comments.length === 0 ? (
                <p className="my-5 text-sm">tidak ada komentar</p>
            ):
            (
                <>
                    <div className="flex items-center gap-1 my-5 text-sm">
                        <p>Komentar</p>
                        <div className="border border-gray-400 rounded-md py-1 px-2">
                            <p>{comments.length}</p>
                        </div>
                    </div>

                    {
                        comments.map((comment) => (
                            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {setModal(true) , setCommentDelete(commentId)}}/>
                        ))
                    }
                </>
            )
        }

        <Modal show={modal} onClose={() => setModal(false)} popup size={"md"}>
                <Modal.Header />
                <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">apakah anda yakin ingin menghapus komentar ini ?</h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() =>handleDelete(commentDelete)}>Ya, Saya Yakin</Button>
                        <Button color="gray" onClick={() => setModal(false)}>Tidak, Batalkan</Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
    </div>
  )
}
