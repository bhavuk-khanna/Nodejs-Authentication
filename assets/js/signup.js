console.log('script is loaded');
//sends a fetch request to server to verify captcha before submitting the form 
let onSubmit = async function (e){
    e.preventDefault();
    
    let token = await grecaptcha.execute('6LeQgqoZAAAAAIZG3GChwyuvOP1b0dMdw2mYZd1s', {action: 'homepage'})
    const captcha = token;
    console.log(captcha);
    let response = await fetch('/users/captcha',{
            method: 'POST',
            headers:{
                    'Accept': 'application/json, text/plain, */*',
                     'Content-Type': 'application/json'
            
        },
        body:JSON.stringify({captcha:captcha})
        });
    let data = await response.json();
    
    if(data.success)
         document.getElementById('create-user-form').submit();
    else
        alert("Captcha failed, please try again" );

    
}
document.getElementById('create-user-form').addEventListener('submit',onSubmit);
    
    