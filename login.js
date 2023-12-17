document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    var usrname = document.getElementById('username').value;
    var psword = document.getElementById('password').value;
  
    // Send login credentials to the server
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: usrname, password: psword })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      if (data.authenticated) {
        // User authenticated - Redirect to the main screen
        window.location.href = 'http://127.0.0.1:8080';
      } else {
        // Invalid credentials
        document.getElementById('error-message').style.display = 'block';
        alert('Login failed. Response: ' + JSON.stringify(data)); // Display response body in alert
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
