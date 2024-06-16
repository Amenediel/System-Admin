const express = require('express');
const router = express.Router();
const Patient = require('../models/patients');
const Therapist = require('../models/therapists');
const multer = require('multer');
const fs = require('fs');

//Image upload
let storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './assets/images');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

let upload = multer({
    storage: storage,
}).single('image');

//Insert the users into the DB
router.post('/add',upload,async (req, res) => {
    const patient = new Patient({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        diagnosis: req.body.diagnosis,
        therapist: req.body.therapist,
        plan: req.body.plan,
        status: req.body.status,
        image: req.file.filename,
    });
    try {
        await patient.save();
        
            req.session.message = {
                type: 'success',
                message: 'Patient added successfully'
            };
            req.session.save(() => {
                res.redirect('/');
            });
        }
    catch (err) {
            res.json({ message: err.message, type: 'danger' });
        }
    });

//Get all the users
router.get('/', async (req, res) => {
    let {message} = req.session;
    req.session.message = null;
    try {
        const patients = await Patient.find({});
        res.render('index', {
            title: "Home Page", 
            patients: patients, 
            message: message
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get('/add', (req, res) => {
    res.render('add_users', {title: "Add Users"});
});

//edit user
router.get('/edit/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if(patient == null){
            res.redirect('/');
        } else {
            res.render('edit_users', {
                title: "Edit Users",
                patient: patient
            });
        }
    } catch (err) {
        res.redirect();
    }
});

router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id; // Corrected this line
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./assets/images/'+req.body.old_image);
        } catch(err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await Patient.findByIdAndUpdate(id, {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            diagnosis: req.body.diagnosis,
            therapist: req.body.therapist,
            plan: req.body.plan,
            status: req.body.status,
            image: new_image,
        });
        
        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const result = await Patient.findByIdAndDelete(id);
        if(result && result.image != ''){
            fs.unlinkSync('./assets/images/'+result.image);
        }
        req.session.message = {
            type: 'info',
            message: 'User deleted successfully',
        };
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.json({message: err.message});
    }
});


module.exports = router;