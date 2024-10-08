const multer = require("multer");
const fsp = require('fs').promises;
const fs = require("fs");
const express = require("express");
var bodyParser = require('body-parser')
var imageJson = {};
const USdir = 'clarius/';

async function getImages() {
	const imageJson = {};
	
	const dirs = [USdir];
  
	try {
	  for (const dir of dirs) {
		imageJson[dir] = [];
		const files = await fsp.readdir(__dirname + "/" + dir + "/");
		imageJson[dir].push(...files);
	  }
	} catch (error) {
	  console.error("Error getting images:", error);
	}
  
	var json = JSON.stringify(imageJson);
	
	json = "var imagesJSON =" + json;
	fsp.writeFile('images.js', json, (err) => { 
			if (err) console.log(err); 
			else { 
			console.log("File written successfully\n"); 
			} 
		}); 
	return imageJson;
}
  
(async () => {
	imageJson = await getImages();
  })();


const app = express();

var jsonParser = bodyParser.json()
app.use(bodyParser.json())

app.post("/save-canvas", async (req, res) => {
	const canvasData = req.body.canvasData.replace("data:image/png;base64,","");
	fs.writeFileSync(__dirname+req.body.filename, canvasData, {encoding:'base64',flag:'w'});
	imageJson[USdir].push(req.body.filename.replace(USdir,""));
	var json = JSON.stringify(imageJson);
	json = "var imagesJSON =" + json;
	fs.writeFile('images.js', json, (err) => { 
			if (err) 
			console.log(err); 
			else { 
			console.log("File written successfully\n"); 
			
			} 
		}); 

	res.send("Canvas saved successfully!");
  });
  

app.use(express.static(__dirname));
app.use('/'+USdir, express.static('public'))
app.listen( 3000, () => {
	  console.log('my app is listening at %s at $s',  "3000", __dirname);;
});

