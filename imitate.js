const { normaliseNames } = require("./utils");

const OpenAI = require("openai");

const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.AI_TOKEN
});

async function imitate(db, name) {
    name = normaliseNames(name);


    let row = await db.all("SELECT message,author from messages where author = ? and length(message)>50 COLLATE NOCASE ORDER BY RANDOM() LIMIT 25", [name]);
    try {
        if (row && row.length > 0) {
            let author = row[0].Author;
            messages = row.map(x => x.Message).join("\n");

            const completion = await openai.chat.completions.create({
                messages: [{ 
                    role: "system", 
                    content: `These are the messages of user ${author} based on this imitate this user. \n ${messages}` 
                }],
                model: "deepseek/deepseek-r1:free",
              });
            let response = completion.choices[0].message.content;
            console.log("response imitate ",response);
            return "This is what **" + author + "** sounds like:\n" + response.split('\n').map(x => "> " + x).join('\n');
            
        } else {
            let row = await db.all("SELECT author from messages where author like ? and length(message) > 30 COLLATE NOCASE GROUP BY author  LIMIT 10", ["%" + name + "%"]);
            let authors = row.map(x => x.Author).join(",");

            return "No sufficient or lengthy message found with that author or author name is invalid. Did you meant to mimic any of these users instead? ```" + authors + "```";
        }
    } catch (err) {
        console.log(err);
        console.log(messages);
        return "Sorry, the text I tried to generate was beyond mortal comprehension.";
    }
}

module.exports = {
    imitate
}