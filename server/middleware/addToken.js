// const express = require('express');
const jwt = require('jsonwebtoken');

function checkAuthorization(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("headers : " + authHeader);
    const token = authHeader.split(' ')[1];
    // console.log(token);
    try{
    const user = jwt.verify(token, "huha");
    req.user = user;
    // const user = await Motorfile.findOne({email: req.body.usEmail});
    // console.log(req.user);
    // req.setHeader("Authorization", )
    next();
    } catch(err){
        console.log(err.message);
    }
}

module.exports = checkAuthorization;