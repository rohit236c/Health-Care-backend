const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const asyncHandler = require("../async");
const {
    generateToken
} = require("../config/jwt");
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
// Load User model
const User = require("../models/users");
const Patients = require("../models/Patient");
const Doctors = require("../models/doctor");
const Documents = require('../models/Documents');
const morgan = require('morgan');
const mongoose = require("mongoose");
exports.signup = asyncHandler(async (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(async (user) => {
                        let token = generateToken({
                            id: user._id,
                            email: user.email
                        });
                        if (user.role === "doctor") {
                            await createDoctor(user);
                        } else {
                            await createPatient(user);
                        }
                        return res.json({
                            success: true,
                            token: token,
                            message: "User registered"
                        });

                    }).catch((err) => {
                        return res.status(404).json({
                            success: false,
                            message: 'Error in processing'
                        });
                    });
                });
            });
        }
    });
});

createPatient = asyncHandler(async (user) => {
    const newPatient = new Patients({
        id: user._id,
        name: user.name,
    });
    await newPatient.save();
});

createDoctor = (async (user) => {
    const newDoctor = new Doctors({
        id: user._id,
        name: user.name,
    });
    await newDoctor.save();
});


exports.login = asyncHandler(async (req, res, next) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json({
            message: errors
        });
    }
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,"e",password);
    try {
        const user = await User.findOne({
            email: email
        });
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({
                success: false,
                message: "Invalid email or password!"
            });
        }
        const obj = {
            email: user.email,
            id: user._id
        };
        const token = generateToken(obj);
        return res.json({
            success: true,
            token: token,
            user,
            message: "User login"
        });
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: 'ERROR IN PROCESSING'
        });
    }
});

exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctors.find();
    res.json({
        success: true,
        message: "doctors sent",
        doctors
    });
});

exports.provideAccess = asyncHandler(async(req,res)=>{
    const doctors = req.body.doctors;
    const user = await User.findById(req.body.id);
    const patient = await Patients.findOne({id: req.body.id});
    console.log(patient, "pp")
    for(let i = 0; i < doctors.length; i++) {
        if(patient.doctors.length === 0) {
            patient.doctors.push(doctors[i]);
        } else{
            patient.doctors.indexOf(doctors[i]) === -1? patient.doctors.push(doctors[i]): "";
        }
        let doctorId = doctors[i];
        const doc = await Doctors.findById(doctorId);
        let index = doc.patients.indexOf(req.body.id) === -1? doc.patients.push(req.body.id): "";
        await doc.save();
    }
    
    await patient.save();

    res.json({
        success: true,
        message: 'doctors added'
    });
});

exports.getPatients = asyncHandler(async(req,res,next) => {
    const docId = req.params.id;
    const doctor = await Doctors.findOne({id:docId});
    
    // let arr = doctor.patients.map(ele => new mongoose.Types.ObjectId(ele));
    const patient = await Patients.find().where('id').in(doctor.patients).exec();
    res.json({patients: patient, success: true});
});

exports.getSecret = asyncHandler(async(req, res, next) => {
    let userid = req.body.patientid
    let documentid = ""
    let secret = req.body.secret
    let doctorid = req.body.doctorid
    console.log("call ayi ithe", req.body)

    // TODO: CHANGE IT TO PASSWORD VALIDATION
    let doctor = await Doctors.findOne({id: doctorid}).exec()

    if (doctor == null) {
        return res.status(400).json({success: false, message: "Invalid Secret"})
    }

    let patient =  await Patients.findOne({
        id: userid
    }).exec()

    res.status(200).json({
        success: true,
        message: "secret sent",
        patient: patient
    }); 
});


exports.getDocuments = asyncHandler(async(req,res,next)=>{
    let userid = req.body.userid
    let documentid = req.body.document_id

    let secret = req.body.secret

    let document = await Documents.findOne({
        userid: userid,
        secret: secret
    }).exec()

    if(document == null) {
        return res.status(400).json({
            success: false,
            message: "Document Not Found"
        })
    }

    return res.json({
        success: true,
        message: "Document Found",
        document: document
    });
});