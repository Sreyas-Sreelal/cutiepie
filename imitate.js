const { normaliseNames } = require("./utils");

async function imitate(db, name) {
    name = normaliseNames(name);


    let row = await db.all("SELECT message,author from messages where author = ? and length(message)>50 COLLATE NOCASE ORDER BY RANDOM() LIMIT 25", [name]);
    try {
        if (row && row.length > 0) {
            let author = row[0].Author;
            messages = row.map(x => x.Message).join("\n");

            let data = await fetch("https://www.editpad.org/text_summarizer_req_new", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9,ml;q=0.8",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "cookie": "XSRF-TOKEN=eyJpdiI6InVwc285K3lPTWVSeDIvc3FoekY1U2c9PSIsInZhbHVlIjoiZG1DeXhnNGE2bFc0Rmt1bmZHVEdQUHk4U2p3QnRzcVBaK1R1TTZCREJiWEJYc0luQW1wVStDWmJseWJja0t4MzVWaHppdVp3M1lJT2pDVHdsbDJMcEdiVm4zMnBRUTBrc1hicWx1d0toaWtFZHZydERrWUpQTzdpaUgrb05rRUQiLCJtYWMiOiJmYjI0MThiMGNkMmRlM2U2MGIxM2E1Y2VhZjQ1ZDQ3OWVlMmY3N2RlMDIwYWVhYzkyMmRlOWVlYmFmODllOGVmIiwidGFnIjoiIn0%3D; editpadorg_session=eyJpdiI6IkNlUmNuRSs5NWFQQWRVRHltNVBPbkE9PSIsInZhbHVlIjoiR0N6aTJPMVoxVXFxZzBNMDRTSlpSenNEZVlCZzMwSzNxL1BtK0FBVTM5NGRlN256K3dQQ01icko5K3Y4S3paUmxnbGpyY29lUTJST1BnU1hVaGErbUtJbXB6Y21jOWNZc3d2dW4zNjJDSjVrRnE2RUgvQ3h3OXVCSTFULzkveDEiLCJtYWMiOiIwZWM0NGQ4N2VmNGQzMmVhNTc4MGZmMjA1ZTRkZjUzYjhiNDMyODU3YTIzNzdkMTUxYTA0ZjZkMWVmNTVhNjdlIiwidGFnIjoiIn0%3D",
                    "Referer": "https://www.editpad.org/tool/text-summarizer",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": "_token=yLAs1wSwGK1U6NHl4QScMBcXdFMsJaOH4gTnt9oO&text="+messages+"&percnt=50&modd=1&min_length=6&max_length=9.600000000000001&lang=en&captcha=0.nxUcUMPyMrgzEFiN1awBPChhG1RY-MyfpsHDBq3PoU3vc0WEtVnFoZz2_zlSlkRERnRwS21VwmfTCuapIv6dxiQwQHRosVVCOSiyZbZXeYQy9dbRMHbx8477o0WWjRIYANZq8YNWdWwfGHwYE3B-nRCbACyTYPMm6kobsLf4lArO3OKwaLAwj267FasfV3mGO08qO-1nXL0ydovfcHN_ohJhkUS7XtjkOHzHjFCJYF4bPH_m2tRZir5c0j7tRjigpc9oS9Dv3F60XFFdUxWexj8j54l9YZvdv8q1ZpYotgNF97NSc6e3kaIzqM-w30eRZ_dgWpwtme2J_8HO4F8gDf9OI5Uw5cyUaZ_mrQojZQ2EnPhGo_g3JGhMM7VDLC5KJfn45igVAT7tIulY8a7ORH6HozafaBE-TSUx1l3OK8hz8qA1-uzOxuPNcHZ5V7kI.VW0YYJe6wIH2ED1AxN8Luw.75d05a062b839537c876f2862ea0ab61149d585efaf84ba47dd556b2b55fc5a5&captcha_type=0",
                "method": "POST"
            });
            let response = await data.json();
            if(!response.err){
                let sentence = response.content.slice(0,2500);
                //console.log(row);
                return "This is what **" + author + "** sounds like:\n" + sentence.split('\n').map(x => "> " + x).join('\n');
            } else {
                console.log(response);
                return "Sorry, the text I tried to generate was beyond mortal comprehension.";
            }
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