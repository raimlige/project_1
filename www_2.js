const http = require("http");
//lisame mooduli päringu URLi parsimiseks
const url = require("url");
//lisame mooduli failitee kasutamiseks
const path = require("path");
const fs = require("fs");
const dateEt = require("./src/dateTimeET");
const textRef = "txt/vanasonad.txt";
const pageBegin = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Raimond Lige, veebiprogrammeerimine</title>\n</head>\n<body>';
const pageBody = '\n\t<h1>Raimond Lige, veebiprogrammeerimine</h1>\n\t<p>See leht on tehtud <a href="https://www.tlu.ee/dt">Tallinna ülikooli</a> veebiprogrammeerimise kursusel ja ei sisalda mõistlikku sisu.</p><p>Käsitleme HTML keelt ja siis Node.Js programmeerimiskeelt.</p>\n\t<hr>';
const pageBanner = '<img src="vp_banner_2025_ID.jpg" alt="Kursuse bänner">';
const pageEnd = '\n</body>\n</html>';

http.createServer(function(req, res){
	//vaatan päringut
	console.log("Päring: " + req.url);
	let currentUrl = url.parse(req.url, true);
	console.log("Parsituna: " + currentUrl.pathname);
	
	if (currentUrl.pathname === "/"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageBegin);
		res.write(pageBanner);
		res.write(pageBody);
		res.write("\n\t<p>Täna on " + dateEt.weekDay() + " " + dateEt.longDate() + ".</p>");
		res.write('<p> Vaata valikut <a href ="/vanasonad">vanasõnadest</a>. </p>')
		res.write(pageEnd);
		return res.end();
	}
	
	
	else if(currentUrl.pathname === "/vanasonad"){
		res.writeHead(200, {"Content-type": "text/html"});
		fs.readFile(textRef, "utf8", (err, data)=>{
			if(err){
				res.write(pageBegin);
				res.write(pageBanner);
				res.write(pageBody);
				res.write("\n\t<p>Täna on " + dateEt.weekDay() + " " + dateEt.longDate() + ".</p><p>Kahjuks tänaseks ühtki vanasõµna välja pakkuda pole!</p>");
				res.write(pageEnd);
				return res.end();
			} else {
				let oldWisdomList = data.split(";");
				let folkWisdomOutput = "\n\t<ol>";
				for (let i = 0; i < oldWisdomList.length; i ++){
					folkWisdomOutput += "\n\t\t<li>" + oldWisdomList[i] + "</li>";
				}
				folkWisdomOutput += "\n\t</ol>";
				res.write(pageBegin);
				res.write(pageBanner);
				res.write(pageBody);
				res.write("\n\t<p>Täna on " + dateEt.weekDay() + " " + dateEt.longDate() + ".</p>");
				res.write("\n\t<h2>Valik Eesti vanasõnu</h2>")
				res.write(folkWisdomOutput);
				res.write(pageEnd);
				return res.end();
			}
		});
	}
	
	else if (currentUrl.pathname === "/vp_banner_2025_ID.jpg"){
		//liidame muidu veebiserverile kättesaamatu kataloogi "images" meie veebi failiteega
		let bannerPath = path.join(__dirname, "images");
		fs.readFile(bannerPath + currentUrl.pathname, (err, data)=>{
			if (err){
				throw(err);
			} 
			else {
				res.writeHead(200, {"Content-type": "image/jpeg"});
				res.end(data);
			}
		});
	}
	
	else {
		res.end("Oi, viga 404, ei leia sellist veebilehte!")
	}
}).listen(5210);