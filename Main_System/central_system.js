const csv = require('csv-parser');
const fs = require('fs');
const builder = require('xmlbuilder');

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
        let xml = root.end({ pretty: true});
        console.log(xml);
    })
    .on( 'end', () => {

        // console.log(people);
        // res.json({
        //     status: 200,
        //     people
        // });
    });
