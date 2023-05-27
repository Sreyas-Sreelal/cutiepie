var time = null;
var tokenizer = require('wink-tokenizer');
var makiWords = require('./correct.json');
var myTokenizer = tokenizer();

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

async function cmd_makify(client, message) {
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

module.exports = {
    cmd_makify
}