document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const datetime = document.getElementById('datetime').value;
    const description = document.getElementById('description').value;

    if (title && datetime && description) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Fecha:</strong> ${new Date(datetime).toLocaleString()}</p>
            <p><strong>Descripción:</strong> ${description}</p>
        `;

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Actualizar';
        updateButton.className = 'update';
        updateButton.addEventListener('click', function() {
            openUpdatePopup(taskCard, title, datetime, description);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', function() {
            document.getElementById('tasks').removeChild(taskCard);
        });

        taskCard.appendChild(taskInfo);
        taskCard.appendChild(updateButton);
        taskCard.appendChild(deleteButton);
        document.getElementById('tasks').appendChild(taskCard);

        // Verificar la fecha y hora de la tarea
        checkTask(taskCard, datetime);

        // Limpiar el formulario
        document.getElementById('task-form').reset();
    }
});

function checkTask(taskCard, datetime) {
    const interval = setInterval(() => {
        const now = new Date();
        const taskTime = new Date(datetime);

        if (now >= taskTime) {
            taskCard.classList.add('due');
            clearInterval(interval);
        }
    }, 1000); // Verificar cada segundo
}

function openUpdatePopup(taskCard, title, datetime, description) {
    const popup = document.getElementById('update-popup');
    const updateForm = document.getElementById('update-form');

    document.getElementById('update-title').value = title;
    document.getElementById('update-datetime').value = datetime;
    document.getElementById('update-description').value = description;

    popup.style.display = 'block';

    updateForm.onsubmit = function(event) {
        event.preventDefault();

        const updatedTitle = document.getElementById('update-title').value;
        const updatedDatetime = document.getElementById('update-datetime').value;
        const updatedDescription = document.getElementById('update-description').value;

        const taskInfo = taskCard.querySelector('.task-info');
        taskInfo.innerHTML = `
            <h3>${updatedTitle}</h3>
            <p><strong>Fecha:</strong> ${new Date(updatedDatetime).toLocaleString()}</p>
            <p><strong>Descripción:</strong> ${updatedDescription}</p>
        `;

        popup.style.display = 'none';

        // Actualizar la verificación de la fecha y hora
        checkTask(taskCard, updatedDatetime);
    }
}

document.getElementById('close-popup').onclick = function() {
    document.getElementById('update-popup').style.display = 'none';
}

window.onclick = function(event) {
    const popup = document.getElementById('update-popup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
}
