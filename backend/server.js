const express = require("express"),
    bodyParser = require("body-parser"),
    aws = require('aws-sdk'),
    uppy = require('uppy-server'),
    ms = require('ms'),
    path = require('path')


if(process.env.NODE_ENV == 'development'){
	require('dotenv').config();
}

const S3_BUCKET = process.env.S3_BUCKET,
    S3_REGION = process.env.S3_REGION,
    S3_KEY_ID = process.env.S3_KEY_ID,
    S3_SECRET = process.env.S3_SECRET,
    DATA_DIR = path.join(__dirname, 'tmp'),
    SERVER_HOST = process.env.SERVER_HOST,
    SERVER_PROTOCOL = process.env.SERVER_PROTOCOL,
    UPPY_SECRET = process.env.UPPY_SECRET,
    SHOULD_DEBUG = process.env.SHOULD_DEBUG


// runs express app and sets defined port
var app = express()
const PORT = process.env.PORT || 3000 

// middleware, transforms http request so that you can use req.body json format 
// for accepting json data from http requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.all('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});

const options = {

    providerOptions: {
    
        s3: {

            getKey: (req, filename) => filename,
            key: S3_KEY_ID,
            secret: S3_SECRET,
            bucket: S3_BUCKET, 
            region: S3_REGION//'us-east-1'

        }

    },
    filePath: DATA_DIR,
    debug: SHOULD_DEBUG === 'true' ? true : false,
    secret: UPPY_SECRET,
    server: {

        host: SERVER_HOST, // or yourdomain.com
        protocol: SERVER_PROTOCOL //"http"

    }

}

app.use(uppy.app(options))

const server = app.listen(3000, () => {
    console.log('listening on port 3000')
})
  
uppy.socket(server, options)


