document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('grid-container');
    const addProjectdBtn = document.getElementById('addProjectdBtn');
    let projectCount = parseInt(localStorage.getItem('projectCount') || '0');
    
    //Funcion para Cargar los Proyectos
    function loadprojects() {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.forEach(projectData => {
            createproject(projectData.title, projectData.content, projectData.id, projectData.objectives || []);
        });
    }
    //Funcion para leer y mostrar un trozo del texto
    function truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }
    //Funcion para crear el Proyecto
    function createproject(title, content, id = null, objectives = []) { 
        if (!id) {
            projectCount++;
            id = `Proyecto-${projectCount}`;
        }
    
        const project = document.createElement('a');
        project.className = 'grid-item';
        project.href = `details.html?id=${id}&title=${encodeURIComponent(title)}`;
        project.dataset.id = id;
        project.objectives = objectives;
        
        // Guardar el contenido completo como un atributo de datos
        project.dataset.fullContent = content;
        
        project.innerHTML = `
            <h3 class="project-title">${title}</h3>
            <div class="project-content">
                <p class="truncate-text">${truncateText(content)}</p>
            </div>
            <p class="project-id">${id}</p>
            <button class="delete-btn">Eliminar</button>
        `;

        updateProjectColor(project, id);
    
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
    //Funcion para al completar la barra del progreso, el contenedor cambie a color verde
    function updateProjectColor(projectElement, projectId) {
        const projectCheckboxKey = `project_${projectId}_checkboxes`;
        const savedStates = JSON.parse(localStorage.getItem(projectCheckboxKey) || '[]');
        
        if (savedStates.length > 0) {
            const checkedCount = savedStates.filter(state => state).length;
            const progress = (checkedCount / savedStates.length) * 100;
            
            if (progress === 100) {
                projectElement.style.backgroundColor = '#4CAF50';
                projectElement.style.borderColor = 'black';
            } else {
                projectElement.style.backgroundColor = '';
                projectElement.style.borderColor = '';
            }
        }
    }
    //Funcion para el boton eliminar proyecto  
    function deleteProject(id) {
        const projectElement = container.querySelector(`[data-id="${id}"]`);
        if (projectElement) {
            container.removeChild(projectElement);
            saveprojects();
        }
    }
    //Funcion para el boton añadir nuevo Proyecto
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
            createproject(title, content, null, objectives);
        }
    }
    //Funcion para que el proyecto se guarde
    function saveprojects() {
        const projects = Array.from(container.children).map(project => ({
            id: project.dataset.id,
            title: project.querySelector('h3').textContent,
            // Usar el contenido completo guardado en dataset
            content: project.dataset.fullContent,
            objectives: project.objectives || []
        }));
        localStorage.setItem('projects', JSON.stringify(projects));
        localStorage.setItem('projectCount', projectCount.toString());
    }

    //Boton al añadir proyecto
    addProjectdBtn.addEventListener('click', addNewproject);
    //Cargar los proyectos
    loadprojects();
});