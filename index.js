const Discord = require("discord-user-bots");
const client = new Discord.Client(process.env.TOKEN);
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const { execute_command } = require("./command_executor");

require('http').createServer((req, res) => res.end('Bot is alive!')).listen(3000)

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
    if (message.content.startsWith("/")) {
        let command_info = message.content.slice(1).split(" ");
        let command_name = command_info[0];
        let args = command_info.slice(1).join(' ');
        await execute_command(command_name, args, client, message, db);

    }
};
