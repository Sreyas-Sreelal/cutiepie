const wiki = require('wikipedia');

async function wikisearch(text) {
    try {
        const page = await wiki.page(text);
        console.log(page);
        //Response of type @Page object
        const summary = await page.summary();
        console.log(summary);
        return summary;
        //Response of type @wikiSummary - contains the intro and the main image
    } catch (error) {
        console.log(error);
        //=> Typeof wikiError
    }
}

async function cmd_wiki(client, message) {
    /*
    let summary = await wikisearch(message.content.slice(6));
    if(summary) {
        console.log(summary.extract.slice(0,100));
        client.send(message.channel_id,{content:summary.extract.slice(0,100)})
    } 
    */
    await client.send(message.channel_id, { content: "nice try, wiki is disabled bozo!" })
}

module.exports = {
    cmd_wiki
}