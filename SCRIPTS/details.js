document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('project-details');
    const objectivesList = document.getElementById('objectives-list');
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');

    // Crear contenedor para miembros del proyecto
    const membersContainer = document.createElement('div');
    membersContainer.className = 'members-container';
    membersContainer.innerHTML = `
        <h2>Miembros del Proyecto</h2>
        <div class="members-management">
            <div class="members-list" id="projectMembers"></div>
            <div class="members-selector">
                <select id="memberSelect" multiple>
                    <!-- Se llenará dinámicamente -->
                </select>
                <button id="addMemberBtn">Agregar Miembro</button>
            </div>
        </div>
    `;
    
    // Insertar el contenedor de miembros después de los detalles del proyecto
    detailsContainer.parentNode.insertBefore(membersContainer, detailsContainer.nextSibling);

    // Función para cargar todos los usuarios disponibles
    function loadAvailableUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.id === projectID);
        const select = document.getElementById('memberSelect');
        
        if (!select) return;
        
        select.innerHTML = '';
        
        // Filtrar usuarios que no son miembros actuales del proyecto
        const currentMembers = project.members || [];
        const availableUsers = users.filter(user => !currentMembers.includes(user.username));
        
        availableUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            select.appendChild(option);
        });
    
        // Restaurar la selección previa de los miembros
        restoreSelectedMembers(currentMembers);
    
        loadProjectMembers();
    }
    
    // Función para restaurar la selección de miembros
    function restoreSelectedMembers(currentMembers) {
        const select = document.getElementById('memberSelect');
        Array.from(select.options).forEach(option => {
            if (currentMembers.includes(option.value)) {
                option.selected = true; // Restaurar selección
            }
        });
    }
    
    // Función para restaurar la selección de miembros
    function restoreSelectedMembers(currentMembers) {
    const select = document.getElementById('memberSelect');
    Array.from(select.options).forEach(option => {
        if (currentMembers.includes(option.value)) {
            option.selected = true; // Restaurar selección
        }
    });
    }


    // Función para cargar los miembros actuales del proyecto
    function loadProjectMembers() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.id === projectID);
        const membersContainer = document.getElementById('projectMembers');
        
        if (!membersContainer) return;
        
        membersContainer.innerHTML = '';

        if (!project.members) {
            project.members = [];
            localStorage.setItem('projects', JSON.stringify(projects));
        }

        if (project.members.length > 0) {
            project.members.forEach(member => {
                const memberElement = document.createElement('div');
                memberElement.className = 'member-item';
                memberElement.innerHTML = `
                    <span class="member-name">${member}</span>
                    <button class="remove-member" data-username="${member}">×</button>
                `;
                membersContainer.appendChild(memberElement);
            });
        } else {
            membersContainer.innerHTML = '<div class="member-item">No hay miembros en este proyecto</div>';
        }

        document.querySelectorAll('.remove-member').forEach(button => {
            button.addEventListener('click', function() {
                removeMember(this.dataset.username);
            });
        });
    }

    // Función para añadir miembros al proyecto
    function addProjectMembers() {
    const select = document.getElementById('memberSelect');
    if (!select) return;

    const selectedUsers = Array.from(select.selectedOptions).map(option => option.value);

    if (selectedUsers.length === 0) {
        alert('Por favor, selecciona al menos un miembro');
        return;
    }

    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const projectIndex = projects.findIndex(p => p.id === projectID);

    if (projectIndex !== -1) {
        if (!projects[projectIndex].members) {
            projects[projectIndex].members = [];
        }

        selectedUsers.forEach(username => {
            if (!projects[projectIndex].members.includes(username)) {
                projects[projectIndex].members.push(username);
            }
        });
        
        // Guardar los miembros en localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        loadAvailableUsers();
        select.selectedIndex = -1;
    }
    }


    // Función para eliminar un miembro del proyecto
    function removeMember(username) {
        if (!username) return;

        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const projectIndex = projects.findIndex(p => p.id === projectID);

        if (projectIndex !== -1) {
            projects[projectIndex].members = projects[projectIndex].members.filter(
                member => member !== username
            );
            
            localStorage.setItem('projects', JSON.stringify(projects));
            loadAvailableUsers();
        }
    }

    // Event listener para el botón de añadir miembros
    const addMemberBtn = document.getElementById('addMemberBtn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', addProjectMembers);
    }

