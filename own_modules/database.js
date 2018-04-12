'use strict';


class Database {
    constructor() {
        this.mongoose = require('mongoose');
        this.https = require('https');
    }
    connect(url, app, options) {
        this.mongoose.connect(url).then(() => {
          console.log('Connected successfully.');
          this.https.createServer(options, app).listen(3000);
        }, (err) => {
          console.log('Connection to db failed: ' + err);
        });
    }
    getSchema(schema, name) {
        const s = new this.mongoose.Schema(schema);
        return this.mongoose.model(name, s);
    }
}

module.exports = new Database();
