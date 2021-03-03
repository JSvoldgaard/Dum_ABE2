const HotelsColl = require('../models/hotel');
const RoomsColl = require('../models/room')
const mongoose = require('mongoose');

module.exports = {
    addHotel,
    getHotelById,
    addRoom,
    updateHotelRooms
};

async function getHotelById(id) {
    const hotel = await HotelsColl.findById(id);
    return hotel;
}

async function addHotel(name, country, managerId) {
    const hotel = new HotelsColl({
        name: name,
        country:country,
        managerId: managerId
    });

    const persistedHotel = await hotel.save();

    if (!persistedHotel) {
        return;
    }
    else{
        return hotel;
    }   
}

async function addRoom(number, hotelName, hotelId) {
    const room = new RoomsColl({
        number: number,
        hotelName: hotelName,
        hotelId: hotelId
    });

    const persistedRoom = await room.save();

    if (!persistedRoom) {
        return;
    }
    else{
        let hotel = await HotelsColl.findByIdAndUpdate(hotelId, 
            // hotel.rooms.push(room))
    
            {$push: {"rooms": {number: room.number, hotelName: room.hotelName}}},
            {safe: true, upsert: true, new : true}
        )
        const persistedHotel = await hotel.save();
        return room;
    }
}

async function updateHotelRooms(hotelId, room) {
    let hotel = await HotelsColl.findByIdAndUpdate(hotelId, 
        // hotel.rooms.push(room))

        {$push: {"rooms": {number: room.number, hotelName: room.hotelName}}},
        {safe: true, upsert: true, new : true},
        // function(err, hotel) {
        //     console.log(err)
        // }
        )

        const persistedHotel = await hotel.save();

        // if (!persistedHotel) {
        //     return;
        // }
        // else{
        //     return hotel;
        // } 
}