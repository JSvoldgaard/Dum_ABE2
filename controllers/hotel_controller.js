const hotelService = require('../services/hotel_service');
// const userService = require('../services/user_service');
const Role = require('../helpers/role');
const express = require('express');
const router = express.Router();
const authorize = require('../helpers/authorize')


/**
 * @swagger
 * /hotels/{hotelId}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Retrieve the list of hotels
 *     description: Retrieve a list of hotels.
 *     parameters:
 *      - in: path
 *        name: hotelId
 *        type: string
 *        required: true
 *        description: ID of hotel to get.
 *     responses:
 *       200:
 *         description: A list of hotels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The users name.
 *                   example: Jacob
 *                 country:
 *                   type: string
 *                   description: The users hashed password.
 *                   example: Denmark
 *                 managerId:
 *                   type: string
 *                   description: The users role.
 *                   example: 123X456x
 *                 rooms:
 *                   type: array
 *                   description: The users reservations.
 *                   example: []
 */
router.get('/:hotelId', authorize(), getHotelById);

/**
 * @swagger
 * /hotels/{currentUserId}/addHotel:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add Hotel
 *     description: Add Hotel.
 *     parameters:
 *      - in: path
 *        name: currentUserId
 *        type: string
 *        required: true
 *        description: ID of current user
 *     requestBody:
 *       description: request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hotel Added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The users name.
 *                   example: Hotel name
 *                 country:
 *                   type: string
 *                   description: The users hashed password.
 *                   example: Denmark
 *                 managerId:
 *                   type: string
 *                   description: The users role.
 *                   example: 123X456x
 *                 rooms:
 *                   type: array
 *                   description: The users reservations.
 *                   example: []
 */
router.post('/:currentUserId/addHotel',authorize(Role.Manager), createHotel)


/**
 * @swagger
 * /hotels/{currentUserId}/{hotelId}/addRoom:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Add Room
 *     description: Add Room.
 *     parameters:
 *      - in: path
 *        name: currentUserId
 *        type: string
 *        required: true
 *        description: ID of current user
 *      - in: path
 *        name: hotelId
 *        type: string
 *        required: true
 *        description: ID of hotel to add room.
 *     requestBody:
 *       description: request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: number
 *     responses:
 *       201:
 *         description: Room Added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: bool
 *                   description: roomavailablity.
 *                   example: true
 *                 number:
 *                   type: number
 *                   description: RoomNumber.
 *                   example: 1
 *                 hotelName:
 *                   type: string
 *                   description: Name of hotel.
 *                   example: Hotel motel
 *                 hotelId:
 *                   type: string
 *                   description: Hotel identifier.
 *                   example: 12345678
 */
router.post('/:currentUserId/:hotelId/addRoom', authorize(Role.Manager), createRoom)
// router.get('/:hotelId/rooms', getAvailableRoomsByHotelId)

module.exports = router;


async function createHotel(req, res, next) {
    hotelService.addHotel(req.body.name, req.body.country, req.params.currentUserId)
    .then(hotel => res.json(hotel))
    .catch(err => next(err))
} 

async function getHotelById(req, res, next) {
    hotelService.getHotelById(req.params.hotelId)
    .then(hotel => res.json(hotel))
    .catch(err => next(err))
}

async function createRoom(req, res, next) {
    hotelService.getHotelById(req.params.hotelId)
        .then(hotel => {
            if(hotel.managerId != req.params.currentUserId){
                return res.status(401).json({message: 'Unauthorized'});
            }
            hotelService.addRoom(req.body.number, hotel.name, req.params.hotelId)
            .then(room => res.json(room))
            .catch(err => next(err))
            // hotelService.updateHotelRooms(hotel.id, room)
        })
}