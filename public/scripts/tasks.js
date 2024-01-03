document.addEventListener('DOMContentLoaded', function () {
    fetch('/admin/tasks/today') // Adjust the endpoint to match your backend
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the data received
            const tasks = data.tasks || []; // Ensure tasks is initialized correctly
            renderTasks(tasks); // Render tasks in your UI
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            renderTasks([]); // Render an empty list in case of an error
        });

    // Rest of your code...
});


function renderTasks(tasks) {
    const listWrapper = document.querySelector('.todo-list');

    // Clear existing tasks before rendering
    listWrapper.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.taskId = task.id;

        listItem.innerHTML = `
            <div class="form-check">
                <input type="checkbox" class="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>${task.task_name}
                <label class="form-check-label">
                </label>
            </div>
            <i class="remove mdi mdi-close-circle-outline" data-taskId="${task.id}"></i>
        `;

        listWrapper.appendChild(listItem);
    });

    // Event delegation to handle remove icon click events
    listWrapper.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove')) {
            const taskId = event.target.getAttribute('data-taskId');

            if (!taskId) {
                console.error('Task ID is missing.');
                return;
            }

            fetch(`/admin/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Task ${taskId} deleted successfully`);
                // Re-fetch and re-render the tasks here after deletion if needed
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
        }
    });
}



document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-task');
    const inputField = document.querySelector('.todo-list-input');
    const listWrapper = document.querySelector('.todo-list');
    let currentTaskId = null; // Variable to store the current taskId

    addButton.addEventListener('click', function() {
        const taskName = inputField.value.trim();
        if (taskName !== '') {
            fetch('/admin/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskName }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                inputField.value = ''; // Clear input after successful response
                console.log('Task added:', data);

                if (data && data.task !== undefined && data.taskId !== undefined) {
                    currentTaskId = data.taskId; // Store the taskId for future use
                    const listItem = document.createElement('li');
                    listItem.dataset.taskId = currentTaskId;

                    listItem.innerHTML = `
                        <div class="form-check">
                            <label class="form-check-label">
                                <input class="checkbox" type="checkbox">${data.task}
                            </label>
                        </div>
                        <i class="remove mdi mdi-close-circle-outline"></i>
                    `;
                    listWrapper.querySelector('.todo-list').appendChild(listItem);
                } else {
                    console.error('Error: Invalid task data received from the server.');
                }
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
        }
    });

    // Event delegation to handle checkbox click events
    listWrapper.addEventListener('change', function(event) {
        if (event.target.classList.contains('checkbox')) {
            const checkbox = event.target;
            const listItem = checkbox.closest('li');
            const taskId = listItem.dataset.taskId || currentTaskId; // Use currentTaskId if taskId is not available

            if (!taskId) {
                console.error('Error: Task ID is missing.');
                return;
            }

            const completed = checkbox.checked;

            fetch(`/admin/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Task updated:', data);
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
        }
    });
});


