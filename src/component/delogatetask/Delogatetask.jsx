import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { notification } from 'antd';
import Endpoints from '../../../Endpoint';
import { useNavigate } from 'react-router-dom';

const Delogatetask = () => {
    const [isTaskDelegationForm, setIsTaskDelegationForm] = useState(true);
    const [doers, setdoers] = useState([]);
    const navigate = useNavigate()
    const [taskDelegationData, setTaskDelegationData] = useState({
        assignBy: '',
        description: '',
        dateTime: '',
    });

    console.log(taskDelegationData)
    const [addDoerData, setAddDoerData] = useState({
        name: '',
        email: '',
    });

    const handleFormToggle = () => {
        setIsTaskDelegationForm(!isTaskDelegationForm);
    };



    const handleTaskDelegationChange = (e) => {
        setTaskDelegationData({
            ...taskDelegationData,
            [e.target.name]: e.target.value,
        });
    };


    const handleAddDoerChange = (e) => {
        setAddDoerData({
            ...addDoerData,
            [e.target.name]: e.target.value,
        });
    };



    useEffect(() => {
        const fetchDoers = async () => {
            try {
                const response = await axios.get(Endpoints.getDoer);
                if (response.status === 200) {
                    setdoers(response.data.data);
                }
            } catch (error) {
                notification.warning({
                    message: error.message,
                });
            }
        };
        fetchDoers();
    }, [])

    console.log(doers)


    const handleTaskDelegationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(Endpoints.taskDelegation, taskDelegationData, {withCredentials:true});
            if (response.status === 200) {
                notification.success({
                    message: 'Task Delegation Created Successfully',
                });
                navigate('/')
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: error.response.data.message,
                });
                navigate('/login');
            } else {
                notification.error({
                    message: error.response.data.message || 'Failed to update task',
                });
            }
        }
    };


    const handleAddDoerSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(Endpoints.addDoer, addDoerData, { withCredentials: true });
            if (response.status === 200) {
                notification.success({
                    message: 'Doer Added Successfully',
                });
                window.location.reload();
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: 'Unauthorized - Please log in',
                });
                navigate('/login');
            } else {
                notification.error({
                    message: error.response.data.message || 'Failed to update task',
                });
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
            <div className="mb-6 flex justify-between items-center">
                <button
                    onClick={handleFormToggle}
                    className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                >
                    {isTaskDelegationForm ? 'Add Doer' : 'Task Delegation'}
                </button>
            </div>

            {isTaskDelegationForm ? (
                <form onSubmit={handleTaskDelegationSubmit}>
                    <h3 className="text-2xl font-semibold text-center mb-4">Task Delegation</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Assign By</label>
                        <select className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" name="assignBy" onChange={handleTaskDelegationChange} >
                            <option value="">Select Doer</option>
                            {
                                doers && doers.map((value, index) => (
                                    <option value={value._id}>{value.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={taskDelegationData.description}
                            onChange={handleTaskDelegationChange}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Date and Time</label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={taskDelegationData.dateTime}
                            onChange={handleTaskDelegationChange}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        Submit Task Delegation
                    </button>
                </form>
            ) : (
                <form onSubmit={handleAddDoerSubmit}>
                    <h3 className="text-2xl font-semibold text-center mb-4">Add Doer</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={addDoerData.name}
                            onChange={handleAddDoerChange}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={addDoerData.email}
                            onChange={handleAddDoerChange}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        Submit Add Doer
                    </button>
                </form>
            )}
        </div>
    );
};

export default Delogatetask;
