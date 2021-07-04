const express = require('express');
const router = express.Router();
const database = require('../src/database');
const Axios = require('axios');


router.get('/sum-legs', sumLegs);
// direct access to user-database
function sumLegs(req, res) {
    const userCollection = database.getCollection('users');
    const allUsers = userCollection.find();

    const result = {};
    let users = 0;
    let sum_legs = 0;
    for (let user of allUsers){
        result['users'] = ++users;
        result['sum_legs'] = sum_legs += user.legs;
        result['avg_legs'] = sum_legs / users;
    }
    res.json(result);
}

//7.
router.get('/sum-legs/:color', sumLegsColor);
// direct access to user-database
function sumLegsColor(req, res) {
    const userCollection = database.getCollection('users');
    const allUsers = userCollection.where(user => user.color === req.params.color);

    const result = {};
    let users = 0;
    let sum_legs = 0;
    for (let user of allUsers){
        result['users'] = ++users;
        result['sum_legs'] = sum_legs += user.legs;
        result['avg_legs'] = sum_legs / users;
    }
    res.json(result);
}


//fixme: über axios ?

// async function sumLegs(req, res) {
//     const allUsers = await Axios.get('http://localhost:3000/users');
//     // const result = {};
//     // let users = 0;
//     // let sum_legs = 0;
//     // for (let user of allUsers){
//     //     result['users'] = ++users;
//     //     result['sum_legs'] = sum_legs += user.legs;
//     //     result['avg_legs'] = sum_legs / users;
//     // }
//
//     console.log('allUsers');
//     res.json(allUsers.data);
//
// }


module.exports = router;