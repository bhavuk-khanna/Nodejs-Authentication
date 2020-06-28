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
8. flash notifications


## Using the project
1. Download as zip and extract at your system
2. Open folder in VS code
3. Open terminal and make the project folder as your current directory
4. Install all the dependencies as mentioned in the package.json :
```
npm install <dependency name>
```
5. Configure google authetication by adding client id and client secret in the`config->passport-google-oauth2-stratergy.js` file
   -To Configure your own clinet id and secret, please refer: [Google developer docs](https://developers.google.com/adwords/api/docs/guides/authentication#create_a_client_id_and_client_secret).
6. Go to https://localhost/8000 on your browser to use the application
7. Have Fun!! 👍



 