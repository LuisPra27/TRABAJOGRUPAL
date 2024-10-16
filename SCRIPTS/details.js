document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('project-details');
    const objectivesList = document.getElementById('objectives-list');
    const progressBar = document.getElementById('progressBar'); // Para la barra de progreso
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('id');
    const projectTitle = urlParams.get('title');

    if (projectID) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectData = projects.find(project => project.id === projectID);
        
        if (projectData) {
            detailsContainer.innerHTML = `
                <h1>${projectData.title}</h1>
                <p>${projectData.content}</p>
            `;

            // Mostrar los objetivos con checkboxes
            if (projectData.objectives && projectData.objectives.length > 0) {
                projectData.objectives.forEach(objective => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <label>
                            <input type="checkbox" class="option"> ${objective.text}
                        </label>
                    `;
                    objectivesList.appendChild(li);
                });

                // Actualizar el progreso al cambiar los checkboxes
                const checkboxes = document.querySelectorAll('.option');
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', updateProgress);  // Vincular la actualización de progreso
                });

                // Inicializa el progreso en función de los checkboxes
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

function updateProgress() {
    const totalOptions = document.querySelectorAll('.option').length;
    const selectedOptions = document.querySelectorAll('.option:checked').length;
    
    const progressPercentage = (selectedOptions / totalOptions) * 100;
    const progressBar = document.getElementById('progressBar');
    
    progressBar.style.width = progressPercentage + '%';
    progressBar.textContent = Math.round(progressPercentage) + '%';
}
