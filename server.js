const Discord = require("discord-user-bots");
const client = new Discord.Client(process.env.TOKEN);
const wiki = require('wikipedia');
var sqlite3 = require('sqlite3');
var sqlite = require('sqlite');
require('http').createServer((req, res) => res.end('Bot is alive!')).listen(3000)


var tokenizer = require('wink-tokenizer');
var makiWords = require('./correct.json');
var db = null;

var myTokenizer = tokenizer();
client.on.ready = async function () {
    db = await sqlite.open({
        filename: './messages.db',
        driver: sqlite3.Database
    });
    console.log("Client online!");
    await client.send("841879631280078848", { content: "started successfully" })
};
var time = null;
function strip(string) {
    return string.replace(/^\s+|\s+$/g, '');
}
client.on.message_create = async function (message) {
    //console.log(message);
    if (message.author.username === "_SyS_" && message.channel_id === "841879631280078848" && message.content === "restart") {

        console.log("restarting...");
        setTimeout(function () {
            process.on("exit", function () {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit"
                });
            });
            process.exit();
        }, 5000);
    }
    if ((message.channel_id === "806208193910669322" || message.channel_id === "841879631280078848" || message.channel_id === "801383694996602890") && message.content.startsWith("/wiki")) {
        /*  let summary = await wikisearch(message.content.slice(6));
         if(summary) {
             console.log(summary.extract.slice(0,100));
             client.send(message.channel_id,{content:summary.extract.slice(0,100)})
         } */
        await client.send(message.channel_id, { content: "nice try, wiki is disabled bozo!" })
    }
    if ((message.channel_id === "806208193910669322" || message.channel_id === "841879631280078848" || message.channel_id === "801383694996602890") && message.content.startsWith("/makify")) {
        let param = message.content.slice(8).toLowerCase();
        if (time && Date.now() - time < 15000) {
            await client.add_reaction(message.id, message.channel_id, "🕐");
            return
        }
        if (param.includes("nigris")) {
            await client.send(message.channel_id, { content: "Nope, I can't do that, no igris from me!", reply: message.id });
            return;
        }
        let response = makify(param);
        if (response) {
            console.log(response);
            await client.send(message.channel_id, { content: response, reply: message.id })
            time = Date.now();
        }
    }

    if ((message.channel_id === "806208193910669322" || message.channel_id === "841879631280078848" || message.channel_id === "801383694996602890") && message.content.startsWith("/impersonate")) {

        if (time && Date.now() - time < 15000) {
            await client.add_reaction(message.id, message.channel_id, "🕐");
            return
        }

        let param = strip(message.content.slice(13).toLowerCase());
        if (param.includes("sashimi") || param.includes("soarin") || param.includes("wter") || param.includes("wondar") || param.includes("sneakyklee") || param.includes("aneko")) {
            time = Date.now();
            await client.send(message.channel_id, { content: getRandomLegal(param), reply: message.id });
            return;
        }
        time = Date.now();
        let response = await impersonate(param);
        console.log(response)

        await client.send(message.channel_id, { content: response, reply: message.id });

    }

};

client.on.discord_disconnect = function () {
    setTimeout(function () {
        process.on("exit", function () {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
        });
        process.exit();
    }, 5000);
}

function makify(text) {
    let words = myTokenizer.tokenize(text);
    var response = '';
    let makiword = '';
    words.forEach(x => {
        console.log(x.value)
        makiword = makiWords[x.value] ? makiWords[x.value] : x.value;
        response += makiword + " "
    });
    var chance = Math.floor(Math.random() * 10) + 1;
    if (chance <= 3) {
        response += " :5head:";
    }

    return response;
}


async function wikisearch(text) {
    try {
        const page = await wiki.page(text);
        console.log(page);
        //Response of type @Page object
        const summary = await page.summary();
        console.log(summary);
        return summary;
        //Response of type @wikiSummary - contains the intro and the main image
    } catch (error) {
        console.log(error);
        //=> Typeof wikiError
    }
}
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

async function impersonate(name) {
    console.log(name)
    name = normaliseNames(name);
    let row = await db.get("SELECT message,author from messages where author like ? and message not like '%https://%' and length(message) > 50 ORDER BY RANDOM() LIMIT 1", ["%" + name + "%"]);
    if (row) {
        console.log(row);
        let filtered = row.Message.split('\n').map(x => "> " + x).join('\n');
        return filtered + "\n" + "** -" + row.Author + "**";
    } else {
        console.log("poo");
        return "No message found with that author";
    }
}