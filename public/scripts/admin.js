const eventSource = new EventSource('/admin/admin_dashboard');

eventSource.onmessage = function(event) {
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
    daysCell.textContent = record.days+ ' Days';
    row.appendChild(daysCell);

    tableBody.appendChild(row);
});

};

eventSource.onerror = function(error) {
  console.error('EventSource failed:', error);
};





