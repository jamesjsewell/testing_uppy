import React from "react";
import ReactDOM from "react-dom";
import './style.scss';
import example from './example/example_module.js'

const Index = () => {
  return <div className="DashboardContainer"></div>;
};

ReactDOM.render(<Index />, document.getElementById("index"));

const Uppy = require('uppy/lib/core')
const Dashboard = require('uppy/lib/plugins/Dashboard')
const AwsS3 = require('uppy/lib/plugins/AwsS3')
const ms = require('ms')

const Tus = require('uppy/lib/plugins/Tus')


const uppy = Uppy({
  debug: true,
  autoProceed: false,
  restrictions: {
    maxFileSize: 1000000,
    maxNumberOfFiles: 3,
    minNumberOfFiles: 1,
    allowedFileTypes: ['image/*', 'video/*']
  }
})
.use(Dashboard, {
  trigger: '.UppyModalOpenerBtn',
  inline: true,
  target: '.DashboardContainer',
  replaceTargetContent: true,
  showProgressDetails: true,
  note: 'Images and video only, 2–3 files, up to 1 MB',
  height: 470,
  metaFields: [
    { id: 'name', name: 'Name', placeholder: 'file name' },
    { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
  ]
}).use(AwsS3, {
  limit: 2,
  timeout: ms('1 minute'),
  host: 'http://localhost:3000'
})

uppy.on('upload-success', (file, data) => {
  file.meta['key'] // the S3 object key of the uploaded file
  console.log('what')
})


// uppy.use(AwsS3, {
//   getUploadParameters (file) {
//     // Send a request to our PHP signing endpoint.
//     return fetch('/s3-sign.php', {
//       method: 'post',
//       // Send and receive JSON.
//       headers: {
//         accept: 'application/json',
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify({
//         filename: file.name,
//         contentType: file.type
//       })
//     }).then((response) => {
//       // Parse the JSON response.
//       return response.json()
//     }).then((data) => {
//       // Return an object in the correct shape.
//       return {
//         method: data.method,
//         url: data.url,
//         fields: data.fields
//       }
//     })
//   }
// })
