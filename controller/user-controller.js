import User from '../model/user.js';
import bcrypt from 'bcrypt';   //for encrypting the password in database. we send salt+ hashedPassword

export const signupUser = async (request, response) => {
    try{
        // const salt = await bcrypt.genSalt();     //old syntax
        const hashedPassword = await bcrypt.hash(request.body.password, 10); //second argument is salt. so need to write genSalt()
        
        const user =  {username: request.body.username, name: request.body.name, password: hashedPassword }

        const newUser = new User(user);     // validated object. we validate using User imported from user.js in which schema is defined.
        try{
            await newUser.save();
        } catch(error){}

        return response.status(200).json({ msg: 'signup successful' });
    } catch(error){
        return response.status(500).json({ msg: 'Error while signup the user'});
    }
}

// export default signupUser;    //written for learning purpose