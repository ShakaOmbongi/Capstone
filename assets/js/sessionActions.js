// sessionActions.js - Student 

document.addEventListener("DOMContentLoaded", async function () {
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

  const pendingTableBody = document.getElementById("incomingRequestsTableBody");
  const acceptedTableBody = document.getElementById("acceptedSessionsTableBody");

  async function loadStudentSessions() {
    try {
      const response = await fetch("/student/join/requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      const { pending = [], accepted = [] } = data.data || {};

      pendingTableBody.innerHTML = "";
      acceptedTableBody.innerHTML = "";

      if (pending.length === 0) {
        pendingTableBody.innerHTML = `<tr><td colspan="4" class="text-muted">No pending requests.</td></tr>`;
      } else {
        pending.forEach(request => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${request.requestedSession?.subject || 'Unknown Subject'}</td>
            <td>${new Date(request.requestedSession?.sessionDate).toLocaleString()}</td>
            <td>${request.status}</td>
            <td>Waiting for approval</td>
          `;
          pendingTableBody.appendChild(row);
        });
      }

      if (accepted.length === 0) {
        acceptedTableBody.innerHTML = `<tr><td colspan="4" class="text-muted">No accepted sessions.</td></tr>`;
      } else {
        accepted.forEach(request => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${request.requestedSession?.subject || 'Unknown Subject'}</td>
            <td>${new Date(request.requestedSession?.sessionDate).toLocaleString()}</td>
            <td>${request.status}</td>
            <td>Confirmed</td>
          `;
          acceptedTableBody.appendChild(row);
        });
      }
    } catch (err) {
      console.error("Error loading student join requests:", err);
    }
  }

  loadStudentSessions();
});
