document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('grid-container');
    const addProjectdBtn = document.getElementById('addProjectdBtn');
    let projectCount = parseInt(localStorage.getItem('projectCount') || '0');

    function loadprojects() {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.forEach(projectData => createproject(projectData.title, projectData.content, projectData.id));
    }

    function createproject(title, content, id = null, objectives = []) { 
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
            <p>${content}</p>
            <p>${id}</p>
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
        const content = prompt('Ingrese una breve descripción para el nuevo Proyecto:', 'Breve descripción');
        
        const objectives = [];
        let moreObjectives = true;
        
        while (moreObjectives) {
            const objective = prompt('Ingrese un objetivo (o déjelo en blanco para terminar):');
            if (objective) {
                objectives.push(objective);
            } else {
                moreObjectives = false;
            }
        }
        
        if (title && content) {
            // Llamar a createproject con el título, contenido, y objetivos correctamente
            createproject(title, content, null, objectives);  // 'null' para el id, ya que será generado automáticamente
        }
    }
    
    
    
    function saveprojects() {
        const projects = Array.from(container.children).map(project => ({
            id: project.dataset.id,
            title: project.querySelector('h3').textContent,
            content: project.querySelector('p').textContent,
            objectives: project.objectives || []  // Agrega los objetivos a los proyectos
        }));
        localStorage.setItem('projects', JSON.stringify(projects));
        localStorage.setItem('projectCount', projectCount.toString());
    }
    

    addProjectdBtn.addEventListener('click', addNewproject);

    // Cargar las tarjetas existentes al iniciar
    loadprojects();
});

