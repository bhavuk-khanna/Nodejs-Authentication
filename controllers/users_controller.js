const User = require('../models/user');
const fs = require('fs');
const path =require('path');
const bcrypt = require('bcryptjs');
const { Console } = require('console');
module.exports.users = function(req,res){
    res.render('users',{
        title: "users"
    });
}

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


//get the sign up data
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

module.exports.destroySession = function(req,res){
    req.logout();
     req.flash('success', 'You have logged out!');
    return res.redirect('/');
}



