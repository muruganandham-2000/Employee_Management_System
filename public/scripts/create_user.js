document.addEventListener('DOMContentLoaded', function() {
  const uploadButton = document.getElementById('uploadButton');
  const fileInput = document.getElementById('photoUpload');
  const fileUploadInfo = document.querySelector('.file-upload-info');

  uploadButton.addEventListener('click', function() {
    fileInput.click(); 
  });

  fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
      const filename = fileInput.files[0].name; 
      fileUploadInfo.value = filename;
    } else {
      fileUploadInfo.value = ''; 
    }
  });

  const createUser = document.querySelector('.forms-sample');

  createUser.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a photo to upload.');
      return;
    }
    formData.append('photo', file);
  
      const name = document.getElementById('Name').value;
      const email = document.getElementById('Email').value;
      const password = document.getElementById('Password').value; 
      const gender = document.getElementById('Gender').value; 
      const experience = document.getElementById('Experience').value; 
      const phone = document.getElementById('Phone').value; 
      const qualification = document.getElementById('Degree').value;
      const specialization = document.getElementById('Specialization').value;
      const position = document.getElementById('Position').value;
      const address = document.getElementById('Address').value;
      
    
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('gender', gender);
      formData.append('experience', experience);
      formData.append('phone', phone);
      formData.append('qualification', qualification);
      formData.append('department', specialization);
      formData.append('position', position);
      formData.append('address', address);
      formData.append('role', 'user');
      
  
      fetch('/admin/create_user', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        body: formData
      })
      .then(response => {
        if (response.status === 400) {
          throw new Error('User already exists!');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        alert('User has been created successfully!');
        //window.location.href = 'Create_User.html';
        document.getElementById('createUser').reset();
      })
      .catch(error => {
        console.error('There was an error signing up:', error);
        if (error.message === 'Network response was not ok') {
          alert('There was a network issue. Please try again.');
        } else if (error.message === 'User already exists!') {
          alert('User already exists!');
        } else {
          console.error('Unexpected error during signup:', error);
        }
      });
    });

  const cancelButton = document.querySelector('.btn-light');
  cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('createUser').reset();
  });

});
  