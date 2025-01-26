const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get("/", (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading directory.");
        } else {
            res.render("index", { files: files });
        }
    });
});


// Route to create a file
app.post("/create", (req, res) => {
    const filepath = `./files/${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(filepath, req.body.details, (err) => {
            res.redirect("/");
        
    });
});

// Route to view a specific file
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename.trim(); // Trim spaces
    const filepath = path.join(__dirname, 'files', filename);

    fs.readFile(filepath, "utf-8", (err, filedata) => {
        if (err) {
            console.error(`Error reading file at ${filepath}:`, err.message);
            return res.status(404).send("File not found");
        }
        console.log({ filename, filedata }); // Log trimmed filename and data
        res.render('show', { filename, filedata });
    });
});

app.get('/edit/:filename',(req,res)=>{
    res.render('edit',{filename: req.params.filename});
})

app.post('/edit',(req,res)=>{
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,(err)=>{
        if(err){
            console.error(err);
        }
        else{
            res.redirect("/");
        }
    })
    
})

// Start the server
app.listen(3000);
