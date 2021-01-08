const express = require('express');
const Expense = require('../model/Expense');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/expenses', auth, async(req, res) => {
    const expense = new Expense({
        ...req.body,
        owner: req.user._id
    })

    try{
        await expense.save();
        res.status(201).send('Expense added');
    } catch(err){
        res.status(400).send(err);
    }
})

router.get('/expenses', auth, async(req, res) => {
    try{
        const expenses = await Expense.find({owner: req.user._id});

        if(!expenses)
            res.status(404).send('No expense added');
        
        res.send(expenses);
    } catch(err){
        res.status(500).send(err);
    }
})

router.get('/expenses/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try{
        const expense = await Expense.findOne({_id: _id, owner: req.user._id})
        if(!expense)
            res.status(404).send('No such expense found');
        
        res.send(expense);
    } catch(err){
        res.status(500).send(err);
    }
})

router.patch('/expenses/:id', auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'amount'];

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidUpdate){
        res.status(400).send({error: 'Invalid updates'});
    }

    try{
        const expense = await Expense.findOne({_id: _id, owner: req.user._id});

        if(!expense){
            res.status(404).send('No such expense found');
        }

        updates.forEach((update) => {
            expense[update] = req.body[update];
        })

        await expense.save();
        res.send(expense);
    } catch(err){
        res.status(500).send(err);
    }
})

router.delete('/expenses/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try{
        const expense = await Expense.findOneAndDelete({_id: _id, owner: req.user._id});

        if(!expense)
            res.status(404).send('No such expense found');
        
        res.send(expense);
    } catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;