const express = require('express');
const router = express.Router();
const database = require('../src/database');
const User = require("../src/User");

router.get('/:id', getSingleUserById);
function getSingleUserById(req, res) {
    const id = parseInt(req.params.id);
    const userCollection = database.getCollection('users');
    const user = userCollection.get(id);
    // kompletter User wird zurückgegeben:
    delete user.meta;
    res.json(user);

    // nur Name und id wird zurückgegeben
    // res.json({
    //     [user.name]: user.$loki
    // })
}

router.get('/', getAllUsers);
function getAllUsers(req, res) {
    const minLegs = req.query.minLegs;
    const color = req.query.color;

    const result = {};
    const userCollection = database.getCollection('users');
    let users;

    if (minLegs === undefined && color === undefined) {
        users = userCollection.find();
    } else if (color === undefined){
        users = userCollection.where((user) => user.legs >= minLegs);
    } else if (minLegs === undefined){
        users = userCollection.where((user) => user.color === color);
    } else {
        users = userCollection.where((user) => user.legs >= minLegs && user.color === color);
    }
    for (let user of users) {
        result[user.$loki] = user.name;
    }
    res.json(result);
}

router.get('/:id/friends', getFriends);
function getFriends(req, res) {
    const id = parseInt(req.params.id);
    const userCollection = database.getCollection('users');
    const user = userCollection.get(id);
    const friends = user.friends;
    res.json(friends);
}

router.post('/:id/friends', addFriends);
function addFriends(req, res) {
    const id = parseInt(req.params.id);
    const newFriend = req.body['name'];

    const userCollection = database.getCollection('users');
    const user = userCollection.get(id);
    user.friends.push(newFriend);
    userCollection.update(user);
    res.json(user);
}



router.post('/', postUser);
function postUser(req, res) {
    const name = req.body.name;
    const legs = req.body.legs;
    const postedUser = new User(name, legs);
    const userCollection = database.getCollection('users');
    userCollection.insert(postedUser);
    res.send('Added user ' + name + ' to database');
}

router.delete('/:id', deleteUser);
function deleteUser(req, res) {
    const id = parseInt(req.params.id);
    const userCollection = database.getCollection('users');
    const user = userCollection.get(id);
    userCollection.remove(user);
    res.send('Deleted user ' + id);
}

router.patch('/:id', patchUser);
function patchUser(req, res) {
    const id = parseInt(req.params.id);
    const userCollection = database.getCollection('users');
    const user = userCollection.get(id);

    const name = req.body.name;
    const legs = req.body.legs;

    if(name !== undefined && legs !== undefined) {
        user.name = name;
        user.legs = legs;
    } else  if (name !== undefined) {
        user.name = name;
    } else {
        user.legs = legs;
    }

    userCollection.update(user);
    res.json(user);
}

module.exports = router;