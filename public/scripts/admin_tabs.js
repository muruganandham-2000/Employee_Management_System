document.addEventListener('DOMContentLoaded', function() {
    fetch('/admin/user_details')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched Data:', data); // Add this line to log fetched data
  
        const profileImage = document.querySelector('.nav-profile-image img');
        profileImage.src = `../../uploads/${data.profile_image}`;
        profileImage.alt = 'profile';
  
        const adminName = document.querySelector('.nav-profile-text .font-weight-bold');
        adminName.textContent = data.name;
  
        const profileImage2 = document.querySelector('.nav-profile-img img');
        profileImage2.src = `../../uploads/${data.profile_image}`;
        profileImage2.alt = 'image';
  
        const adminName2 = document.querySelector('.nav-profile-text p');
        adminName2.textContent = data.name;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  
  
  // This is for user activity to show online and offline
  let isOnline = true;
  
  const availabilityStatus = document.querySelector('.availability-status');
  
  function setOnlineStatus(status) {
    availabilityStatus.classList.toggle('online', status);
    availabilityStatus.classList.toggle('offline', !status);
  }
  
  function setUserOnline() {
    if (!isOnline) {
      isOnline = true;
      setOnlineStatus(true);
    }
  }
  
  function setUserOffline() {
    if (isOnline) {
      isOnline = false;
      setOnlineStatus(false);
    }
  }
  
  let activityTimer;
  
  function resetActivityTimer() {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(setUserOffline, 5 * 60 * 1000);
  }
  
  
  document.addEventListener('mousemove', function() {
    setUserOnline();
    resetActivityTimer();
  });
  
  
  setOnlineStatus(true);
  resetActivityTimer();
    