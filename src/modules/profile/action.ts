import axios from 'axios';

const uploadImage = (image: any) => {
    console.log('image',image)
  const upload = new FormData();
  upload.append('file', image);
  upload.append('cloud_ame', 'dezx0edl7');
  upload.append('upload_preset', 'Whatsapp_Images');
  upload.append('api_key', 687967117332317);

  console.log('action called', upload);

    // axios
    //   .post('https://api.cloudinary.com/v1_1/dezx0edl7/upload', {upload})
    //   .then(resp => {
    //     console.log('uploaded', resp);
    //   })
    //   .catch(err => {
    //     console.log('erropr occured', err);
    //   });

};
export default uploadImage;
