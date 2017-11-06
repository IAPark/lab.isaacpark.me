import * as nodemailer from "nodemailer";
import * as Express from "express";
import * as bodyParser from "body-parser";

const app = Express();

app.use(bodyParser.urlencoded());

app.post('/api/register', function(req, res) {
    res.redirect('/success.html?='+req.body.email);
});

app.listen(3002);