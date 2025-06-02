const { default: mongoose } = require('mongoose')

require('dotenv').config()


module.exports = async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('connected succsesfully')
    }catch(e){
        console.log('coudnot conncet to db')
    }
}