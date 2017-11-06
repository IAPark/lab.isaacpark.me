const sendmail = require('sendmail')();
import * as Express from "express";
import * as bodyParser from "body-parser";

const app = Express();

app.use(bodyParser.urlencoded());
app.use(Express.static('.'))


app.post('/api/register', function(req, res) {
    sendmail({
        from: 'sender@lab.isaacpark.me',
        to: req.body.email,
        subject: 'Registered for notifications',
        html: 'You appear to have registered to be notified to any changes to the output of '+req.body.url,
    }, function(err: any, reply: any) {
        console.log(err && err.stack);
        console.dir(reply);
    });
    res.redirect('/success.html?='+req.body.email);
});

app.listen(3002);