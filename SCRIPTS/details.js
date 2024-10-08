document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('project-details');
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');
    const projectTitle = urlParams.get('title');

    if (projectID && projectTitle) {
        const project = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectData = project.find(project => project.id === projectID);
        
        if (projectData) {
            detailsContainer.innerHTML = `
                <h1>${projectTitle}</h1>
                <p>${projectData.content}</p>
                <p>Aquí puedes añadir más detalles sobre el ${projectTitle}.</p>
            `;
        } else {
            detailsContainer.innerHTML = '<p>No se encontraron detalles para este proyecto.</p>';
        }
    } else {
        detailsContainer.innerHTML = '<p>No se especificó un proyecto valido.</p>';
    }
});