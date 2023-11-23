import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRadioGroup } from '@mui/material';

export default function Edit({match}){

    let token = sessionStorage.getItem('token');
    let tokenData = JSON.parse(token);
    token = tokenData.token;

    const [userDetails, setUserDatail] = useState([]);
    const [current_login_id, setCurrentLoginId] = useState();
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    useEffect(() => {
        axios.get(`http://localhost:8080/edit/${match.params.id}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            // console.log(res);
            setUserDatail(res.data.fetch_user_detail);
            setCurrentLoginId(res.data.current_login_user_id);
        });

    } , []);

    const updateFormData = async (e) => {
        e.preventDefault();

        axios.patch(`http://localhost:8080/edit/${userDetails._id}`, { fname, lname, email, password },
            {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            setUserDatail(res.data);
            if(sessionStorage.getItem('token')){
                sessionStorage.clear();
                document.location.href = 'http://localhost:3000';
            }
        });
    }
    
    const deleteAccount = async () => {
        // let lastCall = confirm('Are you sure to delete account?', 0);
        // if(lastCall){
            axios.delete(`http://localhost:8080/user/${userDetails._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then(res => {
                alert("account delete successfully " + res.data.usEmail);
                if(sessionStorage.getItem('token')){
                    sessionStorage.clear();
                    document.location.href = 'http://localhost:3000';
                }
            })
        // }
    }
    return (
        <div>
            <form onSubmit={updateFormData}>
                <table>
                    <tr>
                        <label>First Name: </label>
                        <input type="text" placeholder={userDetails.fname} onChange={e => setFname(e.target.value)} />
                    </tr>
                    <tr>
                        <label>Last Name: </label>
                        <input type="text" placeholder={userDetails.lname} onChange={e => setLname(e.target.value)} />
                    </tr>
                    <tr>
                        <label>Email: </label>
                        <input type="email" placeholder={userDetails.email} onChange={e => setEmail(e.target.value)} />
                    </tr>
                    <tr>
                        <label>Password: </label>
                        <input type="password" placeholder={userDetails.password} onChange={e => setPassword(e.target.value)}/>
                    </tr>
                    <tr>
                        <td>
                            {current_login_id === userDetails._id && <input type="submit" value="Edit" />}
                        </td>
                        <td>
                            {current_login_id === userDetails._id && <button onClick={deleteAccount}> Delete A/C</button>}
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    );
}