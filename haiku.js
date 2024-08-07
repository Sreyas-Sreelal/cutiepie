const { normaliseNames } = require("./utils");

async function haiku(db, name) {

    name = normaliseNames(name);
    try {
        let row = await db.all("SELECT message,author from messages where author = ? and length(message)>50 COLLATE NOCASE ORDER BY RANDOM() LIMIT 10", [name]);
        if (row && row.length > 0) {
            let author = row[0].Author;
            messages = row.map(x => x.Message).join("\n");
            
            let data = await fetch("https://gptapi.capitalizemytitle.com/poem_generator_turnstile.php?title=" + messages +"&action=haiku&number_titles=1&poem_type=haiku&enableGPT=true&recaptcha_token=bypass", {
                "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9,ml;q=0.8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                  "Referer": "https://capitalizemytitle.com/",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
              });
            console.log(data);
            let response = await data.json();
            console.log(response);
            response = response.data.titles[0];
            //response = response.replace("\n","\n> ");
            response = response.split('\n').slice(0, 3).map(x => "> " + x).join('\n');

            return response + "\n-**" + author + "**";
        }
    } catch (err) {
        console.log(err);
        return "Sorry failed to generate haiku";
    }
    let row = await db.all("SELECT author from messages where author like ? and length(message) > 50 COLLATE NOCASE GROUP BY author  LIMIT 10", ["%" + name + "%"]);
    let authors = row.map(x => x.Author).join(",");
    return "Sorry failed to generate haiku.No sufficient or lengthy message found with that author or author name is invalid. Did you mean any of these users instead? ```" + authors + "```";
}
module.exports = {
    haiku
}