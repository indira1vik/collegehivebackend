// BUILD-IN MODULES
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// CUSTOM MODULES
const UserModel = require('./modules/User');
const EventModel = require('./modules/Event');
const RegisterModel = require('./modules/Register');
const app = express();

// VARIABLES
const PORT = process.env.PORT || 3001;
const MONGO_LINK = "mongodb+srv://indira1vik:Indira113@campushive.rtixvc0.mongodb.net/college?retryWrites=true&w=majority";

// MONGOOSE
mongoose.connect(MONGO_LINK);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to database..."));

// EXPRESS
app.use(cors());
app.use(express.json());

// START SERVER
app.listen(PORT, () => {
    console.log("Server started...");
});

// CREATE USER
app.post('/createUser', async (req, res) => {
    const userid = req.body.userid;
    const fname = req.body.fname;
    const email = req.body.email;
    const dept = req.body.dept;
    const batch = req.body.batch;
    const role = req.body.role;
    const pass = req.body.pass;
    const hashedPass = bcrypt.hashSync(pass,8);
    const user = new UserModel({
        userid: userid,
        fname: fname,
        email: email,
        dept: dept,
        batch: batch,
        role: role,
        pass: hashedPass
    });
    try {
        await user.save();
        res.send("Success");
    } catch (err) {
        res.send("Error");
    }
});

// GET USERS DATA
app.get('/getUsersList', async (req, res) => {
    const data = await UserModel.find();
    if (data) {
        res.send(data);
    } else {
        res.send("Error");
    }
});

// GET USER DATA
app.post('/getUserData', async (req, res) => {
    const userid = req.body.userid;
    const data = await UserModel.findOne({ userid: userid });
    if (data) {
        res.send(data);
    }
})

// UPDATE USER ROLE
app.post('/updateUserRole', async (req, res) => {
    const userid = req.body.userid;
    const role = req.body.role;
    const userdata = await UserModel.findOneAndUpdate({ userid: userid }, { role: role });
    if (userdata) {
        res.send("Success");
    } else {
        res.send("Error");
    }
});

// CHECK LOGIN
app.post('/checkLogin', async (req, res) => {
    const userid = req.body.userid;
    const pass = req.body.pass;
    const userdata = await UserModel.findOne({ userid: userid });
    if (userdata) {
        if (bcrypt.compareSync(pass,userdata.pass)) {
            res.send(userdata);
        } else {
            res.send("Error");
        }
    } else {
        res.send("Error");
    }
});

// CREATE EVENT
app.post('/createEvent', async (req, res) => {
    const eventid = req.body.eventid;
    const ename = req.body.ename;
    const creatorid = req.body.creatorid;
    const desc = req.body.desc;
    const edate = req.body.edate;
    const reglink = req.body.reglink;
    const venue = req.body.venue;
    const verified = req.body.verified;
    const event = new EventModel({
        eventid: eventid,
        ename: ename,
        creatorid: creatorid,
        desc: desc,
        edate: edate,
        venue: venue,
        reglink: reglink,
        verified: verified
    });
    try {
        await event.save();
        res.send("Success");
    } catch (err) {
        res.send("Error");
    }
});

// GET NONE VERIFIED EVENTS
app.get('/getNoneVerifiedEvents', async (req, res) => {
    const notVerifiedList = await EventModel.find({ verified: false });
    if (notVerifiedList) {
        res.send(notVerifiedList);
    } else {
        res.send("Error");
    }
});

// VERIFY EVENT
app.post("/verifyEvent", async (req, res) => {
    const eventid = req.body.eventid;
    const eventData = await EventModel.findOneAndUpdate({ eventid: eventid }, { verified: true });
    if (eventData) {
        res.send("Success");
    } else {
        res.send("Error");
    }
});

// GET VERIFIED EVENTS
app.get('/getVerifiedEvents', async (req, res) => {
    const VerifiedList = await EventModel.find({ verified: true });
    if (VerifiedList) {
        res.send(VerifiedList);
    } else {
        res.send("Error");
    }
});

// GET CREATED EVENT LIST
app.post('/getCreatedEvents', async (req, res) => {
    const userid = req.body.userid;
    const eventData = await EventModel.find({ creatorid: userid });
    if (eventData) {
        res.send(eventData);
    } else {
        res.send("Error");
    }
});

// DELETE EVENT
app.post('/deleteEvent', async (req, res) => {
    const eventid = req.body.eventid;
    const toDeleteData = await EventModel.findOneAndDelete({ eventid: eventid });
    const connectedEvent = await RegisterModel.deleteMany({ 'event.eventid': eventid });
    if (toDeleteData) {
        res.send("Success");
    } else {
        res.send("Error");
    }
});

// ADD REGISTER
app.post('/addRegister', async (req, res) => {
    const userid = req.body.userid;
    const event = req.body.event;
    const data = await RegisterModel.findOne({ userid: userid, 'event.eventid': event.eventid });
    if (data) {
        res.send("Error");
    } else {
        const register = new RegisterModel({
            event: event,
            userid: userid
        });
        try {
            await register.save()
            res.send("Success");
        } catch (err) {
            res.send("Error");
        }
    }

});

// GET REGISTERED LIST
app.post('/getRegisteredList', async (req, res) => {
    const userid = req.body.userid;
    const regData = await RegisterModel.find({ userid: userid });
    if (regData) {
        res.send(regData);
    } else {
        res.send("Error");
    }
});

// UPDATE PROFILE
app.post('/updateProfile', async (req, res) => {
    const editEmail = req.body.editEmail;
    const editFname = req.body.editFname;
    const editPass = req.body.editPass;
    const userid = req.body.userid;
    const findUser = await UserModel.findOneAndUpdate({ userid: userid }, { email: editEmail, fname: editFname, pass: editPass });
    if (findUser) {
        res.send("Success");
    } else {
        res.send("Error");
    }
});

// GET EVENT TO EDIT
app.post('/getEventToEdit', async (req, res) => {
    const eventid = req.body.eventid;
    const editEvent = await EventModel.findOne({ eventid: eventid });
    if (editEvent) {
        res.send(editEvent);
    } else {
        res.send("Error");
    }
});

// EDIT EVENT
app.post('/editEventDetails', async (req, res) => {
    const eventid = req.body.eventid;
    const ename = req.body.ename;
    const desc = req.body.desc;
    const edate = req.body.edate;
    const venue = req.body.venue;
    const reglink = req.body.reglink;
    const verified = req.body.verified;
    const udpatedEvent = await EventModel.findOneAndUpdate({ eventid: eventid }, {
        ename: ename,
        desc: desc,
        edate: edate,
        venue: venue,
        reglink: reglink,
        verified: verified
    });
    const updatedEventInReg = await RegisterModel.updateMany({ 'event.eventid': eventid }, {
        'event.ename': ename,
        'event.desc': desc,
        'event.edate': edate,
        'event.venue': venue,
        'event.reglink': reglink
    })
    if (udpatedEvent) {
        res.send("Success");
    } else {
        res.send("Error");
    }
});