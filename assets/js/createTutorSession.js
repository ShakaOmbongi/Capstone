document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('createSessionForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const sessionDate = document.getElementById('sessionDate').value;
    const description = document.getElementById('description')?.value || '';

    console.log("DEBUG: Sending request with data:", { subject, sessionDate, description });

    try {
      const response = await fetch('/sessions/create', {
        method: 'POST',
        credentials: 'include', // Include cookies (JWT token)
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject, sessionDate, description }) // Send dynamic form input
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
