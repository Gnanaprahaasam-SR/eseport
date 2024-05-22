const bcrypt = require("bcrypt");

const hashData = async (data) =>{
    try{       
        const hashedData = await bcrypt.hash(data, 10);
        // console.log(hashedData);
        return hashedData;
    } catch(error){
        
        console.log(error);
        throw error;
    }
};

const verifyHashedData = async (unhashed, hashed) =>{
    try{
        const match =  await bcrypt.compare(unhashed, hashed);
        return match;
    }catch (error){
        throw error;
    }
};

module.exports =  {hashData, verifyHashedData};