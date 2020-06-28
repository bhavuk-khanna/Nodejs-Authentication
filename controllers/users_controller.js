const User = require('../models/user');
const Token = require('../models/token');
const fs = require('fs');
const path =require('path');
const bcrypt = require('bcryptjs');
const resetPasswordMailer = require('../mailers/reset-password-mailer');
const crypto = require('crypto');
const request = require('request');
const secretKey = '6LeQgqoZAAAAAG_6NOiEolLB9nfW62Vah_1O8i_y';

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){

        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_up',{
        title: "Signup"
    });
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in',{
        title: "Codeial | SignIn"
    })
    
    
    
}


module.exports.profile = function(req,res){
    User.findById(req.user.id, function(err,user){
        return res.render('user_profile',{
            title: "Profile",
            profile_user: user
        });
    })
    
}


//creates a new user
module.exports.create = async function(req, res){
   
    if(req.body.password != req.body.confirm_password){
        req.flash('error', "Password do not match");
        return res.redirect('back');
    }

    try{
        let user = await User.findOne({email: req.body.email});
        if(!user){
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            await User.create({
                email: req.body.email,
                password: hash,
                name: req.body.name
            });

            return res.redirect('/users/signin');
        }else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error craeting a user' + err);
    }
}

//Sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfly');
    return res.redirect('/');
}





//displays the reset password screen if the token is valid
module.exports.updatePassword = async function(req,res){

    try{
        let token = await Token.findOne({token: req.params.id});
        //calculates time passed since token creation in mins
        let timePassed = (new Date() - token.createdAt)/(1000*60);
        // token should be at max 5 mins old
        if(token && token.isValid && timePassed<5){
            return res.render('user-change-password',{id: req.params.id});
        }
        else{
            token.isValid = false;
            token.save();
            return res.render('invalid_token');
        }
    }
    catch(err){
        console.log('Error in displayng the reset password screen'+err);
    }
}

// change password from password reset email

module.exports.changePassword = async function(req,res){
    try{
        let token = await Token.findOne({token: req.params.id});
        //calculates time passed since token creation in mins
        let timePassed = (new Date() - token.createdAt)/(1000*60);
        if(timePassed>5){token.isValid=false;token.save()};
        if(!token || !token.isValid){
            return res.render('invalid_token');
            
        }
        else{
            if(req.body.password != req.body.confirm_password){
                req.flash('error', 'Pasword does not match!');
                return res.redirect('back');
            }            
            let user = await User.findById(token.user);            
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            user.password = hash;
            token.isValid = false;
            user.save();
            token.save();
            req.flash('Success', 'Password updated');
            return res.redirect('/users/signin');
        }
    }
    catch(err){
        console.log('Error'+err);
        req.flash('error','error');
        return res.redirect('back');
    }
}

// update password after login
module.exports.update = async function(req,res){
    try{
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Pasword does not match!');
            return res.redirect('back');
        }
    
        let user = await User.findOne({email: req.user.email});
        if(!user){
            req.flash('error', 'Error in finding the user');
            return res.redirect('back');
        }
        else{
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            
            user.password = hash;
            user.save();
            req.flash('Success', 'Password updated');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('Error', 'Error in updating the password');
        return res.redirect('back');
    }
    
}


//display  forget password screen
module.exports.forgetPassword = function(req,res){
    return res.render('user-forget-password');
}


//finds user by email entered and sends a password reset email
module.exports.reset = async function(req,res){
    try{
    let user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash('error', 'User not found');
            return res.redirect('back');
        }
        else{
            //send password reset email
            let token = await Token.create({
                token: crypto.randomBytes(20).toString('hex'),
                user: user.id,
                isValid: true
            });

            token = await Token.findOne({token: token.token}).populate('user');
             resetPasswordMailer.resetPassword(token);
            req.flash('success', 'Password reset email sent!');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error'+err);
        req.flash('error','error');
        return res.redirect('back');
    }
}



//logout
module.exports.destroySession = function(req,res){    
    req.flash('Success', 'Logged out successfully');
    req.logout();
    return res.redirect('/');
}


// verifies captcha sent by client before submitting the form
module.exports.captcha = function(req,res){
    console.log('we are here!');  
    if(!req.body.captcha){
        console.log("err");
        req.flash('error','invalid capthca');
        return res.json({"success":false, "msg":"Capctha is not checked"});
       
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

    request(verifyUrl,(err,response,body)=>{

        if(err){console.log(err); }

        body = JSON.parse(body);

        if(!body.success && body.success === undefined){
            return res.json({"success":false, "msg":"captcha verification failed"});
        }
        else if(body.score < 0.5){

            return res.json({"success":false, "msg":"you might be a bot, sorry!", "score": body.score});
            
        }
        
            // return json message or continue with your function. Example: loading new page, ect
            req.flash('success','catcha verfied');
            return res.json({"success":true, "msg":"captcha verification passed", "score": body.score});

    })
  
}

