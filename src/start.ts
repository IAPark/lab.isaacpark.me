import * as fs from "fs";

var secret = JSON.parse(<any>fs.readFileSync("/var/www/secret.json"));

var mailgun = require('mailgun-js')({apiKey: secret.mailgun.apiKey, domain: 'lab.isaacpark.me'});
import * as Express from "express";
import * as bodyParser from "body-parser";
import * as request from "request";
import fetch from "node-fetch";

const app = Express();

app.use(bodyParser.urlencoded());
app.use(Express.static('.'));


function send(to: string, subject: string, body: string) {
    var data = {
        from: 'Robot Watcher <watcher@lab.isaacpark.me>',
        to: to,
        subject: subject,
        text: body
    };
    mailgun.messages().send(data, function (error: any, body: any) {
        console.log(body);
    });
}



setInterval(() => {
    listeners.forEach(l => setTimeout(() => l.tick(), Math.random()*1000*60*5));
}, 1000*60*17)

class ApiListener {
    url: string;
    email: string;
    lastValue: string|null = null;
    constructor(url: string, email: string) {
        this.url = url;
        this.email = email;
    }

    async pull() {
        let result = await fetch(this.url);
        let value = result.body.read().toString();
        let changed = value === this.lastValue;
        this.lastValue = value;
        return changed;
    }

    sendUpdate() {
        send(this.email, 'Important, the API has changed', `${this.url} has changed to ${this.lastValue}`)
    }

    tick() {
        this.pull()
            .then(r => r?this.sendUpdate():null);
    }
}

let listeners: ApiListener[] = [];

app.post('/api/register', function(req, res) {
    send(req.body.email, 
        'Registered for notifications', 
        'You appear to have registered to be notified to any changes to the output of '+req.body.url)

    listeners.push(new ApiListener(req.body.url, req.body.email));

    res.redirect('/success.html?='+req.body.email);
});

app.listen(3002);