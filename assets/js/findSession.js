document.addEventListener('DOMContentLoaded', async function() {
  // Get the token from cookies.
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    document.getElementById('message').innerHTML = `<div class="alert alert-danger">You must be logged in to find sessions.</div>`;
    return;
  }

  // Helper to extract a cookie by name.
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Helper function to decode a JWT (if needed)
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return {};
    }
  }

  // Retrieve the current user's ID.
  let currentUserId = getCookie('userId');
  if (!currentUserId) {
    const decodedToken = parseJwt(token);
    currentUserId = decodedToken.id; // adjust if your payload uses a different key
  }
  currentUserId = currentUserId ? parseInt(currentUserId) : null;
  console.log("Current User ID:", currentUserId);

  async function loadSessions() {
    try {
      const response = await fetch('http://localhost:3000/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      // Get references to both session lists.
      const mySessionsList = document.getElementById('mySessionsList');
      const otherSessionsList = document.getElementById('otherSessionsList');

      // Clear previous listings.
      mySessionsList.innerHTML = '';
      otherSessionsList.innerHTML = '';

      // If no sessions are available.
      if (!data.data || data.data.length === 0) {
        mySessionsList.innerHTML = '<p class="text-muted">No available sessions.</p>';
        otherSessionsList.innerHTML = '<p class="text-muted">No available sessions.</p>';
        return;
      }

      // Loop through sessions and create elements for each.
      data.data.forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // Build common session details, including an optional description.
        const sessionDetails = `
          <div>
            <h5>${session.subject}</h5>
            <p>Date: ${new Date(session.sessionDate).toLocaleString()}</p>
            ${session.description ? `<p>Description: ${session.description}</p>` : ''}
          </div>
        `;

        // Debug logging.
        console.log("Session Tutor ID:", session.tutor ? session.tutor.id : 'none');
        console.log("Session Student ID:", session.student ? session.student.id : 'none');

        // Check if the session was created by the current user:
        // Check both tutor and student fields.
        const belongsToCurrentUser = 
          (session.tutor && parseInt(session.tutor.id) === currentUserId) ||
          (session.student && parseInt(session.student.id) === currentUserId);

        if (belongsToCurrentUser) {
          // For sessions owned by the current user, show Edit and Delete buttons.
          sessionItem.innerHTML = `
            ${sessionDetails}
            <div>
              <button class="btn btn-primary edit-session" data-id="${session.id}">Edit</button>
              <button class="btn btn-danger delete-session" data-id="${session.id}">Delete</button>
            </div>
          `;
          mySessionsList.appendChild(sessionItem);
        } else {
          // For other sessions, show the Join button.
          sessionItem.innerHTML = `
            ${sessionDetails}
            <button class="btn btn-success join-session" data-id="${session.id}">Request to Join</button>
          `;
          otherSessionsList.appendChild(sessionItem);
        }
      });

      // Event listener for "Request to Join" buttons.
      document.querySelectorAll('.join-session').forEach(button => {
        button.addEventListener('click', async function() {
          const sessionId = this.getAttribute('data-id');
          const joinResponse = await fetch(`http://localhost:3000/sessions/request/${sessionId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const result = await joinResponse.json();
          if (joinResponse.ok) {
            alert('You have successfully joined the session!');
            loadSessions(); // Reload the sessions list.
          } else {
            alert(result.error || 'Failed to join session');
          }
        });
      });

      // Event listener for "Delete" buttons.
      document.querySelectorAll('.delete-session').forEach(button => {
        button.addEventListener('click', async function() {
          const sessionId = this.getAttribute('data-id');
          if (!confirm('Are you sure you want to delete this session?')) return;
          const deleteResponse = await fetch(`http://localhost:3000/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const result = await deleteResponse.json();
          if (deleteResponse.ok) {
            alert('Session deleted successfully!');
            loadSessions(); // Reload sessions list.
          } else {
            alert(result.error || 'Failed to delete session');
          }
        });
      });

      // Event listener for "Edit" buttons.
      document.querySelectorAll('.edit-session').forEach(button => {
        button.addEventListener('click', function() {
          const sessionId = this.getAttribute('data-id');
          openEditModal(sessionId);
        });
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      document.getElementById('message').innerHTML = `<div class="alert alert-danger">Failed to load sessions. Try again later.</div>`;
    }
  }

  // Function to open the edit modal and populate it with session data.
  function openEditModal(sessionId) {
    // Fetch session details.
    fetch(`http://localhost:3000/sessions/${sessionId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(sessionData => {
        // Populate modal fields with sessionData.
        document.getElementById('editSessionId').value = sessionData.data.id;
        document.getElementById('editSubject').value = sessionData.data.subject;
        // Convert sessionDate to a value acceptable by input[type="datetime-local"]
        document.getElementById('editDate').value = new Date(sessionData.data.sessionDate).toISOString().slice(0,16);
        document.getElementById('editDescription').value = sessionData.data.description || '';
        // Show the modal (assuming you're using Bootstrap's modal)
        new bootstrap.Modal(document.getElementById('editSessionModal')).show();
      })
      .catch(err => {
        console.error("Error fetching session details:", err);
        alert("Error loading session for editing");
      });
  }

  // Event listener for edit form submission.
  document.getElementById('editSessionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const sessionId = document.getElementById('editSessionId').value;
    const updatedData = {
      subject: document.getElementById('editSubject').value,
      sessionDate: document.getElementById('editDate').value,
      description: document.getElementById('editDescription').value,
    };
    const editResponse = await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });
    const result = await editResponse.json();
    if (editResponse.ok) {
      alert('Session updated successfully!');
      // Hide the modal using Bootstrap's modal API.
      bootstrap.Modal.getInstance(document.getElementById('editSessionModal')).hide();
      loadSessions(); // Reload sessions list.
    } else {
      alert(result.error || 'Failed to update session');
    }
  });

  loadSessions();
});
