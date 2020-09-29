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
    let sql = `SELECT * FROM user`;
    // TODO:
    // check last 4 digits of cpr from one of the database to match with nemIdCode from the request body
    // check that on of the nemId from the database matches the one from the request body
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.log(err);
        }
        rows.forEach((row) => {
            console.log("User:", row);
            console.log("CPR:", row.CPR);
            console.log("NemIdCode:", row.CPR.slice(-4));
            console.log("NemId:", row.NemID);
            // if (nemIdCode === row.CPR && nemId === row.NemID) {
            //
            // }
        });
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
