// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// create note
app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }

        const noteArray = JSON.parse(data);

        //creates new note object to enter into json file
        const newNote = {
            id: noteArray.length + 1,
            title: req.body.title,
            text: req.body.text
        };

        //pushes new note into note array
        noteArray.push(newNote);

        res.json(newNote);

        //updates db.json
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(noteArray, null, 2), function (err) {
            if (err) throw err;
        });
    });
});


// Delete note
app.delete("/api/notes/:id", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }

        const noteArray = JSON.parse(data);

        //removes note from array at index of id - 1 passed in the url
        noteArray.splice(req.params.id - 1, 1);

        //updates note IDs
        for (let i = 0; i < noteArray.length; i++) {
            noteArray[i].id = i + 1;
        };

        res.json(noteArray);

        //updates db.json
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(noteArray, null, 2), function (err) {
            if (err) throw err;
        });
    });
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});