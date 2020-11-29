const express = require('express');
const User = require('../model/User');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user: user, token: token});
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user: user, token: token});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/users/me', auth, (req, res) => {
    res.send(req.user);
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidUpdate){
        return res.status(400).send({error : 'Invalid Update'});
    }

   try {
        updates.forEach((update) => {
            req.user[update] = req.body[updates];
        })

        await req.user.save();
        res.send(req.user);
   } catch (err) {
       res.status(500).send(err);
   }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;