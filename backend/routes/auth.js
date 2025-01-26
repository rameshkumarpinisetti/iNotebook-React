const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "ramesh221186!@#";

// ROUT 1:  Create a User using: POST "/api/auth/createUser" No Login Required.
router.post('/createuser', [
    body('name', 'Enter Valid Name').isLength({ min: 3 }),
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password should not be less then 5 charecter').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // check whether the user with this email exists already 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry data already exist" })
        }
       const salt = await bcrypt.genSaltSync(10); 
       const secPass = await bcrypt.hash(req.body.password, salt);
        
        // Create New user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET); 
        res.json(authtoken);
        // Catch errors
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Ocured");
    }
});


// ROUT 1:  Authanticat a User using: POST "/api/auth/login" No Login Required.
router.post('/login', [
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'password can not be blank').exists(),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET); 
        res.json(authtoken);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUT 3:  Get Loggedin User Details using: POST "/api/auth/getuser" Login Required.
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router