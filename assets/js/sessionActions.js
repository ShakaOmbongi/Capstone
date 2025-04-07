// sessionActions.js
document.addEventListener("DOMContentLoaded", async function () {
    // Function to retrieve token from cookies (you can adjust if you use localStorage)
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }
  
    const token = getCookie("token");
    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "/login";
      return;
    }
  
    // Function to load pending sessions and populate the table
    async function loadPendingSessions() {
      try {
        const response = await fetch("http://localhost:3000/sessions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch sessions");
        }
        const sessions = data.data || [];
        // Filter pending sessions (if not already filtered by the server)
        const pendingSessions = sessions.filter(session => session.status === "pending");
        
        const tableBody = document.getElementById("pendingSessionsTableBody");
        tableBody.innerHTML = ""; // Clear previous rows
  
        pendingSessions.forEach(session => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${session.subject}</td>
            <td>${new Date(session.sessionDate).toLocaleString()}</td>
            <td>${session.status}</td>
            <td>
              <button class="btn btn-sm btn-success accept-session" data-id="${session.id}">Accept</button>
              <button class="btn btn-sm btn-danger reject-session" data-id="${session.id}">Reject</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
  
        // Attach event listeners to the new buttons
        attachSessionActionListeners();
      } catch (error) {
        console.error("Error loading sessions:", error);
        alert("Error loading sessions.");
      }
    }
  
    // Function to attach event listeners to Accept/Reject buttons
    function attachSessionActionListeners() {
      document.querySelectorAll(".accept-session").forEach(button => {
        button.addEventListener("click", async function () {
          const sessionId = this.getAttribute("data-id");
          await updateSessionStatus(sessionId, "accepted");
        });
      });
      document.querySelectorAll(".reject-session").forEach(button => {
        button.addEventListener("click", async function () {
          const sessionId = this.getAttribute("data-id");
          await updateSessionStatus(sessionId, "rejected");
        });
      });
    }
  
    // Function to update session status
    async function updateSessionStatus(sessionId, newStatus) {
      try {
        const endpoint = newStatus === "accepted"
          ? `http://localhost:3000/sessions/accept/${sessionId}`
          : `http://localhost:3000/sessions/reject/${sessionId}`;
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok) {
          alert(`Session ${newStatus} successfully!`);
          // Reload the sessions table to reflect changes
          loadPendingSessions();
        } else {
          alert(result.error || `Failed to update session to ${newStatus}`);
        }
      } catch (error) {
        console.error("Error updating session status:", error);
        alert("Error updating session status.");
      }
    }
  
    // Initial load of pending sessions
    loadPendingSessions();
  });
  