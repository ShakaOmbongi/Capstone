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
    function parseJwt (token) {
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
  
          sessionItem.innerHTML = `
            <div>
              <h5>${session.subject}</h5>
              <p>Date: ${new Date(session.sessionDate).toLocaleString()}</p>
            </div>
            <button class="btn btn-success join-session" data-id="${session.id}">Request to Join</button>
          `;
  
          // Debug logging.
          console.log("Session Tutor ID:", session.tutor ? session.tutor.id : 'none');
          console.log("Session Student ID:", session.student ? session.student.id : 'none');
  
          // Check if the session was created by the current user:
          // Check both tutor and student fields.
          if (
            (session.tutor && parseInt(session.tutor.id) === currentUserId) ||
            (session.student && parseInt(session.student.id) === currentUserId)
          ) {
            mySessionsList.appendChild(sessionItem);
          } else {
            otherSessionsList.appendChild(sessionItem);
          }
        });
  
        // Add event listeners for join buttons.
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
      } catch (error) {
        console.error("Error fetching sessions:", error);
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">Failed to load sessions. Try again later.</div>`;
      }
    }
  
    loadSessions();
  });
  