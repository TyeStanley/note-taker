const router = require('express').Router();
const fs = require('fs');
const uniqid = require('uniqid');

// Gets the notes from the db.json file
router.get('/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

router.post('/notes', (req, res) => {
  // Creates a new note with a unique id
  const newNote = {
    id: uniqid(),
    title: req.body.title,
    text: req.body.text
  };

  // Reads the db.json file and adds the new note to the array of notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
    });
  });

  // Sends the new note to the client
  res.json(newNote);
});

router.delete('/notes/:id', (req, res) => {
  // Reads the db.json file and removes the note with the given id
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const isID = (element) => element.id === req.params.id;
    const currentIndex = notes.findIndex(isID);
    notes.splice(currentIndex, 1);

    // Writes the new array of notes to the db.json file
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
    });
    // Sends the updated notes to the client
    res.json(notes);
  });
});

module.exports = router;