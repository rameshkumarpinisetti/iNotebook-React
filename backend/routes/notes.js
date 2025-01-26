const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUT 1:  Get All The Notes Using : GET "/api/auth/createUser" Login Required.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Ocured");
    }
})


// ROUT 2:  Add new Notes Using : POST "/api/auth/createUser" Login Required.
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 charecter').isLength({ min: 5 })], async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save()
            res.json(saveNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Error Ocured");
        }
    })


// ROUT 3:  Update a existing Notes Using : PUT "/api/auth/updatenote" Login Required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    // Create newNote Object
    const newNote = {}
    if (title) { newNote.title = title }
    if (title) { newNote.description = description }
    if (title) { newNote.tag = tag }

    //FInd the Note to be Updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowd");
    }
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note })
})


// ROUT 4:  Delete a existing Notes Using : Delete "/api/auth/deletnote" Login Required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    // const { title, description, tag } = req.body;
    
    //FInd the Note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowd");
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ "Success":"Note hasbeen deleted", note:note })
})

module.exports = router