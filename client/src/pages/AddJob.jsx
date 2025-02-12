import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets, JobCategories, JobLocations } from '../assets/assets';
import Quill from 'quill';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AddJob = () => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Banglore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const { backendUrl, companyToken } = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const description = quillRef.current ? quillRef.current.root.innerHTML : '';

            const { data } = await axios.post(
                `${backendUrl}/api/company/post-job`,
                { title, description, location, salary, category, level },
                { headers: { token: companyToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setTitle('');
                setSalary(0);
                setCategory('Programming');
                setLocation('Banglore');
                setLevel('Beginner level');
                quillRef.current?.setText(''); // Reset editor
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            });
        }
    }, []);

    return (
        <form onSubmit={onSubmitHandler} className="container p-4 flex-col w-full items-start gap-3">
            <div className="w-full">
                <p className="mb-2">Job Title</p>
                <input
                    type="text"
                    placeholder="Type here"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                    className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
                />
            </div>

            <div className="w-full max-w-lg">
                <p className="my-2">Job Description</p>
                <div ref={editorRef}></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                    <p className="mb-2">Job Category</p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    >
                        {JobCategories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className="mb-2">Job Location</p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                    >
                        {JobLocations.map((loc, index) => (
                            <option key={index} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className="mb-2">Job Level</p>
                    <select
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded"
                        onChange={(e) => setLevel(e.target.value)}
                        value={level}
                    >
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                </div>
            </div>

            <div>
                <p className="mb-2">Job Salary</p>
                <input
                    min={0}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
                    onChange={(e) => setSalary(Number(e.target.value))}
                    type="number"
                    placeholder="25000"
                    value={salary}
                />
            </div>
            <button className="w-28 py-3 mt-4 bg-black text-white rounded">ADD</button>
        </form>
    );
};

export default AddJob;
