document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('project-details');
    const objectivesList = document.getElementById('objectives-list');
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');  // Obtenemos el ID del proyecto desde la URL
    const projectTitle = urlParams.get('title');  // Obtenemos el título desde la URL

    if (projectID) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectData = projects.find(project => project.id === projectID);  // Buscamos el proyecto correcto por ID
        
        if (projectData) {
            detailsContainer.innerHTML = `
                <h1>${projectData.title}</h1>
                <p>${projectData.content}</p>
                <p>Aquí puedes añadir más detalles sobre el ${projectData.title}.</p>
            `;

            // Mostrar objetivos si existen
            if (projectData.objectives && projectData.objectives.length > 0) {
                projectData.objectives.forEach(objective => {
                    const li = document.createElement('li');
                    li.textContent = objective;
                    objectivesList.appendChild(li);
                });
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
