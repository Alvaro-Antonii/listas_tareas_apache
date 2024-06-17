document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskPopup = document.getElementById('task-popup');
    const newTaskButton = document.getElementById('new-task-button');
    const closePopup = document.getElementById('close-popup');
    const popupTitle = document.getElementById('popup-title');

    // Abrir modal para nueva tarea
    newTaskButton.addEventListener('click', function() {
        openTaskPopup();
    });

    // Manejar el formulario de tareas
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = document.getElementById('title').value;
        const datetime = document.getElementById('datetime').value;
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').files[0];

        if (title && datetime && description) {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card card mb-3';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const taskInfo = document.createElement('div');
            taskInfo.className = 'task-info';
            taskInfo.innerHTML = `
                <h5 class="card-title">${title}</h5>
                <p class="card-text"><strong>Fecha:</strong> ${new Date(datetime).toLocaleString()}</p>
                <p class="card-text"><strong>Descripción:</strong> ${description}</p>
            `;

            if (image) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'card-img-top';
                    taskCard.insertBefore(img, cardBody);
                };
                reader.readAsDataURL(image);
            }

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Actualizar';
            updateButton.className = 'btn btn-primary';
            updateButton.addEventListener('click', function() {
                openUpdatePopup(taskCard, title, datetime, description, image);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'btn btn-danger ml-2';
            deleteButton.addEventListener('click', function() {
                document.getElementById('tasks').removeChild(taskCard);
            });

            cardBody.appendChild(taskInfo);
            cardBody.appendChild(updateButton);
            cardBody.appendChild(deleteButton);
            taskCard.appendChild(cardBody);

            document.getElementById('tasks').appendChild(taskCard);

            // Verificar la fecha y hora de la tarea
            checkTask(taskCard, datetime);

            // Limpiar el formulario y cerrar el popup
            taskForm.reset();
            taskPopup.style.display = 'none';
        }
    });

    // Abrir el modal con datos desde las tarjetas expansibles
    document.querySelectorAll('.expandable-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = card.getAttribute('data-title');
            const image = card.getAttribute('data-image');
            openTaskPopup(title, image);
        });
    });

    // Cerrar el modal
    closePopup.onclick = function() {
        taskPopup.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === taskPopup) {
            taskPopup.style.display = 'none';
        }
    };

    function openTaskPopup(title = '', image = '') {
        document.getElementById('title').value = title;
        document.getElementById('image').value = '';
        popupTitle.textContent = title ? 'Crear Tarea desde "' + title + '"' : 'Crear Tarea';
        taskPopup.style.display = 'block';
    }

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

    function openUpdatePopup(taskCard, title, datetime, description, image) {
        const popup = document.getElementById('update-popup');
        const updateForm = document.getElementById('update-form');

        document.getElementById('update-title').value = title;
        document.getElementById('update-datetime').value = datetime;
        document.getElementById('update-description').value = description;
        document.getElementById('update-image').value = '';

        popup.style.display = 'block';

        updateForm.onsubmit = function(event) {
            event.preventDefault();

            const updatedTitle = document.getElementById('update-title').value;
            const updatedDatetime = document.getElementById('update-datetime').value;
            const updatedDescription = document.getElementById('update-description').value;
            const updatedImage = document.getElementById('update-image').files[0];

            const taskInfo = taskCard.querySelector('.task-info');
            taskInfo.innerHTML = `
                <h5 class="card-title">${updatedTitle}</h5>
                <p class="card-text"><strong>Fecha:</strong> ${new Date(updatedDatetime).toLocaleString()}</p>
                <p class="card-text"><strong>Descripción:</strong> ${updatedDescription}</p>
            `;

            if (updatedImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = taskCard.querySelector('img');
                    if (img) {
                        img.src = e.target.result;
                    } else {
                        const newImg = document.createElement('img');
                        newImg.src = e.target.result;
                        newImg.className = 'card-img-top';
                        taskCard.insertBefore(newImg, taskInfo);
                    }
                };
                reader.readAsDataURL(updatedImage);
            }

            popup.style.display = 'none';

            // Actualizar la verificación de la fecha y hora
            checkTask(taskCard, updatedDatetime);
        }
    }
});
