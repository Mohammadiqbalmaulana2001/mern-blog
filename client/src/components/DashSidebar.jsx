import {Sidebar} from 'flowbite-react'
import {HiUser , HiArrowSmRight} from 'react-icons/hi'
import { useEffect, useState } from "react"
import {Link, useLocation} from 'react-router-dom'
import { signOutSuccess } from '../redux/user/userSlice'
import {useDispatch} from 'react-redux'
export default function DashSidebar() {
    const location = useLocation()
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
            <Sidebar.ItemGroup>
                    <Sidebar.Item as={Link} to='/dashboard?tab=profile' active={tab === 'profile'} icon={HiUser} label={'user'}  labelColor='dark'>
                    Profile
                    </Sidebar.Item>

                    <Sidebar.Item as={Link} to={'/logout'} active icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
                    Sign Out
                    </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
