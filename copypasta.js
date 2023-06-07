const { AllowedChannels } = require("./config");

var time = {};
AllowedChannels.forEach(x => {
  time[x] = null
});

const blockedUsers = [
    "sashimi",
    "soarin",
    "wter",
    "wondar",
    "sneakyklee",
    "aneko",
    "mofumofu",
    "mofu",
    "mofumofu",
    "ruzashu"
];

const nameMaps = {
    "loona": "voi",
    "vee": "voi",
    "kei": "raiden#0236",
    "risa": "Mio's Bass Guitar#2606",
    "kuro": "-⚡🌹𝓚𝓾𝓻𝓸🌹⚡-#0777",
    "rsimp": "Raiden|Mobius|Arlecchino Chair#0117",
    "botman": "L᲼#7024",
    "sakazu": "Valé#7842",
    "sen": "Valé#7842",
    "sak": "Valé#7842",
    "vale": "Valé#7842",
    "hi": "hello》#4195",
    "hi⚡dr.ratioඞ": "hello》#4195",
    "maki": "マキ#2515",
    "cow":"danni#8541",
    "lia":"gef#3959"
};

function strip(string) {
    return string.replace(/^\s+|\s+$/g, '');
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

async function copypasta(name, db) {
    name = normaliseNames(name);
    let row = await db.get("SELECT message,author from messages where author like ? and length(message) > 500 and length(message) <= 5000 ORDER BY RANDOM() LIMIT 1", ["%" + name + "%"]);
    if (row) {
        console.log(row);
        let filtered = row.Message.split('\n').map(x => "> " + x).join('\n');
        return filtered + "\n" + "** -" + row.Author + "**";
    } else {
        return "No message found with that author";
    }
}

async function cmd_copypasta(client, message, db) {
  
    if (time[message.channel_id] && Date.now() - time[message.channel_id] < 60*60*1000) {
        await client.add_reaction(message.id, message.channel_id, "🕐");
        return;
    }

    let param = strip(message.content.slice(11).toLowerCase());
    if (blockedUsers.includes(param)) {
        time[message.channel_id] = Date.now();
        await client.send(message.channel_id, { content: getRandomLegal(message.author.username), reply: message.id });
        return;
    }
  
  console.log(message.author.username)
    time[message.channel_id] = Date.now();
    let response = await copypasta(param, db);
    console.log(response)

    await client.send(message.channel_id, { content: response, reply: message.id });
}

module.exports = {
    cmd_copypasta
}