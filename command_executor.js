const { makify } = require("./makify");
const { impersonate } = require("./impersonate");
const { wiki_search } = require("./wiki");
const { copypasta } = require("./copypasta");
const { send_message } = require("./utils");
const { AllowedChannels } = require("./config");
const { mimc } = require("./mimic");
const { mtlise } = require("./mtlise");
const { zyrenn } = require("./zyrenn");
const {poem}  = require("./poem");

var registered_commands = {
    "makify": {
        "function": makify,
    },
    "impersonate": {
        "function": impersonate,
        "require_db": true,
    },
    "copypasta": {
        "function": copypasta,
        "require_db": true,
    },
    "wiki": {
        "function": wiki_search,
    },
    "mimic": {
        "function": mimc,
        "require_db": true,
    },
   /*  "mtlise": {
        "function":mtlise,
    },
    "zyrenn":{
        "function":zyrenn,
        "ignore":true
    } */

    "poem": {
        "function": poem,
        "require_db": true,
    }
};

async function execute_command(command, args, client, message, db) {
    var cmd = registered_commands[command];

    /* if (!AllowedChannels.includes(message.channel_id) && !cmd?.ignore) {
        return;
    } */
    if (!cmd) {
        await send_message(client, message, "Unknown Command!", true);
        return;
    }

    let response;
    if (cmd.require_db) {
        response = await cmd.function(db, args);
    } else {
        response = await cmd.function(args);
    }
    response = response.split("@everyone").join("@\\everyone");
    await send_message(client, message, response, true);
}

module.exports = {
    execute_command
}