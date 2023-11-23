import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function User()  {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
              const response = await fetch('http://localhost:8080/users');
              const data = await response.json();
            //   console.log(data);
              setUsers(data);
            } catch (error) {
              console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <td>profile's</td>
                </tr>
            </thead>
            <tbody>
                {users.map((item, index) => <tr><Link to={`/edit/${item._id}`}>{item.email}</Link></tr>)}
            </tbody>
        </table>
    );
}