const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const archiver = require('archiver');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());  

app.get('/', (req, res) => {
    getReactApp("New-React-App", res);
});

app.get('/reactapp', (req, res) => {
    name = req.query.name;
    fileName = name+'.zip';
    res.writeHead(200,'Ok',{ 'Content-Type': 'application/zip','Content-disposition': 'attachment; filename='+fileName})
    getReactApp(name, res);
});

function getReactApp(name, res){
    var zip = archiver('zip');
    zip.pipe(res);
    zip.append(fs.readFileSync('assets/package.json').toString().replace('react-starter-kit-placeholder',name), { name: 'package.json' });
    zip.directory('assets/react_start_app/', false);
    zip.finalize();
}

app.listen(port, () => console.log(`Listening on port ${port}!`))