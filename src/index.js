import React from "react";
import ReactDOM from "react-dom";
import './style.scss';
import Dashboard from 'uppy/lib/react/Dashboard';



const Uppy = require('uppy/lib/core')
const AwsS3 = require('uppy/lib/plugins/AwsS3')
const ms = require('ms')


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
.use(AwsS3, {
  limit: 2,
  timeout: ms('1 minute'),
  host: 'http://localhost:3000'
})

uppy.on('upload-success', (file, data) => {
  file.meta['key'] // the S3 object key of the uploaded file
  console.log('what')
})

class UppyDashboardComponent extends React.Component {

	render(){

		return <Dashboard uppy={uppy}
	
			trigger= '.UppyModalOpenerBtn'
			inline= {true}
			target= '.DashboardContainer'
			replaceTargetContent= {true}
			showProgressDetails= {true}
			note= 'Images and video only, 2–3 files, up to 1 MB'
			height= {470}
			metaFields= {[
				{ id: 'name', name: 'Name', placeholder: 'file name' },
				{ id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
			]}
		
		/>

	}

}

const Index = () => {
  return <div className="DashboardContainer"><UppyDashboardComponent /></div>;
};

ReactDOM.render(<Index />, document.getElementById("index"));



// const Uppy = require('uppy/lib/core')
// const Tus = require('uppy/lib/plugins/Tus')
// const DragDrop = require('uppy/lib/react/DragDrop')

// const uppy = Uppy({
//   meta: { type: 'avatar' },
//   restrictions: { maxNumberOfFiles: 1 },
//   autoProceed: true
// })

// uppy.use(Tus, { endpoint: '/upload' })

// uppy.on('complete', (result) => {
//   const url = result.successful[0].uploadURL
//   store.dispatch({
//     type: SET_USER_AVATAR_URL,
//     payload: { url: url }
//   })
// })

// const AvatarPicker = ({ currentAvatar }) => {
//   return (
//     <div>
//       <img src={currentAvatar} alt="Current Avatar" />
//       <DragDrop
//         uppy={uppy}
//         locale={{
//           strings: {
//             chooseFile: 'Pick a new avatar'
//           }
//         }}
//       />
//     </div>
//   )
//}