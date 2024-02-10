import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
export default function Home() {
  const [post,setPost] = useState([])
  console.log(post)
  useEffect(()=>{
    const fetchPost = async ()=>{
      const res = await fetch('api/posts/getposts')
      const data = await res.json()
      setPost(data.post)
    }
    fetchPost()
  },[])
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Selamat Datang di blog saya</h1>
        <p className='text-gray-500 dark:text-gray-300 text-xs sm:text-sm'>Di sini kamu akan menemukan berbagai artikel dan tutorial tentang topik seperti
          pengembangan web, artificial intelligence, machine learning dan bahasa pemrograman.
        </p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-400 font-bold hover:underline'>
          Lihat semua postingan
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          post && post.length > 0 &&(
            <div className='flex flex-col gap-8 py-7'>
            <h2 className='text-2xl font-semibold text-center'>Postingan Terbaru</h2>
            <div className='lg:grid lg:grid-cols-3 sm:grid sm:grid-cols-2 gap-5 flex flex-wrap justify-center items-center'>
              {post.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              Lihat semua postingan
            </Link>
          </div>
          )
        }
      </div>
    </div>
  )
}
