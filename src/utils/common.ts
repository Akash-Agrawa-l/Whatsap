import axios from 'axios';

export const uploadImage = (image: any,success:any) => {
    console.log('image',image)
  const upload = new FormData();
  upload.append('file', image);
  upload.append('folder','profiles')
  upload.append('cloud_name', 'dezx0edl7');
  upload.append('upload_preset', 'Whatsapp_Images');
  upload.append('api_key', 687967117332317);
  upload.append('timestamp', (Date.now() / 1000) | 0);

  console.log('action called', upload);

    axios
      .post('https://api.cloudinary.com/v1_1/dezx0edl7/upload', upload,{
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(resp => {
        console.log('uploaded', resp);
        success(resp.data)
      })
      .catch(err => {
        console.log('erropr occured', err);
      });

};
