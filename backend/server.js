const express = require("express"),
    bodyParser = require("body-parser"),
    aws = require('aws-sdk');


if(process.env.NODE_ENV == 'development'){
	require('dotenv').config();
}

const S3_BUCKET = process.env.S3_BUCKET;


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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next()
});

// starts the app listening for requests
app.listen(PORT, function () {
	console.log(
		"\n\n===== listening for requests on port " + PORT + " =====\n\n"
    )
})
app.get("/s3/params", (req, res, next)=>{
   
    const s3 = new aws.S3({accessKeyId: process.env.S3_KEY_ID,
        secretAccessKey: process.env.S3_SECRET });
    const fileName = req.query['filename'];
    const fileType = req.query['filetype'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            return res.end();
        }
        const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });

})

app.get("*", (req, res, next)=>{
    next()
})
