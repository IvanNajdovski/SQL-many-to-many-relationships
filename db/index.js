const { Client } = require("pg");

const client = new Client({
     connectionString: "ivan:ivan_:dime@localhost/messages-tags-node"
});

client.connect();

module.exports = client;