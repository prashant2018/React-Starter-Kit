const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const Zip = require('jszip');
const archiver = require('archiver');


const app = express();
const port = 3000;
var zip = new Zip();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json());  

app.get('/', (req, res) => {
    getReactApp("New-React-App", res);
});

app.post('/reactapp', (req, res) => {
    name = req.body['name'];
    getReactApp(name, res);
});

function getReactApp(name, res){
    var fileName = __dirname + '/zipfiles/' + name + '.zip';
    var output = fs.createWriteStream(fileName);
    var archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.download(fileName);
    });

    archive.pipe(output);
    archive.append(fs.readFileSync('assets/package.json').toString().replace('react-starter-kit-placeholder',name), { name: 'package.json' });
    archive.directory('assets/react_start_app/', false);
    archive.finalize();
}

app.listen(port, () => console.log(`Listening on port ${port}!`))