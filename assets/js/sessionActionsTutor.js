document.addEventListener("DOMContentLoaded", async function () {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }
  
    const token = getCookie("token");
    const tableBody = document.getElementById("pendingSessionsTableBody");
  
    if (!token || !tableBody) {
      console.warn("Token or tableBody missing. Skipping sessionActionsTutor.js");
      return;
    }
  
    async function loadPendingSessions() {
      try {
        const response = await fetch("/tutoruser/all-sessions", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const data = await response.json();
  
        // ✅ FIX: Correct key name
        const sessions = data.sessions || [];
  
        const pendingSessions = sessions.filter(session => session.status === "pending");
  
        tableBody.innerHTML = "";
  
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
  
        attachSessionActionListeners();
      } catch (error) {
        console.error("Error loading sessions:", error);
      }
    }
  
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
  
    async function updateSessionStatus(sessionId, newStatus) {
      try {
        const endpoint = `/sessions/${newStatus}/${sessionId}`;
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(`Session ${newStatus} successfully`);
          loadPendingSessions();
        } else {
          alert(result.error || `Failed to ${newStatus} session`);
        }
      } catch (error) {
        console.error("Error updating session status:", error);
      }
    }
  
    loadPendingSessions();
  });
  