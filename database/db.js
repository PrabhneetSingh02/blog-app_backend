import mongoose from "mongoose";



const Connection = async (username,password) => {
    const URL = `mongodb://${username}:${password}@ac-mgqwctf-shard-00-00.zklwrbt.mongodb.net:27017,ac-mgqwctf-shard-00-01.zklwrbt.mongodb.net:27017,ac-mgqwctf-shard-00-02.zklwrbt.mongodb.net:27017/?ssl=true&replicaSet=atlas-v6ydtc-shard-0&authSource=admin&retryWrites=true&w=majority/`;
    try {

        await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch(error){
        console.log('Error while connecting with Database ', error);
    }
}

export default Connection;
// useNewUrlParser: true