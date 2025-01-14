// URL to submit project details
// const projectSubmitUrl = "http://88.222.241.45:9080/api/project/submit";
const projectSubmitUrl = "http://localhost:9090/api/project/submit";

// Function to handle form submission
async function submitProject(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const formData = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        areaInSquareFeet: document.getElementById("areaInSquareFeet").value.trim(),
        budget: document.getElementById("budget").value.trim(),
        clientId: document.getElementById("clientId").value.trim(),
    };

    try {
        // Send POST request to the server
        const response = await fetch(projectSubmitUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit project details.");
        }

        // Handle successful response
        const result = await response.json();
        alert("Project submitted successfully! Project ID: " + result.id);

        // Optionally reset the form
        document.getElementById("registrationForm").reset();
    } catch (error) {
        // Handle errors
        console.error("Error:", error.message);
        alert("Error: " + error.message);
    }
}

// Attach event listener to the form submission
document.getElementById("registrationForm").addEventListener("submit", submitProject);

// Add event listener to the Cancel button
document.getElementById("cancelButton").addEventListener("click", function () {
    // Redirect to the project list page or a relevant page
    window.location.href = "project_details.html";
});
