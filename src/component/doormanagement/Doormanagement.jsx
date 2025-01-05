import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Endpoints from '../../../Endpoint';
import { notification } from 'antd';
import '../home/home.css';
import { useNavigate } from 'react-router-dom';

const Doormanagement = () => {
    const [doers, setdoers] = useState([]);
    const [editingDoer, setEditingDoer] = useState(null);
    const navigate = useNavigate()

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
    }, []);

    const handelDelete = async (e) => {
        let parent = e.target.closest('tr'); 
        const id = e.target.id
        try {
            const response = await axios.post(Endpoints.deleteDoer, id, {withCredentials:true});
            if (response.status === 200) {
                notification.success({
                    message: 'Doer Deleted Successfully',
                });
                setdoers((prev) => prev.filter((doer) => doer._id !== e.target.id));
            }
        } catch (error) {
            // console.log(error.response)
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: error.response.data.message,
                });
                navigate('/login');
            } else {
                notification.error({
                    message: error.message || 'Failed to update task',
                });
            }
        }
    };

    const handelEdit = (doer) => {
        setEditingDoer({ ...doer });
    };

    const handleSave = async () => {
        const data = {
            id: editingDoer._id,
            name: editingDoer.name,
            email: editingDoer.email,
        }
        try {
            const response = await axios.post(Endpoints.editDoer, data, {
                withCredentials: true
            });
            if (response.status === 200) {
                notification.success({
                    message: 'Doer Updated Successfully',
                });
                setdoers((prev) =>
                    prev.map((doer) =>
                        doer._id === editingDoer._id
                            ? { ...doer, name: editingDoer.name, email: editingDoer.email }
                            : doer
                    )
                );
                setEditingDoer(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: error.response.data.message,
                });
                navigate('/login');
            } else {
                notification.error({
                    message: error.message || 'Failed to update task',
                });
            }
            setEditingDoer(null);
        }
    };

    
    return (
        <div className="flex justify-center gap-4">
            {doers && doers.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Doer Name</th>
                            <th>Doer Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doers.map((doer) => (
                            <tr key={doer._id}>
                                <td>
                                    {editingDoer && editingDoer._id === doer._id ? (
                                        <input
                                            type="text"
                                            value={editingDoer.name}
                                            onChange={(e) =>
                                                setEditingDoer((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        doer.name
                                    )}
                                </td>
                                <td>
                                    {editingDoer && editingDoer._id === doer._id ? (
                                        <input
                                            type="email"
                                            value={editingDoer.email}
                                            onChange={(e) =>
                                                setEditingDoer((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        doer.email
                                    )}
                                </td>
                                <td>
                                    <div className="flex w-7 gap-4">
                                        {editingDoer && editingDoer._id === doer._id ? (
                                            <button
                                                onClick={handleSave}
                                                className="bg-green-600 text-white px-7"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handelEdit(doer)}
                                                className="bg-gray-600 text-white px-7"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            id={doer._id}
                                            onClick={handelDelete}
                                            className="bg-gray-600 text-white px-7"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <h1>No Doers Found</h1>
            )}
        </div>
    );
};

export default Doormanagement;
