import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import {useSelector} from "react-redux"

export default function Comment({comment , onLike}) {
    const [user , setUser] = useState({})
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
            <p className="text-gray-500 pb-3 dark:text-gray-300">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs  border-t dark:border-gray-600 max-w-fit gap-2 "> 
                <button className={`text-gray-500 hover:text-sky-500 ${ currentUser && comment.likes.includes(currentUser._id) && 'text-sky-500'}`} type="button" onClick={() => onLike(comment._id)}>
                    <FaThumbsUp className="text-sm" />
                </button>
                <p className="text-gray-500 dark:text-gray-300"> 
                    {comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes > 1 ? 'likes' : 'like')} 
                </p>
            </div>
        </div>
    </div>
  )
}
