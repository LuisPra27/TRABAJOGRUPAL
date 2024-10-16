document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('project-details');
    const objectivesList = document.getElementById('objectives-list');
    const progressBar = document.getElementById('progressBar');
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');
    const projectTitle = urlParams.get('title');

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

            editableTitle.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });


            if (projectData.objectives && projectData.objectives.length > 0) {
                projectData.objectives.forEach((objective, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <label>
                            <input type="checkbox" class="option" data-index="${index}"> ${objective}
                        </label>
                    `;
                    objectivesList.appendChild(li);
                });

                restoreCheckboxState(projectID);

                const checkboxes = document.querySelectorAll('.option');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        saveCheckboxState(projectID);
                        updateProgress();
                    });
                });

                updateProgress();
            } else {
                objectivesList.innerHTML = '<li>No se han añadido objetivos.</li>';
            }
        } else {
            detailsContainer.innerHTML = '<p>No se encontraron detalles para este proyecto.</p>';
        }
    } else {
        detailsContainer.innerHTML = '<p>No se especificó un proyecto válido.</p>';
    }
});
//Funcion para guardar los cambios dentro del Proyecto
function saveProjectChanges(projectID, newTitle, newContent) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectIndex = projects.findIndex(project => project.id === projectID);

    if (projectIndex !== -1) {
        projects[projectIndex].title = newTitle;
        projects[projectIndex].content = newContent;
        localStorage.setItem('projects', JSON.stringify(projects));
    }
}

//Funcion para que las cajas check se guarden al entrar a un proyecto
function saveCheckboxState(projectID) {
    const checkboxes = document.querySelectorAll('.option');
    const checkboxStates = Array.from(checkboxes).map(checkbox => checkbox.checked);

    // Guardar el estado de los checkboxes en localStorage
    const projectCheckboxKey = `project_${projectID}_checkboxes`;
    localStorage.setItem(projectCheckboxKey, JSON.stringify(checkboxStates));
}
//Funcion para que las cajas check carguen al entrar a un proyecto
function restoreCheckboxState(projectID) {
    const projectCheckboxKey = `project_${projectID}_checkboxes`;
    const savedStates = JSON.parse(localStorage.getItem(projectCheckboxKey) || '[]');

    const checkboxes = document.querySelectorAll('.option');
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = savedStates[index] || false;
    });
}

//Funcion para actualizar la barra del Progreso
function updateProgress() {
    const totalOptions = document.querySelectorAll('.option').length;
    const selectedOptions = document.querySelectorAll('.option:checked').length;
    
    const progressPercentage = (selectedOptions / totalOptions) * 100;
    const progressBar = document.getElementById('progressBar');
    
    progressBar.style.width = progressPercentage + '%';
    progressBar.textContent = Math.round(progressPercentage) + '%';

    // Disparar un evento de storage para notificar a otras páginas
    const event = new StorageEvent('storage', {
        key: `project_${projectID}_checkboxes`,
        newValue: localStorage.getItem(`project_${projectID}_checkboxes`),
        url: window.location.href
    });
    window.dispatchEvent(event);
}