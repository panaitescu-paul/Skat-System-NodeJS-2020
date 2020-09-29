const express = require('express');
const sqlite3 = require('sqlite3');
const PORT = 8090;
let app = express();

app.use(express.json());

let db = new sqlite3.Database('../NemID_ESB/nem_id_database.sqlite', (err) => {
    if(err) {
        console.log("Database connection failed");
        return console.log(err.message);
    }
    console.log("Connected to database!")
});

app.post("/nemid-auth", (req, res) => {
    console.log("Body: ", req.body);
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
            console.log("NemIdCode:", row.CPR.slice(-4));
            console.log("NemId:", row.NemID);
            if (nemIdCode === row.CPR.slice(-4) && nemId === row.NemID) {
                userFound = true;
            }
        });

        if (userFound) {
            // generate random 6 digits
            randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
            console.log("Random number: ", randomSixDigitNumber);
            res.json({
                status: 200,
                message: 'Successful!',
                generatedCode: randomSixDigitNumber
            });
        } else {
            res.json({
                status: 403,
                message: 'Forbidden!'
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
