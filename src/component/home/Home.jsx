import React, { useEffect, useState } from 'react'
import Endpoints from '../../../Endpoint'
import axios from 'axios'
import { notification } from 'antd'
import './home.css'



const Home = () => {

  const [data, setData] = useState([])


  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await axios.get(Endpoints.notCompleter)
        console.log(response.data)
        if (response.status === 200) {
          notification.success({
            message: "success"
          })
        }
        setData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])


  // console.log(data)

  return (
    <div className='containerrr'>
      {
        data && data.length > 0 ? (
          <table >
            <thead>
              <tr>
                <th>Task Id</th>
                <th>Task Description</th>
                <th>Planned Time</th>
                <th>Assigner Email</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Complete time</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((value, index) => (
                  <tr key={index}>
                    <td>{value._id || ""}</td>
                    <td>{value.description || ""}</td>
                    <td>{value.planedTime || ""}</td>
                    <td>{value.assignBy?.email || ""}</td> 
                    <td>{value.dateTime || ""}</td>
                    <td>{value.status || ""}</td>
                    <td>{value.completeTime || ""}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        ) : (<h1>no data found</h1>)
      }

    </div>
  )
}

export default Home