//--------------------------------------------------------//
    const addObjectiveForm = document.createElement('div');
    addObjectiveForm.className = 'objective-form';
    addObjectiveForm.innerHTML = `
        <input type="text" id="newObjective" placeholder="Nuevo objetivo...">
        <button id="addObjectiveBtn">Agregar Objetivo</button>
    `;
    objectivesList.parentNode.insertBefore(addObjectiveForm, objectivesList);

    // Función para añadir nuevos Objetivos
    function addNewObjective() {
        const newObjectiveInput = document.getElementById('newObjective');
        const objectiveText = newObjectiveInput.value.trim();
        
        if (objectiveText) {
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const projectIndex = projects.findIndex(project => project.id === projectID);
            
            if (projectIndex !== -1) {
                if (!projects[projectIndex].objectives) {
                    projects[projectIndex].objectives = [];
                }
                
                projects[projectIndex].objectives.push(objectiveText);
                localStorage.setItem('projects', JSON.stringify(projects));
                
                newObjectiveInput.value = '';
                
                refreshObjectivesList(projects[projectIndex].objectives);
            }
        }
    }

    // Función para eliminar Objetivos
    function removeObjective(index) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectIndex = projects.findIndex(project => project.id === projectID);
        
        if (projectIndex !== -1 && projects[projectIndex].objectives) {
            projects[projectIndex].objectives.splice(index, 1);
            localStorage.setItem('projects', JSON.stringify(projects));
            saveCheckboxState(projectID);
            refreshObjectivesList(projects[projectIndex].objectives);
        }
    }

    // Función para refrescar la lista de Objetivos
    function refreshObjectivesList(objectives) {
        objectivesList.innerHTML = '';
        if (objectives && objectives.length > 0) {
            objectives.forEach((objective, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <label>
                        <input type="checkbox" class="option" data-index="${index}"> ${objective}
                    </label>
                    <button class="delete-objective" data-index="${index}">×</button>
                `;
                objectivesList.appendChild(li);
            });
            restoreCheckboxState(projectID);
            const checkboxes = document.querySelectorAll('.option');
            const deleteButtons = document.querySelectorAll('.delete-objective');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    saveCheckboxState(projectID);
                    updateProgress();
                });
            });
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    removeObjective(index);
                });
            });

            updateProgress();
        } else {
            objectivesList.innerHTML = '<li>No se han añadido objetivos.</li>';
        }
    }

    // Función para guardar el estado de las cajas de los Objetivos
    function saveCheckboxState(projectID) {
        const checkboxes = document.querySelectorAll('.option');
        const checkboxStates = Array.from(checkboxes).map(checkbox => checkbox.checked);
        const projectCheckboxKey = `project_${projectID}_checkboxes`;
        localStorage.setItem(projectCheckboxKey, JSON.stringify(checkboxStates));
    }

    // Función para restaurar el estado de las cajas de los Objetivos
    function restoreCheckboxState(projectID) {
        const projectCheckboxKey = `project_${projectID}_checkboxes`;
        const savedStates = JSON.parse(localStorage.getItem(projectCheckboxKey) || '[]');
        const checkboxes = document.querySelectorAll('.option');
        checkboxes.forEach((checkbox, index) => {
            if (index < savedStates.length) {
                checkbox.checked = savedStates[index];
            }
        });
    }

    // Función para actualizar la barra de progreso
    function updateProgress() {
        const checkboxes = document.querySelectorAll('.option');
        const totalOptions = checkboxes.length;
        const selectedOptions = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        
        const progressPercentage = totalOptions > 0 ? (selectedOptions / totalOptions) * 100 : 0;
        const progressBar = document.getElementById('progressBar');
        
        if (progressBar) {
            progressBar.style.width = progressPercentage + '%';
            progressBar.textContent = Math.round(progressPercentage) + '%';
        }
    }

    // Event listeners
    document.getElementById('addObjectiveBtn').addEventListener('click', addNewObjective);
    document.getElementById('newObjective').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewObjective();
        }
    });

    // Cargar proyecto inicial
    if (projectID) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectData = projects.find(project => project.id === projectID);
        
        if (projectData) {
            detailsContainer.innerHTML = `
                <h1 contenteditable="true">${projectData.title}</h1>
                <p contenteditable="true">${projectData.content}</p>
            `;

            const editableTitle = detailsContainer.querySelector('h1');
            const editableContent = detailsContainer.querySelector('p');

            editableTitle.addEventListener('blur', function() {
                saveProjectChanges(projectID, this.textContent, editableContent.textContent);
            });

            editableContent.addEventListener('blur', function() {
                saveProjectChanges(projectID, editableTitle.textContent, this.textContent);
            });

            refreshObjectivesList(projectData.objectives);
            loadAvailableUsers();
        } else {
            detailsContainer.innerHTML = '<p>No se encontraron detalles para este proyecto.</p>';
        }
    } else {
        detailsContainer.innerHTML = '<p>No se especificó un proyecto válido.</p>';
    }
});

document.querySelector('.return-index').addEventListener('click', function() {
    saveProjectChanges();
});


window.addEventListener('beforeunload', function() {
    saveProjectChanges(); // Guarda automáticamente antes de salir de la página
});

// Función para guardar cambios en el proyecto
function saveProjectChanges(projectID, newTitle, newContent) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(project => project.id === projectID);

    if (projectIndex !== -1) {
        projects[projectIndex].title = newTitle;
        projects[projectIndex].content = newContent;
        localStorage.setItem('projects', JSON.stringify(projects));
    }
}
