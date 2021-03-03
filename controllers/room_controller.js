const roomService = require('../services/room_service');
const hotelService = require('../services/hotel_service');
const userService = require('../services/user_service')
const express = require('express');
const router = express.Router();
const Role = require('../helpers/role');
const authorize = require('../helpers/authorize')


/**
 * @swagger
 * /rooms/{hotelId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Retrieve a list of rooms for a hotel
 *     description: Retrieve a list of rooms for a hotel
 *     parameters:
 *      - in: path
 *        name: hotelId
 *        type: string
 *        required: true
 *        description: ID of hotel to get rooms from.
 *     responses:
 *       200:
 *         description: A list of rooms for a hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       available:
 *                         type: boolean
 *                         description: Room availability
 *                         example: false
 *                       number:
 *                         type: number
 *                         description: Room number
 *                         example: 123
 *                       hotelName:
 *                         type: string
 *                         description: The name og hotel
 *                         example: SwagHotel
 */
router.get('/:hotelId', authorize(), getAvailableRoomsByHotelId);


/**
 * @swagger
 * /rooms/{currentUserId}/{roomId}:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Book Room
 *     description: Book Room.
 *     parameters:
 *      - in: path
 *        name: currentUserId
 *        type: string
 *        required: true
 *        description: ID of current user
 *      - in: path
 *        name: roomId
 *        type: string
 *        required: true
 *        description: ID of hotel to add room.
 *     responses:
 *       201:
 *         description: Room booked.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The users name.
 *                   example: Jacob
 *                 role:
 *                   type: string
 *                   description: The users role.
 *                   example: User
 *                 hashedPassword:
 *                   type: string
 *                   description: The users hashed password.
 *                   example: XxsecretxX
 *                 reservations:
 *                   type: array
 *                   description: The users reservations.
 *                   example: []
 */
router.post('/:currentUserId/:roomId', authorize(Role.User), bookRoom);

module.exports = router;

async function getAvailableRoomsByHotelId(req, res, next) {
    hotelService.getHotelById(req.params.hotelId)
    .then(hotel => {
        if (hotel.rooms === undefined || hotel.rooms.length == 0) {
            return res.status(400).json({message: "No rooms"});
        }
        roomService.getRoomsByHotelId(hotel.id)
        .then(rooms => res.json(rooms))
        .catch(err => next(err))
    })
}

async function bookRoom(req, res, next) {
    roomService.getRoomById(req.params.roomId)
    .then(room => {
        if (!room.available) {
            return res.status(400).json({message: "Room not available"});
        }
        roomService.updateRoomAvailability(room.id, req.params.currentUserId) // , req.params.currentUserId
            .then(roomUpdated => {
                userService.addReservation(req.params.currentUserId, roomUpdated)
                .then(roomUpdated => res.json(roomUpdated))
                .catch(err => next(err))
            })
            .catch(err => next(err))
    })
}