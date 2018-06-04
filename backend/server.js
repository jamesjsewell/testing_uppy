const express = require("express"),
    bodyParser = require("body-parser"),
    aws = require('aws-sdk'),
    uppy = require('uppy-server'),
    ms = require('ms'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf')


if(process.env.NODE_ENV == 'development'){
	require('dotenv').config();
}

const S3_BUCKET = process.env.S3_BUCKET,
DATA_DIR = path.join(__dirname, 'tmp')


// runs express app and sets defined port
var app = express()
const PORT = process.env.PORT || 3000 
// app.set("port", PORT)

// middleware, transforms http request so that you can use req.body json format 
// for accepting json data from http requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.all('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next()
});

const options = {
    providerOptions: {
    
      s3: {
        getKey: (req, filename) => filename,
        key: process.env.S3_KEY_ID,
        secret: process.env.S3_SECRET,
        bucket: S3_BUCKET,
        region: 'us-east-1'
      }
    },
    filePath: DATA_DIR,
    debug: true,
    secret: "lolol",
    server: {
        host: "localhost:3000", // or yourdomain.com
        protocol: "http"
    }
}

// Create the data directory here for the sake of the example.
try {
    fs.accessSync(DATA_DIR)
  } catch (err) {
    fs.mkdirSync(DATA_DIR)
  }
  process.on('exit', function () {
    rimraf.sync(DATA_DIR)
  })

app.use(uppy.app(options))

// //starts the app listening for requests
// app.listen(PORT, function () {
// 	console.log(
// 		"\n\n===== listening for requests on port " + PORT + " =====\n\n"
//     )
// })

const server = app.listen(3000, () => {
    console.log('listening on port 3000')
})
  
uppy.socket(server, options)


// app.get("/s3/params", (req, res, next)=>{
//     console.log(process.env.S3_KEY_ID, process.env.S3_SECRET)
//     const s3 = new aws.S3({accessKeyId: process.env.S3_KEY_ID,
//     secretAccessKey: process.env.S3_SECRET, region: 'us-east-1'}),
//     fileName = req.query['filename'],
//     fileType = req.query['filetype']
//     s3Params = {
//         Bucket: S3_BUCKET,
//         Key: fileName,
//         Expires: 120,
//         ContentType: fileType,
//         ACL: 'public-read'
//     };

//     s3.getSignedUrl('putObject', s3Params, (err, data) => {
//         console.log('data', data)
//         if(err){
//             return res.end();
//         }
//         const returnData = {
//             signedRequest: data,
//             url: `https://${S3_BUCKET}.s3.us-east-1.amazonaws.com/${fileName}`,
//             url: data,
//             fields: [],
//             method: 'POST',
//             headers: []
//         }
//         res.status(201).json(returnData);
//         //res.write(JSON.stringify(returnData));
//         res.end();
//     });

// })

// app.get("*", (req, res, next)=>{
//     next()
// })
