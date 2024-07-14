const { normaliseNames } = require("./utils");

async function storygen(db, name) {

    name = normaliseNames(name);
    try {
        let row = await db.all("SELECT message,author from messages where author = ? and length(message)>50 COLLATE NOCASE ORDER BY RANDOM() LIMIT 20", [name]);
        if (row && row.length > 0) {
            let author = row[0].Author;
            messages = row.map(x => x.Message).join("\n");
            
            let data = await fetch("https://gptapi.capitalizemytitle.com/character_name_turnstile.php?name_gender=any&action=character-backstory&number_names=1&fake=true&more_details_text="+ messages +"&character_name=" +author + "&recaptcha_token=bypass&enableGPT=true", {
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
            response = response.split('\n').map(x => "> " + x).join('\n');

            return "Ok let me tell the story of **" + author +"**\n"+ response;
        }
    } catch (err) {
        console.log(err);
        return "Sorry failed to generate story";
    }
    let row = await db.all("SELECT author from messages where author like ? and length(message) > 50 COLLATE NOCASE GROUP BY author  LIMIT 10", ["%" + name + "%"]);
    let authors = row.map(x => x.Author).join(",");
    return "Sorry failed to generate summary.No sufficient or lengthy message found with that author or author name is invalid. Did you mean any of these users instead? ```" + authors + "```";
}
module.exports = {
    storygen
}