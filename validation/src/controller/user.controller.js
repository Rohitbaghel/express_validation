const express = require('express');

const user = require('../model/user.model');

const { body, validationResult } = require('express-validator');
const { Error } = require('mongoose');

const router = express.Router();


router.get('', async (req, res) => {
try{
 
const users = await user.find().lean().exec()
return res.status(201).send(users)
}
catch(err){
return res.status(500).json({message: err.message, status: "Failed"})
}
    
})

router.post("",body("first_name").isLength({min:4, max:20}).withMessage("first_name should be minimum 4  and not greater than 20 characters"),
body("last_name").isLength({min:2, max:20}).withMessage("first_name should be minimum 2  and not greater than 20 characters"),
body("email").custom(async (value)=>{
const existingEmail = await user.findOne({email: value}).lean().exec();
if(existingEmail){
    throw new Error("please provide a valid email address")
}

return true


}).isEmail().withMessage("please provide a valid email address"),
body("pincode").isLength({min:6, max:6}).withMessage("pincode should be exactly 6 numbers"),
body("age").custom((value) =>{
    if(value < 1 || value >100){
         throw new Error("age should be less than 100 and greater than 1")
    }
    return true
}).withMessage("age should be less than 100 and  greater than 0"),
body("gender").custom((value) =>{
    const [male, female,others] = ["Male","Female","Others"]
    
    if(!male || !female||!others ){
    throw new Error("gender should be either Male, Female or Others")
    }
    return true
})
,async (req, res) => {
    try{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newError =  errors.array().map(({param, value,msg}) =>{
            return {
                [param]:msg
            }
        })
      return res.status(400).json({ errors:newError });
    }
const users = await user.create(req.body)

return res.status(200).json({users})



    }
    catch(err){
        return res.status(500).json({message: err.message, status: "Failed"})  
    }
})


module.exports = router