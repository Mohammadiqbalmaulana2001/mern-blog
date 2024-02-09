import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Button, Modal, Table} from 'flowbite-react'
import { HiOutlineExclamationCircle } from "react-icons/hi"
import {FaCheck, FaTimes} from "react-icons/fa"
export default function DashComments() {
    const {currentUser} = useSelector((state) => state.user)
    const [comments,setComments] = useState([])
    const [showMore,setShowMore] = useState(true)
    const [modal,setModal] = useState(false)
    const [commentIdToDelete,setCommentIdToDelete] = useState('')
    console.log()
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.users && data.users.length < 10) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
    
        if (currentUser && currentUser.isAdmin) {
            fetchComments();
        }
    }, [currentUser]);
    

    const handleLebihBanyak = async () => {
        const startIndex = comments.length
        try {
        const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
        const data = await res.json()
        if(res.ok){
            setComments((prev) => [...prev, ...data.comments])
            if(data.comments.length < 10){
            setShowMore(false)
            }
        }
        } catch (error) {
        console.log(error)
        }
    }

    const handleDeleteComment = async () => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((user) => user._id !== commentIdToDelete));
                setModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 srollbar-thumb-slate-300 dark:srollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
        {currentUser.isAdmin && comments.length > 0 ? (
            <>
            <Table hoverable className="shadow-md">
                <Table.Head>
                <Table.HeadCell>Tanggal Diperbarui</Table.HeadCell>
                <Table.HeadCell>Konten Komentar</Table.HeadCell>
                <Table.HeadCell>jumlah suka</Table.HeadCell>
                <Table.HeadCell>Postingan Id</Table.HeadCell>
                <Table.HeadCell>User Id</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                {comments.map((comment ) => (
                <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800"> 
                    <Table.Cell> {new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                    <p className="truncate">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    
                    <Table.Cell>
                    <span className="font-medium text-red-400 cursor-pointer hover:underline" onClick={() => { setModal(true) ;setCommentIdToDelete(comment._id)}}>Delete</span>
                    </Table.Cell>
                </Table.Row>
                </Table.Body>
                ))}
            </Table>
            {showMore && (
                <button className="w-full text-teal-400 self-center text-sm py-7 " onClick={handleLebihBanyak}>
                Lebih banyak
                </button>
            )}
            </>
        ) : (
            <p>Tidak ada comment</p>
        )
        }
        <Modal show={modal} onClose={() => setModal(false)} popup size={"md"}>
            <Modal.Header />
            <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">apakah anda yakin ingin menghapus Akun ini ?</h3>
                <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteComment}>Ya, Saya Yakin</Button>
                    <Button color="gray" onClick={() => setModal(false)}>Tidak, Batalkan</Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
        </div>
    )
}
