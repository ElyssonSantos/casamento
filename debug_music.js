
const https = require('https');

https.get("https://raw.githubusercontent.com/ElyssonSantos/casamento-musica/main/TurningPage.mp3", (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    let data = '';
    res.on('data', (d) => {
        data += d;
    });

    res.on('end', () => {
        console.log("BODY LENGTH:", data.length);
        console.log("BODY START:", data.substring(0, 100));
    });

}).on('error', (e) => {
    console.error(e);
});
