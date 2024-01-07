document.addEventListener('DOMContentLoaded', () => {
    fetch('/admin/faculties')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const tableBody = document.querySelector('.table-bordered tbody');
  
        data.forEach(user => {
          const row = document.createElement('tr');
  
          const nameCell = document.createElement('td');
          nameCell.textContent = user.name;
          row.appendChild(nameCell);
  
          const departmentCell = document.createElement('td');
          departmentCell.textContent = user.department;
          row.appendChild(departmentCell);
  
          const positionCell = document.createElement('td');
          positionCell.textContent = user.position;
          row.appendChild(positionCell);
  
          const contactCell = document.createElement('td');
          contactCell.textContent = user.phone;
          row.appendChild(contactCell);
  
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  