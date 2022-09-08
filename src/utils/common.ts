import axios from 'axios';

export const uploadImage = (image: any, success: any) => {
  console.log('image', image);
  const upload = new FormData();
  upload.append('file', image);
  upload.append('folder', 'profiles');
  upload.append('cloud_name', 'dezx0edl7');
  upload.append('upload_preset', 'Whatsapp_Images');
  upload.append('api_key', 687967117332317);
  upload.append('timestamp', (Date.now() / 1000) | 0);
  upload.append('hieght', 150);
  upload.append('width', 150);

  console.log('action called', upload);

  axios
    .post('https://api.cloudinary.com/v1_1/dezx0edl7/upload', upload, {
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then(resp => {
      console.log('uploaded', resp);
      let url = resp?.data?.secure_url;
      success(url);
    })
    .catch(err => {
      console.log('erropr occured', err);
    });
};

export const randomChatID = () => {
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(0, 5) +
    '-' +
    Math.random().toString(36).slice(0, 5) +
    '-' +
    Math.random().toString(36).slice(0, 5) +
    '-' +
    Math.random().toString(36)
  ).replace(/\./g, '');
};

export const randomIDGenerator = () => {
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(0, 5)
  ).replace(/\./g, '');
};
