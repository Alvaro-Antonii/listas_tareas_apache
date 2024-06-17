document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskPopup = document.getElementById('task-popup');
    const newTaskButton = document.getElementById('new-task-button');
    const closePopup = document.getElementById('close-popup');
    const popupTitle = document.getElementById('popup-title');
    const tasksContainer = document.getElementById('tasks'); // Contenedor de las tareas

    var taskList = document.getElementById("task-list");
    var toggleButton = document.getElementById("toggle-button");
    taskList.style.display = "none";
    // Agregar evento click al botón
    toggleButton.addEventListener("click", function() {
        // Alternar la visibilidad de la lista de tareas
        if (taskList.style.display === "none") {
            taskList.style.display = "block";
        } else {
            taskList.style.display = "none";
        }
    });




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
            // Eliminar la tarjeta existente si hay una con el mismo título (actualización)
            const existingCard = tasksContainer.querySelector(`.task-card[data-title="${title}"]`);
            if (existingCard) {
                tasksContainer.removeChild(existingCard);
            }

            // Crear la nueva tarjeta
            const taskCard = createTaskCard(title, datetime, description, image);
            tasksContainer.appendChild(taskCard);

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

    function createTaskCard(title, datetime, description, image) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card card mb-3';
        taskCard.setAttribute('data-title', title); // Añadir atributo data-title

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
            tasksContainer.removeChild(taskCard);
        });

        cardBody.appendChild(taskInfo);
        cardBody.appendChild(updateButton);
        cardBody.appendChild(deleteButton);
        taskCard.appendChild(cardBody);

        // Verificar la fecha y hora de la tarea
        checkTask(taskCard, datetime);

        return taskCard;
    }

    function openUpdatePopup(taskCard, title, datetime, description, image) {
        // Prellenar los campos del formulario con los datos de la tarea a modificar
        document.getElementById('title').value = title;
        document.getElementById('datetime').value = datetime;
        document.getElementById('description').value = description;

        // Limpiar el campo de imagen por razones de seguridad
        document.getElementById('image').value = '';

        // Configurar el título del popup
        popupTitle.textContent = 'Actualizar Tarea';

        // Mostrar el popup
        taskPopup.style.display = 'block';

        // Desactivar el evento de envío del formulario para evitar creación duplicada al cerrar el popup
        taskForm.onsubmit = function(event) {
            event.preventDefault();
            // No hacer nada aquí, solo desactivamos el evento submit
        };

        // Manejar el envío del formulario para actualizar la tarea
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Actualizar';
        updateButton.className = 'btn btn-primary';
        updateButton.addEventListener('click', function() {
            const updatedTitle = document.getElementById('title').value;
            const updatedDatetime = document.getElementById('datetime').value;
            const updatedDescription = document.getElementById('description').value;
            const updatedImage = document.getElementById('image').files[0];

            // Eliminar la tarjeta existente
            tasksContainer.removeChild(taskCard);

            // Crear la nueva tarjeta actualizada
            const updatedTaskCard = createTaskCard(updatedTitle, updatedDatetime, updatedDescription, updatedImage);
            tasksContainer.appendChild(updatedTaskCard);

            // Cerrar el popup de actualización
            taskPopup.style.display = 'none';

            // Limpiar el formulario después de cerrar el popup
            taskForm.reset();
        });
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
});
