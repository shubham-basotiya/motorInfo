import React from 'react';
import BlogDetail from './BlogDetail';
import Blog from './Blog';
import Contact from './Contact';
import Login from './Login';
import SignUp from './SignUp';
import { Switch, Route } from 'react-router-dom';
import Logout from './Logout';
import Navbar from './Navbar';
import User from './User';
import Edit from './Edit';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import { SwipeTwoTone } from '@mui/icons-material';
// import SignUp from './SignUp';

function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
}
function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
} 

export default function Home() {

    const [motorDetail, setmotorDetail] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/motorDetail',{
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            // console.log("typeof res.data : " + typeof(res.data));
            // alert("typeof res.data : " + typeof(res.data));
            setmotorDetail([...res.data]);
            console.log("type of motorDeatil after data come : " + Array.isArray(motorDetail));
        });
    }, []);

    const token = getToken();
    // console.log("login page");

    if(!token){
        // return <Login setToken={setToken} />;
        return (
            <div className="grid-container" style={{
                display: "grid"
              }}>
                <div className="grid-item">
                    <Switch>
                        <Route path="/signup" render={(props) => <SignUp setToken={setToken}  {...props} /> } />
                        <Route path="/" render={(props) => <Login setToken={setToken} {...props} />} />
                    </Switch>
                </div>
                <div className="grid-item">
                    <h1>Daily Motor Data</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Motor Start User Name</td>
                                <td>Motor Stop User Name</td>
                                <td>Motor Start User Email</td>
                                <td>Motor Stop User Email</td>
                                <td>Start Time</td>
                                <td>End Time</td>
                                {/* <td>Time Duration</td> */}
                            </tr>
                        </thead>
                        <tbody>
                    
                                {motorDetail.map(( item, index ) => {
                                    return (
                                      <tr key={index}>
                                        <td>{item.userName[0]}</td>
                                        <td>{item.userName[1]}</td>
                                        <td>{item.userEmail[0]}</td>
                                        <td>{item.userEmail[1]}</td>
                                        <td>{item.startTime}</td>
                                        <td>{item.stopTime}</td>
                                        <td>{item.status}</td>
                                        {/* <td>{item.stopTime - item.startTIme}</td> */}
                                      </tr>
                                    );
                                  })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    return (
        //  <Navbar />
        <Switch>
            <Route path="/edit/:id" component={Edit} />
            <Route path="/blog/:id" component={BlogDetail} />
            <Route path="/blog" component={Blog} />
            {/* <Route path="/signup" component={SignUp} /> */}
            <Route path="/contact" component={Contact} />
            <Route path="/users" component={User} />
            <Route path="/" component={Navbar} />
            {/* <Route path="/" render={(props) => <Home sortBy="new" {...props}/>} /> */}
        </Switch>
        // {/* <SignInSide /> */}
    );
}
