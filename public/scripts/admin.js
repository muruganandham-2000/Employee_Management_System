const eventSource = new EventSource('/admin/admin_dashboard');
let sessionExpired = false;

eventSource.onmessage = function(event) {
  if (sessionExpired) {
    eventSource.close();
    return;
  }

  const data = JSON.parse(event.data);

  // Update Available Faculties count
  const availableFacultiesElement = document.getElementById('available-faculties');
  availableFacultiesElement.textContent = data.Available_Faculty + ' Faculties';

  // Update Leave Requests count
  const leaveRequestsElement = document.getElementById('leave-requests');
  leaveRequestsElement.textContent = data.Leave_Request + ' Requests';

  const presentPercentageElement = document.getElementById('present-percentage');
  presentPercentageElement.textContent = data.Present_Percentage + '% Present Today';

  const leaveApproved = document.getElementById('leave-approved');
  leaveApproved.textContent = data.Leave_Approved + ' Approved';

  const leaveHistory = data.Leave_History;

  const tableBody = document.getElementById('leaveHistoryBody');
  tableBody.innerHTML = '';

  leaveHistory.forEach(record => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = `../uploads/${record.profile_image}`;
    img.classList.add('me-2');
    img.alt = 'image';
    nameCell.appendChild(img);
    nameCell.appendChild(document.createTextNode(record.name));
    row.appendChild(nameCell);

    const reasonCell = document.createElement('td');
    reasonCell.textContent = record.reason;
    row.appendChild(reasonCell);

    const statusCell = document.createElement('td');
    const statusText = document.createElement('span');
    statusText.textContent = record.status || 'Progress';

    statusText.classList.add('badge-gradient-text');
    if (record.status === 'Approved') {
      statusText.classList.add('badge-gradient-Approved');
    } else if (record.status === 'On-hold') {
      statusText.classList.add('badge-gradient-Onhold');
    } else if (record.status === 'Rejected') {
      statusText.classList.add('badge-gradient-Rejected');
    } else {
      statusText.classList.add('badge-gradient-Progress');
    }

    statusCell.appendChild(statusText);
    row.appendChild(statusCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = record.date;
    row.appendChild(dateCell);

    const daysCell = document.createElement('td');
    daysCell.textContent = record.days + ' Days';
    row.appendChild(daysCell);

    tableBody.appendChild(row);
  });

};

eventSource.onerror = function(error) {
  console.error('EventSource failed:', error);

  if (error.status === 401 || error.message.toLowerCase().includes('unauthorized')) {
    sessionExpired = true;
    alert('Session has expired. Please log in again.');
    eventSource.close();
    window.location.href = '/index.html'; 
  } else {
    alert('Connection error. Please try again.');
  }
};


setInterval(function() {
  if (sessionExpired) {
    return;
  }

  fetch('/admin/check_session')
    .then(response => {
      if (response.status === 401) {
        sessionExpired = true;
        alert('Session has expired. Please log in again.');
        eventSource.close();
        window.location.href = '/index.html';
      }
    })
    .catch(error => {
      console.error('Error checking session:', error);
    });
}, 30000);

//For dashboard
document.addEventListener('DOMContentLoaded', function() {
    fetch('/admin/user_details')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const profileImage1 = document.getElementById('profileImage');
        profileImage1.src = `./uploads/${data.profile_image}`;
        profileImage1.alt = 'profile';
  
        const adminName1 = document.querySelector('.nav-profile-text .font-weight-bold');
        adminName1.textContent = data.name;
  
        const profileImage2 = document.getElementById('profileImage2');
        profileImage2.src = `./uploads/${data.profile_image}`;
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
  