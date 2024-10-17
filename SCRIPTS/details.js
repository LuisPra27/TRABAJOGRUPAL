document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('project-details');
    const objectivesList = document.getElementById('objectives-list');
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');

    // Add new elements for objective management
    const addObjectiveForm = document.createElement('div');
    addObjectiveForm.className = 'objective-form';
    addObjectiveForm.innerHTML = `
        <input type="text" id="newObjective" placeholder="Nuevo objetivo...">
        <button id="addObjectiveBtn">Agregar Objetivo</button>
    `;
    objectivesList.parentNode.insertBefore(addObjectiveForm, objectivesList);

    // Funcion para añadir nuevos Objetivos
    function addNewObjective() {
        const newObjectiveInput = document.getElementById('newObjective');
        const objectiveText = newObjectiveInput.value.trim();
        
        if (objectiveText) {
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const projectIndex = projects.findIndex(project => project.id === projectID);
            
            if (projectIndex !== -1) {
                // Initialize objectives array if it doesn't exist
                if (!projects[projectIndex].objectives) {
                    projects[projectIndex].objectives = [];
                }
                
                // Add new objective
                projects[projectIndex].objectives.push(objectiveText);
                localStorage.setItem('projects', JSON.stringify(projects));
                
                // Reset input
                newObjectiveInput.value = '';
                
                // Refresh the list with updated objectives
                refreshObjectivesList(projects[projectIndex].objectives);
            }
        }
    }

    // Funcion para eliminar nuevos Objetivos
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

    // Funcion para refrescar los nuevos Objetivos
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

            // Update progress after refreshing the list
            updateProgress();
        } else {
            objectivesList.innerHTML = '<li>No se han añadido objetivos.</li>';
        }
    }

    // Funcion para guardar el estado de las cajas de los Objetivos
    function saveCheckboxState(projectID) {
        const checkboxes = document.querySelectorAll('.option');
        const checkboxStates = Array.from(checkboxes).map(checkbox => checkbox.checked);
        const projectCheckboxKey = `project_${projectID}_checkboxes`;
        localStorage.setItem(projectCheckboxKey, JSON.stringify(checkboxStates));
    }

    // Funcion para cargar el estado de las cajas de los Objetivos
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

    // Funcion para actualizar la barra del progreso
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
    document.getElementById('addObjectiveBtn').addEventListener('click', addNewObjective);
    document.getElementById('newObjective').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewObjective();
        }
    });
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

            // Load objectives
            refreshObjectivesList(projectData.objectives);
        } else {
            detailsContainer.innerHTML = '<p>No se encontraron detalles para este proyecto.</p>';
        }
    } else {
        detailsContainer.innerHTML = '<p>No se especificó un proyecto válido.</p>';
    }
});

    // Funcion para guardar los Proyectos
function saveProjectChanges(projectID, newTitle, newContent) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(project => project.id === projectID);

    if (projectIndex !== -1) {
        projects[projectIndex].title = newTitle;
        projects[projectIndex].content = newContent;
        localStorage.setItem('projects', JSON.stringify(projects));
    }
}