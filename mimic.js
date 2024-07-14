const { normaliseNames } = require("./utils");
const MarkovGen = require('markov-generator');

async function mimc(db, name) {

    name = normaliseNames(name);
    let row = await db.all("SELECT message,author from messages where author = ? COLLATE NOCASE ORDER BY RANDOM() LIMIT 1000", [ name ]);
    try {
        if (row && row.length > 0) {
            let author = row[0].Author;
            messages = row.map(x => x.Message);
            
            let markov = new MarkovGen({
                input: messages,
                minLength: Math.floor(Math.random() * 51)
            });
            let sentence = markov.makeChain();
            console.log(sentence);
            //console.log(row);
            return "This is what **" + author + "** sounds like:\n" + sentence.split('\n').map(x => "> " + x).join('\n');
        } else {
            let row = await db.all("SELECT author from messages where author like ? and length(message) > 30 COLLATE NOCASE GROUP BY author  LIMIT 10", [ "%" + name + "%" ]);
            let authors = row.map(x => x.Author).join(",");
    
            return "No sufficient or lengthy message found with that author or author name is invalid. Did you meant to mimic any of these users instead? ```" + authors + "```";
        }
    } catch (err) {
        console.log(err);
        console.log(messages)
        return "Sorry, the text I tried to generate was beyond mortal comprehension.";
    }

}

module.exports = {
    mimc
}