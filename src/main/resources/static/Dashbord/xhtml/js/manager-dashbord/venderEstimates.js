async function fetchBudgets() {
    try {
        // const response = await fetch('http://88.222.241.45:9080/api/projectS/budgets');
        const response = await fetch('http://localhost:9090/api/projectS/budgets');

        if (response.ok) {
            const budgets = await response.json();
            const tableBody = document.getElementById('budgetTableBody');
            tableBody.innerHTML = '';

            budgets.forEach(budget => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = budget.id || 'N/A';
                row.appendChild(idCell);

                const projectIdCell = document.createElement('td');
                projectIdCell.textContent = budget.project.id || 'No Project Id';
                row.appendChild(projectIdCell);

                const projectBudgetCell = document.createElement('td');
                projectBudgetCell.textContent = budget.project.budget || 'No Budget';
                row.appendChild(projectBudgetCell);

                const budgetIdCell = document.createElement('td'); // Updated from vendorId to id
                budgetIdCell.textContent = budget.id || 'No ID'; // Use budget.id directly
                row.appendChild(budgetIdCell);

                const vendorEstimateCell = document.createElement('td');
                vendorEstimateCell.textContent = budget.estimatedBudget || 'No Estimate';
                row.appendChild(vendorEstimateCell);

                const estimateDateCell = document.createElement('td');
                estimateDateCell.textContent = budget.uploadDate || 'No Estimate Date';
                row.appendChild(estimateDateCell);

                const actionCell = document.createElement('td');
                const selectButton = document.createElement('button');
                selectButton.textContent = 'Select';
                selectButton.classList.add('btn', 'btn-primary');
                selectButton.onclick = () => openPopup(budget.project.id, budget.id); // Updated to pass budget.id
                actionCell.appendChild(selectButton);
                row.appendChild(actionCell);

                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function openPopup(projectId, budgetId) { // Updated parameter name to budgetId
    document.getElementById('projectId').value = projectId;
    document.getElementById('budgetId').value = budgetId; // Updated to set budgetId

    const popup = document.getElementById('budgetPopup');
    popup.style.display = 'flex';

    document.getElementById('cancelPopup').onclick = closePopup;
    document.getElementById('closePopup').onclick = closePopup;

    document.getElementById('budgetForm').onsubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };
}

function closePopup() {
    document.getElementById('budgetPopup').style.display = 'none';
}

function handleSubmit() {
    const projectId = document.getElementById('projectId').value;
    const budgetId = document.getElementById('budgetId').value; // Updated to use budgetId
    const materialCost = document.getElementById('materialCost').value;
    const margin = document.getElementById('margin').value;

    console.log('Submitted:', { projectId, budgetId, materialCost, margin });

    // You can add a POST request here to save the data to the backend.
    closePopup();
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchBudgets);
