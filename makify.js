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

module.exports = {
    makify
}