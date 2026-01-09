
const fs = require('fs');
const https = require('https');

const file = fs.createWriteStream("public/music.mp3");
const request = https.get("https://raw.githubusercontent.com/ElyssonSantos/casamento-musica/main/TurningPage.mp3", function (response) {
    if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("Download Completed. Size:", file.bytesWritten);
        });
    } else {
        console.log("Download Failed. Status:", response.statusCode);
        response.pipe(process.stdout);
    }
});
