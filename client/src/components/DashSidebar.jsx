import {Sidebar} from 'flowbite-react'
import {HiUser , HiArrowSmRight, HiDocumentText} from 'react-icons/hi'
import { useEffect, useState } from "react"
import {Link, useLocation} from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'
import {useDispatch} from 'react-redux'
import {useSelector} from 'react-redux'
export default function DashSidebar() {
    const location = useLocation()
    const {currentUser} = useSelector((state) => state.user)
    const [tab,setTab] =useState('')
    const dispatch = useDispatch()

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl){
        setTab(tabFromUrl)
        }
    },[location.search])

    const handleSignOut = async () => {
      try {
        const res = await fetch("/api/users/signout", {
          method: "POST",
        })
        const data = await res.json()
        if (!res.ok) {
          console.log(data.message)
        }else{
          dispatch(signOutSuccess(data))
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Sidebar.Item as={Link} to='/dashboard?tab=profile' active={tab === 'profile'} icon={HiUser} label= {currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark'>
                    Profile
                    </Sidebar.Item>
                    {
                      currentUser.isAdmin && (
                        <Sidebar.Item as={Link} to={'/dashboard?tab=posts'} active={tab === 'posts'} icon={HiDocumentText}  >
                      Posts
                    </Sidebar.Item>
                      )
                    }

                    <Sidebar.Item as={Link} to={'/logout'} active icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
                    Sign Out
                    </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
