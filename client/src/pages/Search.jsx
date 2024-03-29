import { Button, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import {useLocation , useNavigate} from 'react-router-dom'
import PostCard from '../components/PostCard'
export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategory',
    })
    const [post , setPost] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const categoryFromUrl = urlParams.get('category')
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
                setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
                });
        }
        
        const fetchPost = async ()=>{
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/posts/getposts?${searchQuery}`)
            if(!res.ok){
                setLoading(false)
                return
            }
            if(res.ok){
                const data = await res.json()
                setPost(data.post)
                setLoading(false)
                if(data.post.length === 12){
                    setShowMore(true)
                }else{
                    setShowMore(false)
                }
            }
        }
        fetchPost()
    }, [location.search])

    const handleChange = (e)=>{
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }
        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc'
            setSidebarData({...sidebarData, sort: order})
        }
        if(e.target.id === 'category'){
            const category = e.target.value || 'uncategory'
            setSidebarData({...sidebarData, category: category})
        }
    }
    
    const handleSubmit = (e)=>{
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('category', sidebarData.category)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = async () => {
        const numberOfPosts = post.length
        const startIndex = numberOfPosts
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/posts/getposts?${searchQuery}`)
        if (!res.ok) {
            return;
        }
        if(res.ok){
            const data = await res.json()
            setPost([...post, ...data.post])
            if(data.post.length === 12){
                setShowMore(true)
            }else{
                setShowMore(false)
            }
        }
      };
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Pencarian</label>
                    <TextInput placeholder='Search..' id='searchTerm' type='text' value={sidebarData.searchTerm} onChange={handleChange}/>
                </div>
                {/* <div className='flex items-center gap-2'>
                    <label className='font-semibold'> Menyortir</label>
                    <Select id='sort' value={sidebarData.sort } onChange={handleChange}>
                        <option value='desc'>Terbaru</option>
                        <option value='asc'>Terlama</option>
                    </Select>
                </div> */}
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Categori</label>
                    <Select id='category' value={sidebarData.category } onChange={handleChange}>
                        <option value="uncategorized">Pilih Kategori</option>
                        <option value="javascripts">Javascripts</option>
                        <option value="python">Python</option>
                        <option value="reactjs">React.Js</option>
                        <option value="nextjs">Next.Js</option>
                        <option value="expressjs">Express.js</option>
                        <option value="mongodb">Mongo.db</option>
                        <option value="machine_learning">Machine Learning</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone={"purpleToBlue"}>Terapkan Filter</Button>
            </form>
        </div>
        <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
            Hasil postingan:
            </h1>
            <div className='p-7 flex flex-wrap gap-4'>
            {!loading && post.length === 0 && (
                <p className='text-xl text-gray-500'>Tidak ada postingan yang ditemukan.</p>
            )}
            {loading && <p className='text-xl text-gray-500'>Loading...</p>}
            <div className='lg:grid lg:grid-cols-3 sm:grid sm:grid-cols-2 gap-5 flex flex-wrap'>
            {!loading &&
            post &&
            post.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
            {showMore && (
                <button
                onClick={handleShowMore}
                className='text-teal-500 text-lg hover:underline p-7 w-full'
                >
                Show More
                </button>
            )}
            </div>
        </div>
    </div>
  )
}
