import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Button, Modal, Table} from 'flowbite-react'
import {Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi"
import {FaCheck, FaTimes} from "react-icons/fa"
export default function DashUsers() {
    const {currentUser} = useSelector((state) => state.user)
    const [users,setUsers] = useState([])
    const [showMore,setShowMore] = useState(true)
    const [modal,setModal] = useState(false)
    const [usersIdToDelete,setUsersIdToDelete] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/users/getusers`)
            const data = await res.json()
            if(res.ok){
            setUsers(data.users)
            if(data.users.length < 10){
                setShowMore(false)
            }
            }
        } catch (error) {
            console.log(error)
        }
        }
        if(currentUser.isAdmin){
        fetchUsers()
        }
    },[currentUser._id])

    const handleLebihBanyak = async () => {
        const startIndex = users.length
        try {
        const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`)
        const data = await res.json()
        if(res.ok){
            setUsers((prev) => [...prev, ...data.users])
            if(data.users.length < 10){
            setShowMore(false)
            }
        }
        } catch (error) {
        console.log(error)
        }
    }

    const handleDeleteUsers = async () => {
        
    }
    
    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 srollbar-thumb-slate-300 dark:srollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
        {currentUser.isAdmin && users.length > 0 ? (
            <>
            <Table hoverable className="shadow-md">
                <Table.Head>
                <Table.HeadCell>Tanggal Dibuat</Table.HeadCell>
                <Table.HeadCell>User Gambar</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                {users.map((user ) => (
                <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800"> 
                    <Table.Cell> {new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                    
                        <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full" />
                    
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-400"/>) : (<FaTimes className="text-red-400" />)}</Table.Cell>
                    
                    <Table.Cell>
                    <span className="font-medium text-red-400 cursor-pointer hover:underline" onClick={() => { setModal(true) ;setUsersIdToDelete(user._id)}}>Delete</span>
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
            <p>Tidak ada postingan</p>
        )
        }
        <Modal show={modal} onClose={() => setModal(false)} popup size={"md"}>
            <Modal.Header />
            <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">apakah anda yakin ingin menghapus postingan ini ?</h3>
                <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteUsers}>Ya, Saya Yakin</Button>
                    <Button color="gray" onClick={() => setModal(false)}>Tidak, Batalkan</Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
        </div>
    )
}
