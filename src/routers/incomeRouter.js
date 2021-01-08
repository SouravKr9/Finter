const express = require('express');
const Income = require('../model/Income');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/incomes', auth, async(req, res) => {
    const income = new Income({
        ...req.body,
        owner: req.user._id
    })

    try{
        await income.save();
        res.status(200).send('Income added');
    } catch(err){
        res.status(400).send('Whoops!!! something went wrong');
    }
})

router.get('/incomes', auth, async(req, res) => {
    try{
        const incomes = await Income.find({owner: req.user._id});
        //console.log(incomes);

        if(!incomes){
            res.status(404).send('No income found');
        }

        res.send(incomes);
    } catch(err){
        res.status(500).send('Whoops!!! something went wrong');
    }
})

router.get('/incomes/:id', auth, async(req, res) => {
    const _id = req.params.id;
    
    try{
        const income = await Income.findOne({_id: _id, owner: req.user._id});

        if(!income){
            res.status(404).send('No income found');
        }

        res.send(income);
    } catch(err){
        res.staus(500).send('Whoops!!! something went wrong');
    }
})

router.patch('/incomes/:id', auth, async(req, res) => {
    const _id = req.params.id;
    const allowedUpdates = ['title', 'amount'];
    const updates = Object.keys(req.body);

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidUpdate){
        res.staus(400).send('Invalid update');
    }

    try{
        const income = await Income.findOne({_id: _id, owner: req.user._id});

        if(!income){
            res.status(404).send('No such income found');
        }

        updates.forEach((update) => {
            income[update] = req.body[update];
        })

        await income.save();
        res.send(income);
        
    } catch(err){
        res.status(500).send('Whoops!!! something went wrong');
    }

})

router.delete('/incomes/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try{
        const income = await Income.findOneAndDelete({_id: _id, owner: req.user._id});

        if(!income){
            req.staus(404).send('No such income found');
        }

        res.send(income);
    } catch(err){
        res.staus(500).send('Whoops!!! something went wrong');
    }
})

module.exports = router;