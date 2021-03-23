const { Room } = require("../models/room");
const { RoomTC } = require("../models/room");


// RoomTC.addResolver({

// })

const RoomQuery = {
    RoomMany: RoomTC.getResolver("findMany"),
    RoomById: RoomTC.getResolver("findById")
};

module.exports = { RoomQuery: RoomQuery };