import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

export default function SignUp({setToken}){

    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    // let token = sessionStorage.getItem('token');
    // let tokenData = JSON.parse(token);
    // token = tokenData.token;

    const submitFormData = async e => {
        e.preventDefault();

        await fetch('http://localhost:8080/signup', {
            method: 'post',
            headers: {
                // "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fname, lname, email, password})
        }).then(res => res.json())
        .then(data => {
            // const token = JSON.parse(data);
            // console.log(token);
            setToken(data);
        })
        // .then(r =>  r.json().then(data => ({body: data})))
        // .then(obj => {
        //     console.log(obj);
        //     setToken(obj.body);
        // });

        document.location.href = 'http://localhost:3000/';

    }

    return (<div>
            <form onSubmit={submitFormData}>
                {/* <table>
                    <tr> */}
                        <label>First Name: </label>
                        <input type="text" onChange={e => setFname(e.target.value)} />
                    {/* </tr>
                    <tr> */}
                        <label>Last Name: </label>
                        <input type="text" onChange={e => setLname(e.target.value)} />
                    {/* </tr>
                    <tr> */}
                        <label>Email: </label>
                        <input type="email" onChange={e => setEmail(e.target.value)} />
                    {/* </tr>
                    <tr> */}
                        <label>Password: </label>
                        <input type="password" onChange={e => setPassword(e.target.value)}/>
                    {/* </tr>
                    <tr> */}
                        <input type="submit" value="Submit" />
                    {/* </tr>
                </table> */}
            </form>
        </div>);
}

SignUp.propTypes = {
    setToken: PropTypes.func.isRequired
}