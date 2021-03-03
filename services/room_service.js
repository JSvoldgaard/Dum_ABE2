const HotelsColl = require('../models/hotel');
const RoomsColl = require('../models/room');
const UsersColl = require('../models/user');
const mongoose = require('mongoose');

const Role = require("../helpers/role")

module.exports = {
    getRoomById,
    getRoomsByHotelId,
    updateRoomAvailability
}

async function getRoomById(roomId) {
    const room = await RoomsColl.findById(roomId)
    return room
}

async function updateRoomAvailability(roomId,) { //userId
    const room = await RoomsColl.findByIdAndUpdate(roomId, {
        available: false
    });

    const persistedRoom = await room.save();

    // let user = await UsersColl.findByIdAndUpdate(userId, {
    //     role: Role.Guest,
    
    //     $push: {"reservations": {number: persistedRoom.number, hotelName: persistedRoom.hotelName}}},
    //     {safe: true, upsert: true, new : true}
    // )
    // const persistedUser = await user.save();

    return room;
}

async function getRoomsByHotelId(hotelId) {
    const hotel = await HotelsColl.findById(hotelId)
    return hotel.rooms
}