const csv = require('csv-parser');
const fs = require('fs');
const builder = require('xmlbuilder');
const axios = require('axios');
const msgpack = require("msgpack");

let people = [];
let cpr;
fs.createReadStream( 'people.csv' )
    .pipe(csv())
    .on( 'data', (row) => {
        // console.log(row);
        // console.log(JSON.stringify(row));
        people.push(row);
        console.log("row", row);
        let randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        let newDOB = row.DateOfBirth.replace(/-/g, "").slice(0, 4) +        // DD + MM
        row.DateOfBirth.replace(/-/g, "").slice(-2);                        // YY (last 2 digits)
        cpr =  newDOB + "-" + randomFourDigitNumber;

        // let xml = builder.create('Person')
        //     .ele('FirstName', row.FirstName)
        //     .ele('LastName', row.LastName)
        //     .ele('CprNumber', cpr)
        //     .ele('Email', row.Email).end({ pretty: true});

        let root = builder.create('Person');
        root.ele('FirstName', row.FirstName);
        root.ele('LastName', row.LastName);
        root.ele('CprNumber', cpr);
        root.ele('Email', row.Email);
        let xmlBody = root.end({ pretty: true});
        console.log(xmlBody);

        axios.post('http://localhost:8080/nemID ', xmlBody)
        .then((response) => {
                console.log(response.nemID);
        })
        .catch((error) => {
                console.log(error);
        });

        // let movies = msgpack.pack(body);
        // fs.writeFileSync("movies.msgpack", movies);
        // function readMsgFile() {
        //     let data = fs.readFileSync('movies.msgpack');
        //     let movies = msgpack.unpack(data);
        //     console.log("Read:", movies);
        // }

    })
    .on( 'end', () => {

        // console.log(people);
        // res.json({
        //     status: 200,
        //     people
        // });
    });
