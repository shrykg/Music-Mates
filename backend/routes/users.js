import { Router } from 'express';
export const router = Router();

import { users } from "../config/mongoCollection.js";
import * as userData from '../data/users.js'
import bcryptjs from 'bcryptjs';
import xss from 'xss';
router.post("/signUpUser", async (req,res) => {
        try{
            console.log("sign up route")
            let details = req.body;
            let name = details.name;
            let email = details.email;
            let password = details.password;
            const addedUser = await userData.signUpUser(name, email, password)
            console.log(addedUser)
            return res.status(200).json(addedUser);
        }
        catch (e) {
            res.status(500).json({ error: e });
          }
    }
    )

router.post("/signup", async (req, res) => {
    let input = req.body;
    let name = input.name;
    let email = input.email;

    // Check if the user already exists
    try {
      
        const existingUser = await userData.getUserByEmail(email);
        console.log("Existing user:",existingUser);
        if (existingUser) {
            // User already exists, redirect to the frontend dashboard
            
            return res.status(409).json({ message: "User already exists. Redirecting to dashboard." });
        }
    } catch (error) {
        // Handle errors that might occur during fetching the user
        return res.status(500).json({ error: "Internal server error while checking user existence." });
    }

    // If user does not exist, proceed with creating a new user
    try {
      console.log(email);
        const newUser = await userData.createUser(xss(name), xss(email));
        req.session.user = {...req.session.user, _id: newUser._id.toString()};
        console.log(req.session.user);
        return res.status(200).json({_id: newUser._id, name: newUser.name, email: newUser.email});gi 
    } catch (e) {
        return res.status(e[0]).json({error:e[1]});
    }
});
router.get('/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                // handle error case here
                res.status(500).send('Error while logging out');
            } else {
                res.send('Logged out');
            }
        });
    } else {
        res.send('No session to log out');
    }
});


export default router;
