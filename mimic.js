const { normaliseNames } = require("./utils");
const MarkovGen = require('markov-generator');

async function mimc(db, name) {

    name = normaliseNames(name);
    let row = await db.all("SELECT message,author from messages where author = ? and length(message) > 50 ORDER BY RANDOM() LIMIT 1000", ["%" + name + "%"]);
    try {
        if (row && row.length > 0) {
            
            messages = row.map(x => x.Message);
            let markov = new MarkovGen({
                input: messages,
                minLength: Math.floor(Math.random() * 51)
            });
            let sentence = markov.makeChain();
            console.log(sentence);
            //console.log(row);
            return "This is what **" + name + "** sounds like:\n" + sentence.split('\n').map(x => "> " + x).join('\n');
        } else {
            return "No message found with that author";
        }
    } catch (err) {
        console.log(err);
        return "Sorry, the text I tried to generate was beyond mortal comprehension.";
    }

}

module.exports = {
    mimc
}