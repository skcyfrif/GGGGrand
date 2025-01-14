// URL to fetch manager data
// const apiUrl = "http://88.222.241.45:9080/api/manager/findAll";
const apiUrl = "http://localhost:9090/api/manager/findAll";

// Function to fetch manager data
async function fetchManagerData() {
    try {
        const response = await fetch(apiUrl);

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse JSON response
        const managers = await response.json();

        // Populate the table
        populateManagerTable(managers);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Function to populate the table with manager data
function populateManagerTable(managers) {
    const tableBody = document.querySelector(".table-responsive-md tbody");
    
    // Clear the table body (in case of previous data)
    tableBody.innerHTML = "";

    // Loop through the managers and add rows to the table
    managers.forEach((manager) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${manager.id}</strong></td>
            <td>${manager.firstName}</td>
            <td>${manager.lastName}</td>
            <td>${manager.email}</td>
            <td>${manager.phone}</td>
            <td>${manager.state}</td>
            <td>${manager.city}</td>
            <td>${manager.qualifications}</td>
            <td>${manager.experience}</td>
            <td>${manager.premium ? "Yes" : "No"}</td>
            <td>${manager.assignedProjectId ? "Yes" : "No"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch manager data on page load
document.addEventListener("DOMContentLoaded", fetchManagerData);
