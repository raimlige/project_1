const http = require("http");
const fs = require("fs");
const dateET = require("./src/dateTimeET");

const pageBegin = '<!DOCTYPE html> \n <html lang="et"> \n <head> \n \t <meta charset="utf-8"> \n \t <title>Raimond Lige veebiprogrammeerimine</title> \n </head>\n<body>';
const pageBody = '  <h1>Raimond Lige veebiprogrammeerimine</h1><p>See leht on tehtud <a href="https://www.tlu.ee/dt">Tallinna Ülikooli</a> veebiprogrammeerimise kursusel ja ei sisalda mõistlikku sisu!</p><p>Peamiselt keskendun interaktsiooni disainile, kuna see on minu suund sellel õppekaval.</p><hr>';
const pageEnd = '</body></html>';
const textRef = "txt/vanasonad.txt";

http.createServer(function(req, res){
    fs.readFile(textRef, "utf8", function(error, fileContent) {
        
        let randomWisdom;

        if (error) {
            console.error("Viga faili lugemisel:", error);
            randomWisdom = "Vabandame, vanasõna ei saanud kuvada.";
        } else {
            const wisdomList = fileContent.split(";");
            randomWisdom = wisdomList[Math.round(Math.random() * wisdomList.length)];
        }

        res.writeHead(200, {"Content-type": "text/html"});
        res.write(pageBegin);
        res.write(pageBody);
        res.write("<p>" + "Täna on " + dateET.longDate() + "\nTäna on " + dateET.weekDay() + "\nKell on " +  dateET.time() + "</p>");
        res.write("<p>" + "Tänane vanarahva tarkus: " + randomWisdom + "</p>");
        res.write(pageEnd);
        return res.end();
    });

}).listen(5210);