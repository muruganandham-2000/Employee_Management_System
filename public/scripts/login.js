document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var email = document.getElementById('Email').value;
  var psword = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: psword })
  })
  .then(response => {
    if (response.status === 401) {
      return { authenticated: false };
    }
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    console.log(data);
    if (data.authenticated) {
      if (data.isAdmin) {
        window.location.href = '/home.html';
      } else {
        window.location.href = '/user.html';
      }
    } else {
      alert('Invalid Username or Password!');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });  
});
