import React, { Component } from 'react';

function Contact(){
    return(
        <div className='Contact'>
            <h1>Contact page</h1>
                <p>Name : Shubham Sharma</p>
                <p>timepass - Project</p>
            <p>Copyright@{`${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`}</p>
        </div>
    );
}

export default Contact;