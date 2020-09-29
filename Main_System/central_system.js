const csv = require('csv-parser');
const fs = require('fs');
const builder = require('xmlbuilder');
const axios = require('axios');
const msgpack = require("msgpack");

// Topic 2: Legacy Central System
fs.createReadStream( 'people.csv' )
    .pipe(csv())
    .on( 'data', (row) => {
        console.log("row", row);
        let randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        let newDOB = row.DateOfBirth.replace(/-/g, "").slice(0, 4) +        // DD + MM
        row.DateOfBirth.replace(/-/g, "").slice(-2);                        // YY (last 2 digits)
        let cpr =  newDOB + "-" + randomFourDigitNumber;

        // Build XML Body
        let root = builder.create('Person');
        root.ele('FirstName', row.FirstName);
        root.ele('LastName', row.LastName);
        root.ele('CprNumber', cpr);
        root.ele('Email', row.Email);
        let xmlBody = root.end({ pretty: true});
        console.log(xmlBody);

        const config = {
                headers: {'Content-Type': 'text/xml'}
        };

        // Send a POST request
        axios.post('http://localhost:8080/nemID', xmlBody, config)
        .then( (response) => {
                console.log("NemID:", response.data.nemID);
                let person = {
                        f_name: row.FirstName,
                        l_name: row.LastName,
                        birth_date: row.DateOfBirth,
                        email: row.Email,
                        country: row.Country,
                        phone: row.Phone,
                        address: row.Address,
                        CPR: cpr,
                        NemID: response.data.nemID
                };
                let people = msgpack.pack(person);
                fs.writeFileSync(`msgpack/${cpr}.msgpack`, people);
        })
        .catch((error) => {
                console.log(error);
        });

    });
