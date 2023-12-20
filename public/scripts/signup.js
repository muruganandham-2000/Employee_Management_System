document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.form');
  
    signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const newusername = document.getElementById('newusername').value;
      const newpassword = document.getElementById('newpassword').value;
  
      const formData = {
        fullname: fullname,
        email: email,
        username: newusername,
        password: newpassword
      };
  
      fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
        window.location.href = 'login.html';
      })
      .catch(error => {
        console.error('There was an error signing up:', error);
        if (error.message === 'Network response was not ok') {
          alert('There was a network issue. Please try again.');
        } else if (error.message === 'User already exists!') {
          alert('Username or email already exists. Please choose a different one.');
        } else {
          console.error('Unexpected error during signup:', error);
        }
      });
    });
  });
  