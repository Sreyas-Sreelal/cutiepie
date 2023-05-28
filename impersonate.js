var time = null;

const blockedUsers = [
    "sashimi",
    "soarin",
    "wter",
    "wondar",
    "sneakyklee",
    "aneko",
    "mofumofu",
    "mofu"
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
    "maki": "マキ#2515"
};

function strip(string) {
    return string.replace(/^\s+|\s+$/g, '');
}

function getRandomLegal(name) {
    const legalMgs = [
        `Unfortunately, I am legally bound and cannot impersonate ${name}.`,
        `Regrettably, I am prohibited by law from assuming the role of ${name}.`,
        `Due to legal restrictions, I am not allowed to portray myself as ${name}.`,
        `For legal purposes, I am barred from impersonating ${name}.`,
        `It is against the law for me to assume the identity of ${name}.`,
        `I am legally restricted from impersonating ${name} for my own protection.`,
        `In accordance with legal guidelines, I am unable to act as ${name}.`,
        `Impersonating ${name} would violate legal regulations, so I cannot do it.`,
        `I must adhere to legal obligations, which prevent me from impersonating ${name}.`,
        `Acting as ${name} would go against legal constraints that I must abide by.`
    ];
    return legalMgs[Math.floor(Math.random() * legalMgs.length)];
}

function normaliseNames(name) {
    return nameMaps[name] ? nameMaps[name] : name;
}

async function impersonate(name, db) {
    name = normaliseNames(name);
    let row = await db.get("SELECT message,author from messages where author like ? and length(message) > 50 ORDER BY RANDOM() LIMIT 1", ["%" + name + "%"]);
    if (row) {
        console.log(row);
        let filtered = row.Message.split('\n').map(x => "> " + x).join('\n');
        return filtered + "\n" + "** -" + row.Author + "**";
    } else {
        return "No message found with that author";
    }
}

async function cmd_impersonate(client, message, db) {
    if (time && Date.now() - time < 15000) {
        await client.add_reaction(message.id, message.channel_id, "🕐");
        return
    }

    let param = strip(message.content.slice(13).toLowerCase());
    /* if (blockedUsers.includes(param)) {
        time = Date.now();
        await client.send(message.channel_id, { content: getRandomLegal(param), reply: message.id });
        return;
    } */
    time = Date.now();
    let response = await impersonate(param, db);
    console.log(response)

    await client.send(message.channel_id, { content: response, reply: message.id });
}

module.exports = {
    cmd_impersonate
}