// Using the ESB-light-node package is not sustainable when connecting to different sources.
// It seems that there are some concurrency issues. So I will mock this instead

const express = require('express');
const sqlite3 = require('sqlite3');
const xmlparser = require('express-xml-bodyparser');
const axios = require('axios');

var db = new sqlite3.Database('nem_id_database.sqlite');
var app = express();

app.use(express.json());
app.use(xmlparser());

app.get('/test', (req, res) =>{
    res.status(200).send({message: "Server is running just fine on port 8080... "})
});


app.post('/nemId', xmlparser({trim: false, explicitArray: false}), async(req, res, next) =>{
    let cpr = req.body.person.cprnumber[0];
    let email = req.body.person.email[0];
    let nemId = '';
    axios.post('http://localhost:8088/generate-nemId', {cpr: cpr, email: email}).then(response =>{
        nemId = response.data.nemId;
        axios.post('http://localhost:8089/generate-password-nemID', {nemId: nemId, cpr:cpr}).then(re => {
            let query = "INSERT INTO user(CPR, NemID, Password) VALUES(?,?,?)";
            db.run(query, [cpr, nemId, re.data.nemIdPassword], (err) =>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Inserted");
            return res.status(200).send({nemID: nemId});
        }
    });
        }).catch(er => {
            console.log(er);
        });
    }).catch(err =>{
        if(err){
            console.log(err);
        }
    });
});


app.post('/generate-auth-code', async (req, res) =>{
    let data = req.body;
    axios.post('http://localhost:8090/nemid-auth', data).then(response =>{
        console.log(response)
        return res.status(200).send({generatedCode: response.data.generatedCode});
    }).catch(err =>{
        if(err){
            console.log(err);
        }
    });
});


app.patch('/change-nemId-password', (req, res) => {
    let data = req.body;
    let query = "UPDATE user SET Password = ? WHERE CPR = ?";
    db.run(query, [data.newPassword, data.cpr], (err) =>{
        if(err){
            console.log(err);
        }
    });
    return res.status(204).send();
});



app.listen(8080, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Listening on port 8080");
        console.log("ESB is configured...");
    }
});