const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const archiver = require('archiver');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.json());  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/api', (req, res) => {
    console.log(req.query);
    name = req.query.name;
    if(!name)
        name = "demo"
    archive_type = req.query.archive_type;
    name = name.split(' ').join('-');
    
    if (archive_type=='Zip')
        getReactAppZip(name, res);
    else if(archive_type=='Tar')
        getReactAppTar(name, res);

});

function getReactAppZip(name, res){
    fileName = name+'.zip';
    res.writeHead(200,'Ok',{ 'Content-Type': 'application/zip','Content-disposition': 'attachment; filename='+fileName})

    var zip = archiver('zip');
    zip.pipe(res);
    zip.append(fs.readFileSync('assets/package.json').toString().replace('react-starter-kit-placeholder',name), { name: 'package.json' });
    zip.directory('assets/react_start_app/', false);
    zip.finalize();
}

function getReactAppTar(name, res){
    fileName = name+'.tar';
    res.writeHead(200,'Ok',{ 'Content-Type': 'application/zip','Content-disposition': 'attachment; filename='+fileName})

    var tar = archiver('tar');
    tar.pipe(res);
    tar.append(fs.readFileSync('assets/package.json').toString().replace('react-starter-kit-placeholder',name), { name: 'package.json' });
    tar.directory('assets/react_start_app/', false);
    tar.finalize();
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))