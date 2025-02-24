document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('createSessionForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const subject = document.getElementById('subject').value;
        const sessionDate = document.getElementById('sessionDate').value;

        // Get the token from cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
            messageDiv.innerHTML = `<div class="alert alert-danger">You must be logged in to create a session.</div>`;
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: subject,
                    sessionDate: sessionDate
                })
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.innerHTML = `<div class="alert alert-success">Session created successfully!</div>`;
                form.reset(); // Clear the form after success
            } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">${result.error || 'Failed to create session'}</div>`;
            }
        } catch (error) {
            console.error("Error creating session:", error);
            messageDiv.innerHTML = `<div class="alert alert-danger">Server error. Please try again.</div>`;
        }
    });
});
