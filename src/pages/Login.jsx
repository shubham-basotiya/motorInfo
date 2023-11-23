import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
// import SignUp from './SignUp';
// import { Route } from 'react-router-dom';

async function loginUser(credentinals){
    return fetch('http://localhost:8080/login', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentinals)
    })
    .then(res => res.json())
    .then(data => data);
}

export default function Login({setToken}){
    const [usEmail, setusEmail] = useState();
    const [usPassword, setusPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        // console.log(usEmail  + " " + usPassword);

        const token = await loginUser({
            usEmail, usPassword
        });
        // console.log("token : " + token);
        if(token.token !== "no data"){
            setToken(token);
            document.location.href = 'http://localhost:3000/';
        } else{
            alert("wrong email and password");
        }
    }
    
    return (
        <div className='Home'>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                            <label>Username : </label>
                            <input type="email" onChange={e => setusEmail(e.target.value)} />
                        </tr>
                        <tr>
                            <label>Password : </label>
                            <input type="password" onChange={e => setusPassword(e.target.value)} />
                        </tr>
                        <tr>
                            <input type="submit" value="Submit"/>
                        </tr>
                    </table>
                </form>
                <Link to="/signup">Sign Up</Link>
            </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}