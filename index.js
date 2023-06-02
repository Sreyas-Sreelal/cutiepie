const Discord = require("discord-user-bots");
const client = new Discord.Client(process.env.TOKEN);
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const { AllowedChannels } = require("./config");

const { cmd_makify } = require("./makify");
const { cmd_impersonate } = require("./impersonate");
const { cmd_wiki } = require("./wiki");

//require('http').createServer((req, res) => res.end('Bot is alive!')).listen(3000)

var db = null;

client.on.ready = async function () {
    db = await sqlite.open({
        filename: './messages.db',
        driver: sqlite3.Database
    });
    console.log("Client online!");
    await client.send("841879631280078848", { content: "started successfully" })
};

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
    
    if (AllowedChannels.includes(message.channel_id) && message.content.startsWith("/wiki")) {
        await cmd_wiki(client,message);
    }

    if (AllowedChannels.includes(message.channel_id) && message.content.startsWith("/makify")) {
        await cmd_makify(client,message);
    }

    if (AllowedChannels.includes(message.channel_id) && message.content.startsWith("/impersonate")) {
        await cmd_impersonate(client,message,db);
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