import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {Table} from 'flowbite-react'
import {Link} from 'react-router-dom'
export default function DashPost() {
  const {currentUser} = useSelector((state) => state.user)
  const [userPosts,setUserPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.post)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if(currentUser.isAdmin){
      fetchPosts()
    }
  },[currentUser._id])
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 srollbar-thumb-slate-300 dark:srollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Update</Table.HeadCell>
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
                  <span className="font-medium text-red-400 cursor-pointer hover:underline">Delete</span>
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
        </>
      ) : (
        <p>Tidak ada postingan</p>
      )
      }
    </div>
  )
}
