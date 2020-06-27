
module.exports.home= async function(req,res){
    try{
        
        return res.render('home');

    }
    catch(err){
        console.log('Error',err);
        return;
    }
   
}

