import * as nodemailer from "nodemailer";
import * as Express from "express";

const app = Express();


app.post('/api/register', function(req, res) {
    res.redirect('/success.html');
});

app.listen(3002);