var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jsonfile = require('jsonfile');
var jsonFile = './data/data.json'

var json2csv = require('nice-json2csv');
var csvFile = './data/Student-Data.csv'
var fs = require('fs');

var csvWriter = require('csv-write-stream')
var writer = csvWriter()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var arrayList=[];


app.use(express.static('static'));

app.get('/download', urlencodedParser, function (req, res) {

var file = './data/Student-Data.csv';

res.download(file);
console.log(file);

});

app.get('/show', urlencodedParser, function (req, res) {
res.send(jsonfile.readFile(jsonFile, function(err, obj) {console.dir(obj)}) )

});


function Response(name, rollnumber, birthdate, mathmarks, chemmarks, phymarks, engmarks) {
    this.Name = name;
    this.RollNumber = rollnumber;
    this.BirthDate = birthdate;
    this.MathMarks = mathmarks;
    this.ChemistryMarks = chemmarks;
    this.PhysicsMarks = phymarks;
    this.EnglishMarks = engmarks; }



app.post('/process_post', urlencodedParser, function (req, res) {
	
    var responseObject = new Response(req.body.inputName, 
				      req.body.inputRollNumber, 
				      req.body.inputBirthDate,
				      req.body.inputMathMarks,
				      req.body.inputChemMarks, 
				      req.body.inputPhyMarks, 
				      req.body.inputEngMarks);


	arrayList.push(responseObject);
	console.log(JSON.stringify(arrayList));


	// Prepare output in JSON format
   	response = {
      		Name:req.body.inputName,
      		RollNumber:req.body.inputRollNumber,
      		BirthDate:req.body.inputBirthDate,
      		MathMarks:req.body.inputMathMarks,
      		ChemistryMarks:req.body.inputChemMarks,
      		PhysicsMarks:req.body.inputPhyMarks, 
      		EnglishMarks:req.body.inputEngMarks  };

    jsonfile.writeFile(jsonFile, response, {flag: 'a'},{spaces:'\n'}, function (err) {console.error(err) })

    var csvContent = json2csv.convert(response,["Name","RollNumber","BirthDate","MathMarks","ChemistryMarks","PhysicsMarks","EnglishMarks"],true)
    fs.writeFile(csvFile,csvContent , {Flag: 'a'}, {spaces:'\n'}, function (err) {console.error(err) })

    
  console.log(response);
  res.redirect('ShowData.html');
})




var server = app.listen(3999, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Student Data app listening at http://%s:%s", host, port)

})
