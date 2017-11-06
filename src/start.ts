const sendmail = require('sendmail')();
import * as Express from "express";
import * as bodyParser from "body-parser";
import * as request from "request";
import fetch from "node-fetch";

const app = Express();

app.use(bodyParser.urlencoded());
app.use(Express.static('.'))

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
        sendmail({
            from: 'sender@lab.isaacpark.me',
            to: this.email,
            subject: 'Important, the API has changed.',
            html: `${this.url} has changed to ${this.lastValue}`,
        }, function(err: any, reply: any) {});
    }

    tick() {
        this.pull()
            .then(r => r?this.sendUpdate():null);
    }
}

let listeners: ApiListener[] = [];

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
    listeners.push(new ApiListener(req.body.url, req.body.email));

    res.redirect('/success.html?='+req.body.email);
});

app.listen(3002);