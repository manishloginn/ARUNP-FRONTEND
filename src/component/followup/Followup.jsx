import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { notification } from 'antd';
import Endpoints from '../../../Endpoint';
import '../home/home.css';
import { useNavigate } from 'react-router-dom';

const Followup = () => {
    const [data, setData] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [doer, setdoer] = useState([])
    const navigate = useNavigate()
    // axios.defaults.withCredentials = true; 
    const [selectedTask, setSelectedTask] = useState({
        id: '',
        assignBy: '',
        description: '',
        dateTime: '',
        status: '',
    });
    console.log(selectedTask)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(Endpoints.taskDashboard);
                const doerresponse = await axios.get(Endpoints.getDoer);
                // console.log(doerresponse.data.data)
                if (doerresponse.status === 200) {
                    setdoer(doerresponse.data.data)
                }
                if (response.status === 200) {
                    setData(response.data.data);
                    notification.success({
                        message: 'Data fetched successfully',
                    });
                }
            } catch (error) {
                notification.warning({
                    message: error.message,
                });
            }
        };

        fetchData();
    }, []);

    const handlestatus = async (e) => {
        const data = {
            id: e.target.id,
            status: 'Complete',
        }
        try {
            const response = await axios.post(Endpoints.changeStatus, data,
                { withCredentials: true }
            );
            if (response.status === 200) {
                const parent = e.target.closest('tr');
                const statusCell = parent.querySelector('#status');
                const completeTime = parent.querySelector('#completetime');
                if (completeTime) {
                    completeTime.innerText = response.data.data.completeTime;
                }
                if (statusCell) {
                    statusCell.innerText = 'Complete';
                    statusCell.style.color = 'black';
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: 'Unauthorized - Please log in',
                });
                navigate('/login'); 
            } else {
                notification.error({
                    message: error.message || 'Failed to update task',
                });
            }
        }
    };

    const handleRevision = (task) => {

        setSelectedTask({
            id: task._id,
            assignBy: task.assignBy ? task.assignBy._id : "",
            description: task.description,
            dateTime: task.dateTime,
            status: task.status,
        });
        setIsPopupVisible(true);
    };

    const handlePopupSubmit = async () => {
        try {
            const response = await axios.post(Endpoints.addRevision, selectedTask, {withCredentials:true});
            if (response.status === 200) {
                notification.success({
                    message: 'Task updated successfully',
                });
                setIsPopupVisible(false);
                setData((prev) =>
                    prev.map((task) =>
                        task._id === selectedTask.id
                            ? { ...task, ...response.data.data }
                            : task
                    )
                );
            }
            if(response.status === 400) {
                console.log('here')
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: 'Unauthorized - Please log in',
                });
                navigate('/login'); 
            } else {
                notification.error({
                    message: error.message || 'Failed to update task',
                });
            }
           
        }
    };


    console.log(data)
    return (
        <div className="containerrr">
            {data && data.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Task Id</th>
                            <th>Task Description</th>
                            <th>Planned Time</th>
                            <th>Assigner Email</th>
                            <th>Timestamp</th>
                            <th>Doer Name</th>
                            <th>Status</th>
                            <th>Complete Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((value, index) => (
                            <tr key={index}>
                                <td>{value._id || ""}</td>
                                <td>{value.description || ""}</td>
                                <td>{value.planedTime || ""}</td>
                                <td>{value.assignBy ? value.assignBy.email : "N/A"}</td>
                                <td>{value.dateTime || ""}</td>
                                <td>{value.assignBy ? value.assignBy.name : "N/A"}</td>
                                <td
                                    id="status"
                                    style={{
                                        color: value.status === 'Pending' ? 'red' : 'black',
                                    }}
                                >
                                    {value.status}
                                </td>
                                <td id="completetime">{value.completeTime}</td>
                                <td>
                                    <div className="flex gap-2 text-xs">
                                        <button
                                            id={value._id}
                                            onClick={handlestatus}
                                            className="bg-gray-600 text-white"
                                        >
                                            Mark as Complete
                                        </button>
                                        <button
                                            onClick={() => handleRevision(value)}
                                            className="bg-gray-600 text-white"
                                        >
                                            Add Revision
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <h1>No data found</h1>
            )}

            {isPopupVisible && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Edit Task</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handlePopupSubmit();
                            }}
                        >
                            <label>
                                Assign By:
                                <select
                                    value={selectedTask.assignBy}
                                    onChange={(e) =>
                                        setSelectedTask((prev) => ({
                                            ...prev,
                                            assignBy: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="" disabled>
                                        Select a Doer
                                    </option>
                                    {doer.map((value) => (
                                        <option key={value._id} value={value._id}>
                                            {value.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Description:
                                <input
                                    type="text"
                                    value={selectedTask.description}
                                    onChange={(e) =>
                                        setSelectedTask((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Date Time:
                                <input
                                    type="datetime-local"
                                    value={selectedTask.dateTime}
                                    onChange={(e) =>
                                        setSelectedTask((prev) => ({
                                            ...prev,
                                            dateTime: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    value={selectedTask.status}
                                    onChange={(e) =>
                                        setSelectedTask((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Complete">Complete</option>
                                </select>
                            </label>
                            <div className="popup-actions">
                                <button type="submit" className="bg-green-600 text-white">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-600 text-white"
                                    onClick={() => setIsPopupVisible(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Followup;
