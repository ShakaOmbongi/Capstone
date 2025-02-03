document.addEventListener("DOMContentLoaded", function() {
    // Function to handle delete confirmation
    function setupDeleteButtons(selector) {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener("click", function() {
                const row = this.closest("tr"); // Get the row containing the button
                const itemName = row.cells[0].textContent; // Get the first column text (User Name or Feedback Name)

                if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
                    row.remove(); // Remove the row if confirmed
                }
            });
        });
    }

    // Apply delete functionality to user and feedback delete buttons
    setupDeleteButtons(".delete-user");
    setupDeleteButtons(".delete-feedback");
});
