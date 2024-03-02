const { normaliseNames } = require("./utils");

async function poem(db, name) {

    name = normaliseNames(name);
    let row = await db.all("SELECT message,author from messages where author = ? COLLATE NOCASE ORDER BY RANDOM() LIMIT 1000", [name]);
    if (row && row.length > 0) {
        let author = row[0].Author;
        messages = row.map(x => x.Message).join("\n");
        let data = await fetch("https://www.editpad.org/generate_poem_req", {
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
                "cookie": "XSRF-TOKEN=eyJpdiI6ImZHTE12d2tRYmwrZWJMUEFCVm1mNXc9PSIsInZhbHVlIjoidCtsaVVxRHFjczZrUnROU0VhYU9UcXdiMFJDR1Q0Z01pZkZNeXdDKzFKbmlqbEl6ZTBzd3dta2lXaEJMMXJvdU9ib2QwWUtEdEY5WlhVUWNsZko4RmkvTFBwTTZxS1lPWHhRb3pZbHYxWVZQU21SZ05zalFPS1o1V2sraSs5RmoiLCJtYWMiOiI3ZTk1YjY5ZjFkZjA2YjVlNjk2Y2E2OGE1MjQwOTBiMWU2OGI2YTA2MjI3ZTkzMDQxYjdmZDdjYTU4ZWRlZDY1IiwidGFnIjoiIn0%3D; editpadorg_session=eyJpdiI6IlVvTDJiZXprR1Byc0tHNmZmdms4Z0E9PSIsInZhbHVlIjoiaDFVVy9CNTFYVkRoVmFRV3ViSmpMTDJONzlWdjUxUnNPS2sxdzk3QWFFbGF4S1g0bTNUTDg2QjJDc3pWQzVXZ3lBSUYwTlFxRlN2anlpaXQweGoyaTFKS1EvQjVuekFZM3JBK2Y4RlcxUGMweHhUVjkzSWpGQlkxYVNHT2l6aEgiLCJtYWMiOiJjNmYyZDBhNjg2ZDQ2MTczNzE2MTkwNTE0OWJkODJhYWM1NGEwOTg0N2M3OGFiNDQ3NWMzMGU1ZDIxZmY2ZTRhIiwidGFnIjoiIn0%3D",
                "Referer": "https://www.editpad.org/tool/poem-generator",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "_token=gJNGhuglmpU6x1iTUAuMSZ7OZ5eFaRjEzdZzHiw3&data=" + messages + "&length=Short&captcha=0.es1cK_gmj23Y4RkZyBLajjnnp6t7bcp0XBZsuk3ZBQPLkdJdxWHHf9loTaH8xFSOqQ_Y2855f9s9ON95c5eQKm4IH15cEtg_TDHNtgEtA0Fr9RvxZTc6zDz-VZgPzhUT-KJ7jQqTM05cI8BnmksCLzyd0YfBnt0ao6R7BQV23IsJTmNSzq_IBOFCdMkqNSuUBzVATZ5e3aT8O157rBSQY3zOThnHjfnE8tz7t3DoXEXc8JSaHiz4eqYUGdP1ul_Ss2hwW8VETq8icUSMfmGn4dwTNMghWIRdAyaSwYccODzMilPNKAuPjHCB2AWfe0dDPsqgbcVMngRCzOLw0_PR4F2pmC6TUF1skoiZqyPrtCttWTVm_NN9I6VYilEJWBgeJ2QgYZROcCF0X_WyqNKeZ9xGAt6ZZwcKqe_rQDLs5cIcnQh-UafZ4qJDSTAd0LjB.yFU6WPuoT1z4F8qSoEq5qA.80d51f38bd570097fae73d639002b326b3a70f30fce700fca3f74061a4903849&captcha_type=0",
            "method": "POST"
        });
        let response = await data.json();
        response = response.split("<br>").join("\n");
        return response.slice(0, 4500);
    }

    return "Sorry failed to generate poem";
}
module.exports = {
    poem
}