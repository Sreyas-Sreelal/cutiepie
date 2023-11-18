function mtlise(text) {
    let words = text.split(" ");
    let response = '';
    words.forEach(x => {
        response += x + " ";
        var chance = Math.floor(Math.random() * 100) + 1;
        if(chance<=30) {
            response+='\n';
        }
    });
    return response;
}

module.exports = {
    mtlise
}