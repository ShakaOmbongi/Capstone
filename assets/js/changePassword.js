document.getElementById("changePasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Extract token from cookies
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        alert("You must be logged in to change your password.");
        return;
    }

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    // Send PUT request to change password endpoint
    const response = await fetch("/student/changePassword", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    const result = await response.json();
    if (response.ok) {
        alert("Password changed successfully!");
        document.getElementById("changePasswordForm").reset();
    } else {
        alert(result.error || "Failed to change password.");
    }
});
