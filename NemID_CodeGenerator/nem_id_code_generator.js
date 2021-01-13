const express = require('express');
const sqlite3 = require('sqlite3');
const PORT = 8090;
let app = express();

app.use(express.json());

// Topic 6. NemID Code Generator
let db = new sqlite3.Database('../NemID_ESB/nem_id_database.sqlite', (err) => {
    if(err) {
        console.log("Database connection failed");
        return console.log(err.message);
    }
    console.log("Connected to database!")
});

app.post("/nemid-auth", (req, res) => {
    console.log("Body:", req.body);
    let nemIdCode = req.body.nemIdCode;
    let nemId = req.body.nemId;
    let randomSixDigitNumber;
    let sql = `SELECT * FROM user`;
    let userFound = false;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.log(err);
        }
        rows.forEach((row) => {
            console.log("User:", row);
            console.log("NemIdCode:", row.Password);
            console.log("NemId:", row.NemID);
            if (nemIdCode === row.Password && nemId === row.NemID) {
                userFound = true;
            }
        });

        if (userFound) {
            // generate random 6 digits
            randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
            console.log("Random number: ", randomSixDigitNumber);
            res.status(200).json({
                message: "Successful!",
                generatedCode: randomSixDigitNumber
            });
        } else {
            res.status(403).json({
                message: "Forbidden!"
            });
        }
    });
});

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(`Listening on port ${PORT}`);
    }
});
