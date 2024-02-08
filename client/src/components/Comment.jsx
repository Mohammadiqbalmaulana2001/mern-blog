import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import {useSelector} from "react-redux"
import {Button, Textarea} from "flowbite-react"

export default function Comment({comment , onLike , onEdit, onDelete}) {
    const [user , setUser] = useState({})
    const [editing , setEditing] = useState(false)
    const [editContent , setEditContent] = useState(comment.content)
    const {currentUser} = useSelector((state) => state.user)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser()
    }, [comment])

    const handleEdit = () => {
        setEditing(true)
        setEditContent(comment.content)
    }

    const handleSave =  async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}` , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editContent
                })
            })
            if(res.ok){
                setEditing(false)
                onEdit(comment,editContent)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className="flex-shrink-0 mr-3">
            <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover rounded-full" />
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : 'Anonymous Pengguna'}</span>
                <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
            </div>
            {
                editing ? (
                    <>
                        <Textarea className="mb-2" value={editContent} onChange={(e) => setEditContent(e.   target.value)} />

                        <div className="flex justify-end gap-2 text-xs">
                            <Button type="button" size="sm" gradientDuoTone={"purpleToBlue"} onClick={handleSave}>
                                Save
                            </Button>
                            <Button type="button" size="sm" outline gradientDuoTone={"purpleToBlue"} onClick={() => setEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </>
                ): (
                    <>
                    <p className="text-gray-500 pb-3 dark:text-gray-300">{comment.content}</p>
                        <div className="flex items-center pt-2 text-xs  border-t dark:border-gray-600 max-w-fit gap-2 "> 
                            <button className={`text-gray-500 hover:text-sky-500 ${ currentUser && comment.likes.includes(currentUser._id) && 'text-sky-500'}`} type="button" onClick={() => onLike(comment._id)}>
                                <FaThumbsUp className="text-sm" />
                            </button>
                            <p className="text-gray-500 dark:text-gray-300"> 
                                {comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes > 1 ? 'likes' : 'like')} 
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <>
                                        <button className="text-gray-500 hover:text-sky-500" type="button" onClick={handleEdit}>
                                            Edit
                                        </button>
                                        <button className="text-gray-500 hover:text-red-500" type="button" onClick={() => onDelete(comment._id)}>
                                            Delete
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
            
        </div>
    </div>
  )
}
