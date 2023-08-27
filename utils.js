const { nameMaps } = require("./config");

async function send_message(client, message, content, reply) {
    var payload = {
        content: content
    };

    if (reply) {
        payload = { ...payload, reply: message.id };
    }

    await client.send(message.channel_id, payload);
}

function getRandomLegal(name) {
    const legalMgs = [
        `${name} stop idiolising a criminal!`,
        `ffs ${name}, make use of your time for better things!`,
        `You're pushing your luck`,
        `Missing him that much?`,
        `Shame on you`,
        `why?`,
        `No`,
        `I rather kms`,
        `Ok ${name}, here's a task for you. Write a 500 word essay on **Why is it not a good idea to impersonate pdf**`,
    ];
    return legalMgs[Math.floor(Math.random() * legalMgs.length)];
}

function normaliseNames(name) {
    return nameMaps[name] ? nameMaps[name] : name;
}

module.exports = {
    send_message,
    normaliseNames
}