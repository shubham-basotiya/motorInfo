const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const checkAuthorization = require('./server/middleware/addToken');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/waterMotor')
        .then(() => console.log("connected to mongodb waterMotor"))
        .catch((err) => console.log("not connected to mongodb waterMotor"));

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: [true, "First name is required"]
    },
    lname: {
        type: String,
        required: [true, "Second name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String, 
        required: [true, "Password is required"] 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

const Motorfile = mongoose.model('Motorfile', userSchema);

/** User Motor Detail Model */

const motorSchema = mongoose.Schema({
    userName: Array,
    userEmail: Array,
    startTime: Date,
    stopTime: Date,
    status: {
        type: Boolean,
        default: false
    }
})

const Motorhistory = mongoose.model('Motorhistory', motorSchema);

const app = express();

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
 
app.use(cors());

app.use('/login', async(req, res) => {
    console.log(req.body);
    const user = await Motorfile.findOne({email: req.body.usEmail});
    console.log(user);
    if(user){
        let token = jwt.sign({"_id": user._id}, "huha");
        // res.setHeader("Authorization", `Bearer ${token}`);
        // res.json(token);

        res.json({"token": token});
    }
    else
        res.json({"token": "no data"});
});

app.post('/signup', async(req, res) => {
    // const authHeader = req.headers['authorization']
    // console.log(authHeader);
    // const token = authHeader.split(' ')[1];
    // jwt.verify(token, "huha", (err, user) => {
    //     console.log(err);
    //     if(err)
    //         return res.status(401).send("error comes");
    //     console.log(user);
    //     req.user = user;
    // });
    // console.log(req.user);
    // if(req.user){
        const savedUser = new Motorfile(req.body);
        const savedUserData = await savedUser.save();
        console.log("savedUserData : " + savedUserData);
        const user = await Motorfile.findOne({email: savedUserData.email});
        console.log("user : " + user);
        if(user){
            console.log("if condition")
            let token = jwt.sign({"_id": user._id}, "huha");
            // res.setHeader("Authorization", `Bearer ${token}`);
            // res.json(token);
    
            res.json({"token": token});
        }
        else{
            console.log("else condition");
            res.send("no data");
        }
})

app.use('/users', async(req, res) => {
    await Motorfile.find()
        .then((documents) => {
            // console.log(documents);
            res.status(200).json(documents)
        });
    });

app.get('/edit/:id', checkAuthorization, async(req, res) => {
    // console.log(req.user._id + " " + req.params.id);
    let data = await Motorfile.findById(req.params.id);
    // if(req.user._id === req.params.id){
        // let newData = {...data, edit: true};
        // console.log("if " + data);
        // res.json(data);
        // console.log('if condition');
        // res.send("you can edit profile, because it's you own profile.");
    // } else{
        // console.log('else condition')
        // res.send("you cannot edit this profile, because it's not your own profile");
    //     console.log("else " + data);
    //     res.json(data);
    // }
    let login_id_and_fech_user_id= {
     current_login_user_id : req.user._id,
     fetch_user_detail: data   
    }
    console.log(login_id_and_fech_user_id);
    res.json(login_id_and_fech_user_id);
})

app.patch('/edit/:id', checkAuthorization, async (req, res) => {
    let updatedData = await Motorfile.findByIdAndUpdate(req.params.id,
        {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            updatedAt: Date.now() 
        }, {new: true});

        res.json(updatedData);
});

app.delete('/user/:id', checkAuthorization, async (req, res) => {
    let deletedAccount = await Motorfile.deleteOne({_id: req.params.id});
    res.json(deletedAccount);
})


app.get('/motorStatus', checkAuthorization, async (req, res) => {
    // console.log(req.params.motorStatus);
    // res.json(req.params.motorStatus);

    const start = new Date().toDateString();
    // const todayOrders = await Order.findOne({
    //         startTime: {$gte : start }
    // });
    console.log(req.query.motor);
    let getStatus = await Motorhistory.findOne({startTime: {$gte : start }}).sort({ startTime: -1 });
    console.log("getStatus : " + getStatus);
    let getLoginUserData = await Motorfile.findOne({_id: req.user._id});
    console.log("getLoginUserData : " + getLoginUserData);
    if(getStatus !== null) {
        console.log("if condition");
        let newgetStatus = {
            // login_user_id: getLoginUserData,
            // status: true
            loginUserFname: getLoginUserData.fname,
            loginUserEmail: getLoginUserData.email,
            loggedInUserId: getLoginUserData._id,
            motorStatus: getStatus.status
        };
    
        res.json(newgetStatus);
    } else {
        console.log("else condition");
        let newgetStatus = {
            loginUserFname: getLoginUserData.fname,
            loginUserEmail: getLoginUserData.email,
            loggedInUserId: getLoginUserData._id,
            motorStatus: false
        };
        res.json(newgetStatus);
    }
})

app.patch('/motorOn',checkAuthorization, async (req, res) => {
    // console.log("req.body : " + req.body);
    if(req.body.status === false){
        console.log("if : " + req.body.userEmail);
        let updatedData = await Motorhistory.findOneAndUpdate({status: true},
            {   status: req.body.status,
                stopTime: req.body.stopTime,
                // $push: {userEmail: req.body.userEmail},
                $push: {userEmail: req.body.userEmail, userName: req.body.userName},
            }, {new: true, upsert: true});

        res.json(updatedData.status);
    } else{
        console.log("else : " + req.body.userEmail);
        let updatedData = await Motorhistory.findOneAndUpdate({status: true},
        {   status: req.body.status,
            startTime: req.body.startTime,
            // $push: {userEmail: req.body.userEmail},
            $push: {userEmail: req.body.userEmail, userName: req.body.userName},
        }, {new: true, upsert: true});

        res.json(updatedData.status);
    }
    // const savedUser = new Motorhistory(req.body);
    //     const savedUserData = await savedUser.save();
    //     res.json(savedUserData.status);
})

// app.patch('/motorOff',checkAuthorization, async (req, res) => {
//     let updatedData = await Motorhistory.findOneAndUpdate({status: true},
//         req.body, {new: true});

//         res.json(updatedData.status);

//     // const savedUser = new Motorhistory(req.body);
//     //     const savedUserData = await savedUser.save();
//     //     res.json(savedUserData.status);
// })

app.get('/motorDetail', async(req, res) => {
    const start = new Date().toDateString();
    let motorDetail = await Motorhistory.find({startTime: {$gte : start }});
    res.json(motorDetail);
})

app.listen(8080, () => { console.log('server connected successfully')});