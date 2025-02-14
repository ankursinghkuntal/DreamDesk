import React, { useContext, useEffect, useState } from 'react';
import { assets, viewApplicationsPageData } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const ViewApplications = () => {
    const { backendUrl, companyToken } = useContext(AppContext);
    const [applicants, setApplicants] = useState([]);


    // Function to fetch company job applications data
    const fetchCompanyJobApplications = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
                headers: { token: companyToken },
            });

            if (data.success) {
                setApplicants(data.applications.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to update Job Application Status
    const changeJobApplicationStatus = async (id, status) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/company/change-status`,
                { id, status },
                { headers: { token: companyToken } }
            );

            if (data.success) {
                fetchCompanyJobApplications();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobApplications();
        }
    }, [companyToken]);

    return applicants ? (
        applicants.length === 0 ? (
            <div className="flex items-center justify-center h-[70vh]">
                <h1>No Applications Available</h1>
            </div>
        ) : (
            <div className="container mx-auto p-4">
                <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4 text-left">#</th>
                            <th className="py-2 px-4 text-left">User Name</th>
                            <th className="py-2 px-4 text-left max-md:hidden">Job Title</th>
                            <th className="py-2 px-4 text-left max-md:hidden">Location</th>
                            <th className="py-2 px-4 text-left">Resume</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants
                            .filter((item) => item.jobId && item.userId)
                            .map((applicant, index) => (
                                <tr key={index} className="text-gray-700">
                                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                                    <td className="py-2 px-4 border-b flex items-center">
                                        <img
                                            className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                                            src={applicant.userId.image}
                                            alt={`${applicant.userId.name}'s profile`}
                                        />
                                        <span>{applicant.userId.name}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b max-md:hidden">{applicant.jobId.title}</td>
                                    <td className="py-2 px-4 border-b max-md:hidden">{applicant.jobId.location}</td>
                                    <td className="py-2 px-4 border-b">
                                        <a
                                            href={applicant.userId.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                                        >
                                            Resume <img src={assets.resume_download_icon} alt="Download Icon" />
                                        </a>
                                    </td>
                                    <td className="py-2 px-4 border-b relative">
                                    {applicant.status === 'Pending' ? (
                                        <div className="relative inline-block text-left group">
                                            <button className="text-gray-500 action-button">...</button>
                                            <div className="absolute hidden group-hover:block group-focus-within:block top-full mt-2 right-0 z-10 bg-white shadow-md text-black rounded p-2 w-32">
                                                <ul className="list-none m-0 p-2 bg-white rounded border-0 text-sm">
                                                    <li 
                                                        onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')} 
                                                        className="py-1 px-2 pr-10 cursor-pointer hover:bg-gray-100 text-blue-500"
                                                    >
                                                        Accept
                                                    </li>
                                                    <li 
                                                        onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')} 
                                                        className="py-1 px-2 pr-10 cursor-pointer hover:bg-gray-100 text-red-500"
                                                    >
                                                        Reject
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>{applicant.status}</div>
                                    )}
                                </td>

                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        )
    ) : (
        <Loading />
    );
};

export default ViewApplications;
