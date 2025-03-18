document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('createSessionForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Extract session details from the form inputs
    const subject = document.getElementById('subject').value;
    const sessionDate = document.getElementById('sessionDate').value;

    console.log("DEBUG: Sending request with data:", { subject, sessionDate });

    try {
      // Send a POST request to your API endpoint for session creation.
      const response = await fetch('http://localhost:3000/sessions/create', {
        method: 'POST',
        credentials: 'include', // This ensures the cookie is sent with the request
        headers: {
          'Content-Type': 'application/json'
        },
        // Adjust tutorId as needed
        body: JSON.stringify({ subject, sessionDate, tutorId: 1 })
      });

      const result = await response.json();
      console.log("DEBUG: Response from backend:", result);

      if (response.ok) {
        messageDiv.innerHTML = `<div class="alert alert-success">Session created successfully!</div>`;
        form.reset();
      } else {
        messageDiv.innerHTML = `<div class="alert alert-danger">${result.error || 'Failed to create session'}</div>`;
      }
    } catch (error) {
      console.error("Error creating session:", error);
      messageDiv.innerHTML = `<div class="alert alert-danger">Server error. Please try again.</div>`;
    }
  });
});
