import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate()

    return (
        <div className='min-h-screen flex flex-col'>
            {/* Navbar for recruiter panel */}
            <div className='shadow py-4 bg-white'>
                <div className='px-5 flex justify-between items-center'>
                    <img 
                        onClick={() => navigate('/')} 
                        className='max-sm:w-32 cursor-pointer' 
                        src={assets.logo} 
                        alt="Company Logo" 
                    />
                    <div className='flex items-center gap-3'>
                        <p className='max-sm:hidden'>Welcome, Recruiter</p>
                        {/* Profile Dropdown */}
                        <div className='relative group'>
                            <img 
                                className='w-8 rounded-full border border-gray-300 cursor-pointer' 
                                src={assets.company_icon} 
                                alt="Profile" 
                            />
                            <div className='absolute hidden group-hover:block top-full mt-2 right-0 bg-white shadow-md text-black rounded p-2 w-32'>
                                <ul className='list-none m-0 p-2 bg-white rounded border-0 text-sm'>
                                    <li className='py-1 px-2 pr-10 cursor-pointer hover:bg-gray-100'>Logout</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-start'>
                {/* Left Sidebar with navigation */}
                <div className='inline-block min-h-screen border-r-2 border-gray-300'>
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        <NavLink 
                            className={({ isActive }) => 
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
                                ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`
                            } 
                            to='/dashboard/add-job'
                        >
                            <img className='min-w-4' src={assets.add_icon} alt="Add Job" />
                            <p className='max-sm:hidden'>Add Job</p>
                        </NavLink>
                        <NavLink 
                            className={({ isActive }) => 
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
                                ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`
                            } 
                            to='/dashboard/manage-jobs'
                        >
                            <img className='min-w-4' src={assets.home_icon} alt="Manage Jobs" />
                            <p className='max-sm:hidden'>Manage Jobs</p>
                        </NavLink>
                        <NavLink 
                            className={({ isActive }) => 
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 
                                ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`
                            } 
                            to='/dashboard/view-applications'
                        >
                            <img className='min-w-4' src={assets.person_tick_icon} alt="View Applications" />
                            <p className='max-sm:hidden'>View Applications</p>
                        </NavLink>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className='flex-1 p-6'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
