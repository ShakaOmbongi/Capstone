document.addEventListener("DOMContentLoaded", async function () {
    const feedbackTableBody = document.getElementById("feedback-table-body");

    // Fetch feedback from Supabase
    async function fetchFeedback() {
        try {
            const response = await fetch("/api/feedback");
            const data = await response.json();

            feedbackTableBody.innerHTML = ""; // Clear existing rows

            data.forEach(feedback => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${feedback.user}</td>
                    <td>${feedback.comment}</td>
                    <td><button class="delete-feedback" data-id="${feedback.id}">Delete</button></td>
                `;
                feedbackTableBody.appendChild(row);
            });

            // Reattach event listeners to delete buttons
            setupDeleteButtons();
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    }

    // Handle delete confirmation and request
    function setupDeleteButtons() {
        document.querySelectorAll(".delete-feedback").forEach(button => {
            button.addEventListener("click", async function () {
                const feedbackId = this.dataset.id;

                if (confirm("Are you sure you want to delete this feedback?")) {
                    try {
                        const response = await fetch(`/api/feedback/${feedbackId}`, { method: "DELETE" });

                        if (response.ok) {
                            fetchFeedback(); // Refresh the table after deletion
                        } else {
                            alert("Error deleting feedback.");
                        }
                    } catch (error) {
                        console.error("Error deleting feedback:", error);
                    }
                }
            });
        });
    }

    // Load feedback when the page loads
    fetchFeedback();
});

document.addEventListener("DOMContentLoaded", async function () {
    const userTableBody = document.getElementById("user-table-body");

    // Fetch users from Supabase
    async function fetchUsers() {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();

            userTableBody.innerHTML = ""; // Clear existing rows

            data.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button>Edit</button>
                        <button class="delete-user" data-id="${user.id}">Delete</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });

            // Reattach event listeners to delete buttons
            setupDeleteButtons();
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    // Function to handle delete confirmation and request
    function setupDeleteButtons() {
        document.querySelectorAll(".delete-user").forEach(button => {
            button.addEventListener("click", async function () {
                const userId = this.dataset.id;

                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });

                        if (response.ok) {
                            fetchUsers(); // Refresh table after deletion
                        } else {
                            alert("Error deleting user.");
                        }
                    } catch (error) {
                        console.error("Error deleting user:", error);
                    }
                }
            });
        });
    }

    // Load users when the page loads
    fetchUsers();
});
