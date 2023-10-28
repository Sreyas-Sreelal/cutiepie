const { normaliseNames } = require("./utils");

async function copypasta(db, name) {
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

module.exports = {
    copypasta
}