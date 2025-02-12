import React, { useContext, useEffect, useState } from 'react'
import { assets, manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'


const Managejobs = () => {

    const navigate = useNavigate()

    const [jobs,setJobs] = useState(false)

    const { backendUrl, companyToken } = useContext(AppContext)

    // function to fetch company job applications data
    const fetchCompanyJobs = async () => {

        try {
            
            const { data } = await axios.get(backendUrl + '/api/company/list-jobs',
                {headers:{token:companyToken}}
            )

            if(data.success){
                setJobs(data.jobsData.reverse())
                console.log(data.jobsData);
                
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // functio to change job visibility 
    const changeJobVisibility = async (id) => {

        try {
            
            const {data} = await axios.post(backendUrl + '/api/company/change-visibility',
                { id },
                { headers:{token: companyToken} }
            )

            if(data.success){
                toast.success(data.message)
                fetchCompanyJobs()
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        
        if(companyToken){
            fetchCompanyJobs()
        }

    },[companyToken])

  return jobs ? jobs.length === 0 ? ( 
  <div className='flex items-center justify-center h-[70vh]'>
    <h1>No Jobs available or Posted</h1>
  </div> 
  ) : (
    <div className='container p-4 max-w-5xl'>
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr>
                        <th className='py-2 border-b text-center max-md:hidden'>#</th>
                        <th className='py-2 px-4 border-b text-left'>Job Title</th>
                        <th className='py-2 border-b text-center max-md:hidden'>Date</th>
                        <th className='py-2 px-4 border-b text-left max-md:hidden'>Location</th>
                        <th className='py-2 border-b text-center'>Applicants</th>
                        <th className='py-2 border-b text-center'>Visible</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job,index)=>(
                        <tr key={index} className='text-gray-700'>
                            <td className='py-2 px-4 text-center border-b max-md:hidden'>{index+1}</td>
                            <td className='py-2 px-4 border-b'>{job.title}</td>
                            <td className='py-2 px-4 text-center border-b max-md:hidden'>{moment(job.date).format('ll')}</td>
                            <td className='py-2 px-4 border-b max-md:hidden'>{job.location}</td>
                            <td className='py-2 px-4 text-center border-b'>{job.applicants}</td>
                            <td className='py-2 px-4 text-center border-b'>
                                <input onChange={() => changeJobVisibility(job._id)} className='scale-125 ml-6' type="checkbox" checked={job.visible} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className='mt-4 flex justify-end'>
            <button onClick={()=> navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new job</button>
        </div>

    </div>
  ) : <Loading />
}

export default Managejobs