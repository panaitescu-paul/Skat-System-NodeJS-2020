const express = require('express');
const PORT = 8089;
let app = express();

app.use(express.json());

// Topic 5: NemID Password Generator:
app.post("/generate-password-nemID", (req, res) => {
    console.log("Body:", req.body);
    let nemId = req.body.nemId;
    let cpr = req.body.cpr;
    let password = nemId.slice(0, 2) + cpr.slice(-2);

    console.log("Password:", password);
    res.json({
        status: 200,
        message: "Successful!",
        nemIdPassword: password
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
