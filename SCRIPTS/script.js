document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('grid-container');
    const addProjectdBtn = document.getElementById('addProjectdBtn');
    let projectCount = parseInt(localStorage.getItem('projectCount') || '0');

    function saveprojects() {
        const projects = Array.from(container.children).map(project => ({
            id: project.dataset.id,
            title: project.querySelector('h3').textContent,
            content: project.querySelector('p').textContent
        }));
        localStorage.setItem('projects', JSON.stringify(projects));
        localStorage.setItem('projectCount', projectCount.toString());
    }

    function loadprojects() {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.forEach(projectData => createproject(projectData.title, projectData.content, projectData.id));
    }


function createproject(title, content, id= null) {
    if (!id) {
        projectCount++;
        id = `Proyecto-${projectCount}`;
    }

    const project = document.createElement('a');
    project.className = 'grid-item';
    project.href = `details.html?id=${id}&title=${encodeURIComponent(title)}`;
    project.dataset.id = id;
    project.innerHTML = `
        <h3>${title}</h3>
        <p>${id}</p>
        <span>Click para más detalles</span>
        <button class="delete-btn">Eliminar</button>
    `;

    const deleteBtn = project.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            deleteProject(id);
        }
    });

    container.appendChild(project);
    saveprojects();
}

function deleteProject(id) {
    const projectElement = container.querySelector(`[data-id="${id}"]`);
    if (projectElement) {
        container.removeChild(projectElement);
        saveprojects();
    }
}

function addNewproject() {
    const title = prompt('Ingrese el título para el nuevo Proyecto:', `Proyecto ${projectCount + 1}`);
    const content = prompt('Ingrese una breve descripción para el nueva Proyecto:', 'Breve descripción');
    if (title && content) {
        createproject(title, content);
    }
}

addProjectdBtn.addEventListener('click', addNewproject);

// Cargar las tarjetas existentes al iniciar
loadprojects();
});

