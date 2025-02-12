import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from 'react-toastify';
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext()
export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:'',
    })
    const [isSearched, setIsSearched] = useState(false);
    
    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)



    // Integration
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])


    // function to fetch job data
    const fetchJobs = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs);
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to fetch company data
    const fetchCompanyData = async () => {
        try {
            
            const {data} = await axios.get(backendUrl+'/api/company/company',{headers:{token:companyToken}})

            if(data.success){
                setCompanyData(data.company)
                console.log(data);
                
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to fetch user data
    const fetchUserData = async () => {  // ✅ Added async
        try {
            const token = await getToken();  // ✅ Await works now
            const { data } = await axios.get(backendUrl + '/api/users/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to fetch user's applied applications data
    const fetchUserApplications = async () => {
        try {
            
            const token = await getToken()
            const {data} = await axios.get(backendUrl+'/api/users/applications',
                {headers:{Authorisation :`Bearer ${token}`}}
            )
            if(data.success){
                setUserApplications(data.applications)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    

    useEffect(()=>{
        fetchJobs()

        const storedComanyToken = localStorage.getItem('companyToken')

        if(storedComanyToken){
            setCompanyToken(storedComanyToken)
        }

    },[])

    useEffect(()=>{
        if(companyToken){
            fetchCompanyData()
        }
    },[companyToken])

    useEffect(() => {
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    },[user])
    
    const value = {
        setSearchFilter,searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications,
    }
    return (
    <AppContext.Provider value={value}>
    {
        props.children
    }
    </AppContext.Provider>
    )
}