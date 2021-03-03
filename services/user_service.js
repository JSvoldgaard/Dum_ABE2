const UsersColl = require('../models/user');
const mongoose = require('mongoose');
const Role = require("../helpers/role");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = {
    registerUser,
    getUsers,
    getById,
    upgradeToManager,
    login,
    addReservation
};

async function login(name,password) {
    const user = await UsersColl.findOne({name: name});
    if(user){
        // const { hashedPassword, ...userWithoutPassword } = user;
        const validPassword = await bcrypt.compare(password,user.hashedPassword)
        const token = jwt.sign({ sub: user.name, role: user.role }, process.env.JWT_SECRET);
        const modified ={
            id: user._id,
            name: user.name,
            role: user.role,
            token: token
        }
        if(validPassword){
            return modified 
        }
        else
        {
            return;
        }
    }
    else{
        return;
    };
}

async function registerUser(name,password,role) {

    const salt = await bcrypt.genSalt(10);
    let hashedPW = await bcrypt.hash(password, salt)

    let user = new UsersColl({
        name: name,
        hashedPassword: hashedPW,
        role: role,
    });  

    const persistedUser = await user.save();

    if (!persistedUser) {
        return;
    }
    else{
        return user;
    }
}

async function getUsers() {
    const users = await UsersColl.find({})
    return users
    // .map(u => {
    //     // const { password, ...userWithoutPassword } = u;
    //     return userWithoutPassword;
    // });
};

async function getById(id) {
    const user = await UsersColl.findById(id);
    return user;
};

async function upgradeToManager(id){
    let user = await UsersColl.findByIdAndUpdate(id,{
        role: Role.Manager
    })
};

async function addReservation(id,rooms){
    const roomUpdate = await UsersColl.findByIdAndUpdate(id,{role:"Guest",reservations:rooms})
    if (!roomUpdate) {
        return;
    }
    else{
        return roomUpdate;
    }
}