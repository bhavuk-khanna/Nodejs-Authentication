# Nodejs-Authentication

## Overview

This is a complete authentication system which can be used as a starter code for creating any
new application

The functionalities include:
1. Sign up with email
2. Sign in 
3. Sign out
4. Update password after login
5. Google login/signup
6. Forgot password: token based valid for 5 mins
7. Google reCaptcha v3 verification
8. Flash notifications


## Using the project
1. Download as zip and extract at your system
2. Open folder in VS code
3. Open terminal and make the project folder as your current directory
4. Install all the dependencies as mentioned in the package.json :
```
npm install <dependency name>
```
5. Configure google authetication by adding **client id** and **client secret** in the`config\passport-google-oauth2-stratergy.js` file
   - To configure your own clinet id and secret, please refer: [Google developer docs](https://developers.google.com/adwords/api/docs/guides/authentication#create_a_client_id_and_client_secret).
6. Configure mailer:
   - Add **username** and **password** for the email address being used for sending the email in the`config->nodemailer.js` file  
   - Add the from email address in `config->nodemailer.js`
7. Configure captcha:
   - To configure your own keys, please refer: [google reCAPTCHA](https://www.google.com/recaptcha/admin/create).
   - Add the captcha **site key** in the   `assets\js\signin.js and signup.js`
   - Add the captcha **secret key** in the `controllers\users_controller.js` in the *secret key const*

8.  `npm start`

9. Have Fun!! 👍 :beer:



 