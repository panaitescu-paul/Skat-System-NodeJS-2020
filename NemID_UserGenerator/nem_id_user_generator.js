const express = require('express');
const PORT = 8088;
let app = express();

app.use(express.json());

// Topic 4: NemID User Generator
app.post("/generate-nemID", (req, res) => {
    console.log("Body: ", req.body);
    let cpr = req.body.cpr;
    let email = req.body.email;
    let randomFiveDigitNumber = Math.floor(10000 + Math.random() * 90000);
    let nemId = randomFiveDigitNumber + cpr.slice(-4);
    console.log("cpr", cpr);
    console.log("email", email);
    console.log("randomFiveDigitNumber", randomFiveDigitNumber);
    console.log("nemId", nemId);

    res.json({
        status: 201,
        message: 'Created NemID!',
        nemId: nemId
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
