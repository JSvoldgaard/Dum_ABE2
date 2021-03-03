const userService = require('../services/user_service')
const Role = require('../helpers/role');
const express = require('express');
const router = express.Router();
const authorize = require('../helpers/authorize')

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register user
 *     description: Register user
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
 *               password:
 *                 type: string
*               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered .
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
 */
router.post('/',registerUser) 

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Login user
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login.
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
 *                 token:
 *                   type: string
 *                   description: The users token.
 *                   example: XxsecretxX
 */
router.post('/login', login)

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Retrieve the list of users
 *     description: Retrieve a list of users.
 *     responses:
 *       200:
 *         description: A list of users.
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
 *                       role:
 *                         type: string
 *                         description: The users role.
 *                         example: User
 *                       name:
 *                         type: string
 *                         description: The users name.
 *                         example: Jacob
 *                       hashedPassword:
 *                         type: string
 *                         description: The users hashed password.
 *                         example: 123x456xx
 *                       reservations:
 *                         type: array
 *                         description: The users reservations.
 *                         example: []
 */
router.get('/', authorize(Role.Admin), getUsers) //authorize(Role.Admin),


router.get('/:currentUserId/:userId',authorize(Role.Admin), getUserById)
router.post('/upgrade/:currentUserId/:userId', authorize(Role.Admin), upgradeUser)

module.exports = router;

function login(req,res,next){
    userService.login(req.body.name,req.body.password)
    .then(result=> {
        res.json(result)
    })
    .catch(err => next(err))
}

function registerUser(req, res, next){
    let role = req.body.role ? req.body.role : Role.User
    userService.registerUser(req.body.name,req.body.password, role)
    .then(user => res.json(user))
    .catch(err => next(err))
}

function getUsers (req, res, next){
    userService.getUsers()
        .then(users => res.json(users))
        .catch(err => next(err))
}

async function getUserById (req, res, next) {
    userService.getById(req.params.currentUserId)
        .then(user => {
            userService.getById(req.params.userId)
            .then(user =>  res.json(user))
            .catch(err => next(err))
        })  
        .catch(err => next(err))
}

async function upgradeUser (req, res, next){
    userService.getById(req.params.currentUserId)
        .then(user => {
            userService.getById(req.params.userId)
            .then(user =>  {
                userService.upgradeToManager(user.id)
                .then(user => res.json(user))
                .catch(err => next(err))
            })
            .catch(err => next(err))
        })  
        .catch(err => next(err))
}

async function addReservation(id, roomNumber, hotelName){
    userService
}