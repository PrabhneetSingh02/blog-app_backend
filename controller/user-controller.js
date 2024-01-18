import bcrypt from 'bcrypt';   //for encrypting the password in database. we send salt+ hashedPassword
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../model/user.js';
import Token from '../model/token.js';

dotenv.config();

export const signupUser = async (request, response) => {
    try{
        // const salt = await bcrypt.genSalt();     //old syntax
        const hashedPassword = await bcrypt.hash(request.body.password, 10); //second argument is salt. so need to write genSalt()
        
        const user =  {username: request.body.username, name: request.body.name, password: hashedPassword }

        const newUser = await User.create(user);   // validated object. we validate using User imported from user.js in which schema is defined.
        if(!newUser){
            throw '500 internal server error';
        }

        return response.status(200).json({ msg: 'signup successful' });
    } catch(error){
        return response.status(500).json({ msg: 'Error while signup the user'});
    }
}
// export default signupUser;    //written for learning purpose

export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if(!user){
        return response.status(400).json({ msg: 'Username doesnot match' });
    }

    try{
        let match = await bcrypt.compare(request.body.password, user.password);
        if(match){
            // if match, then generate access token and refresh token 
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);

            const newToken = new Token({ token: refreshToken });
            
            try{ await newToken.save();}
            catch(error){}
            return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, username: user.username })

        } else{
            return response.status(400).json({ msg: 'Password doesnot match' });
        }
    } catch(error){
        return response.status(500).json({ msg: 'Error while login'});
    }
}