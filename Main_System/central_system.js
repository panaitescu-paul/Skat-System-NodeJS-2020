const csv = require('csv-parser');
const fs = require('fs');

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
        row.DateOfBirth.replace(/-/g, "").slice(-2)                         // YY (last 2 digits)
        cpr =  newDOB + "-" + randomFourDigitNumber;
    })
    .on( 'end', () => {

        // console.log(people);
        // res.json({
        //     status: 200,
        //     people
        // });
    });

