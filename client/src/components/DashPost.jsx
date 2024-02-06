import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Button, Modal, Table} from 'flowbite-react'
import {Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi"
export default function DashPost() {
  const {currentUser} = useSelector((state) => state.user)
  const [userPosts,setUserPosts] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [modal,setModal] = useState(false)
  const [postIdToDelete,setPostIdToDelete] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.post)
          if(data.post.length < 10){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    if(currentUser.isAdmin){
      fetchPosts()
    }
  },[currentUser._id])

  const handleLebihBanyak = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(`/api/posts/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.post])
        if(data.post.length < 9){
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleDeletePost = async () => {
    setModal(false)
    try {
      const res = await fetch(`/api/posts/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message)
      }else{
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 srollbar-thumb-slate-300 dark:srollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Tanggal Posting</Table.HeadCell>
              <Table.HeadCell>Postingan Gambar</Table.HeadCell>
              <Table.HeadCell>Postingan Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            {userPosts.map((post , index) => (
              <Table.Body key={index} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800"> 
                <Table.Cell> {new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={ `/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-300" />
                  </Link>
                </Table.Cell>
                <Table.Cell><Link className="font-medium text-gray-900 dark:text-white" to={ `/post/${post.slug}`}>{post.title}</Link></Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-400 cursor-pointer hover:underline" onClick={() => { setModal(true) ;setPostIdToDelete(post._id)}}>Delete</span>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/update-post/${post._id}`} className="text-teal-400 hover:underline">
                  <span>Edit</span>
                  </Link>
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
                <Button color="failure" onClick={handleDeletePost}>Ya, Saya Yakin</Button>
                <Button color="gray" onClick={() => setModal(false)}>Tidak, Batalkan</Button>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
