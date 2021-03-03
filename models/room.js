const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = Schema({
  number: { 
    type: Number, 
    required: true 
  },
  hotelName: { 
    type: String, 
    required: true 
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  hotelId: { 
    type: String
  }
});

const Room = mongoose.model('Room',RoomSchema);

module.exports = Room;
