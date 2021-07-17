const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3001;
const path = require("path");
const { json } = require('express');


// routing to css and js files from dir public
app.use(express.static(path.join(__dirname, "public")));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routing to notes.html
app.get('/notes', (req, res) => {
  res.sendFile('notes.html', {
    root: "public"
  });
});

// routing to db.json and read the file
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'));
}); 

// routing to index.html
app.get('/', (req, res) => {
  res.sendFile("index.html");
});

// app.get('/api/notes', (req, res) => {
//   return res.send([1, 2, 3])
  
// });

// receive new notes and save it to the body 
//add to db.json and pass it to the user upon request
app.post('/api/notes', (req, res) => {

  // // Defining new note
  // newNote = {
  //   title: "value", 
  //   note: "value",
  //   id: Date.now()
  // }
  let newNote = req.body;
  // let id = Date.now();
  let notes = JSON.parse(fs.readFileSync("./db/db.json"));
  let notesLen = (notes.length).toString();

  // create a unique id
  newNote.id = notesLen;

  // STEP 2: Adding new data to users object
  notes.push(newNote);

  // STEP 3: Writing to a file
  fs.writeFile("./db/db.json", JSON.stringify(notes), err => {

      // Checking for errors
      if (err) {throw err;
      }
      else {
        res.json(notes)
     
      console.log("Done writing"); // Success
      }
  });
})

// Deleting the notes
app.delete('/api/notes/:id', (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json"));
  let notesId = (req.params.id).toString();

// look for notes that dont have matched ids, if ids not match and they have unique id save as an array
  notes = notes.filter(unique => {
    return unique.id != notes
  })

  // update the notes to the db.json
  fs.writeFile("./db/db.json", JSON.stringify(notes), err => {

    // Checking for errors
    if (err) {throw err;
    }
    else {
      res.json(notes)
   
    console.log("Done deleting and updating"); // Success
    }
});
});

// Listener
// ===========================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT http://localhost:${PORT}`);
});