const wiki = require('wikipedia');

async function wiki_search(text) {
    try {
        const page = await wiki.page(text);
        console.log(page);
        const summary = await page.summary();
        console.log(summary);
        return summary.extract.slice(0,summary.extract.length > 5000 ? 5000 : summary.extract.length);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    wiki_search
}