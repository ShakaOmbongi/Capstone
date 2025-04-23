document.addEventListener("DOMContentLoaded", async function () {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }
  
    const token = getCookie("token");
  
    const requestsTableBody = document.getElementById("joinRequestsTableBody");
    if (!token || !requestsTableBody) {
      console.warn("Token or requestsTableBody missing. Skipping sessionActionsTutor.js");
      return;
    }
  
    async function loadJoinRequests() {
      try {
        const response = await fetch("/tutoruser/join/requests?tutorOnly=true", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const data = await response.json();
        const { pending, accepted } = data.data || { pending: [], accepted: [] };
  
        requestsTableBody.innerHTML = "";
  
        // Render Pending Requests
        if (pending.length > 0) {
          const pendingHeader = document.createElement('tr');
          pendingHeader.innerHTML = `<td colspan="4" class="fw-bold text-primary">Pending Requests</td>`;
          requestsTableBody.appendChild(pendingHeader);
  
          pending.forEach(request => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${request.requestedSession?.subject || 'Unknown Subject'}</td>
              <td>${request.requestingStudent?.username || 'Unknown Student'}</td>
              <td>${new Date(request.createdAt).toLocaleString()}</td>
              <td>
                <button class="btn btn-sm btn-success accept-session" data-id="${request.id}">Accept</button>
                <button class="btn btn-sm btn-danger reject-session" data-id="${request.id}">Reject</button>
              </td>
            `;
            requestsTableBody.appendChild(row);
          });
        }
  
        // Render Accepted Requests
        if (accepted.length > 0) {
          const acceptedHeader = document.createElement('tr');
          acceptedHeader.innerHTML = `<td colspan="4" class="fw-bold text-success">Accepted Requests</td>`;
          requestsTableBody.appendChild(acceptedHeader);
  
          accepted.forEach(request => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${request.requestedSession?.subject || 'Unknown Subject'}</td>
              <td>${request.requestingStudent?.username || 'Unknown Student'}</td>
              <td>${new Date(request.createdAt).toLocaleString()}</td>
              <td><span class="badge bg-success">Accepted</span></td>
            `;
            requestsTableBody.appendChild(row);
          });
        }
  
        if (pending.length === 0 && accepted.length === 0) {
          requestsTableBody.innerHTML = `<tr><td colspan="4" class="text-muted">No join requests.</td></tr>`;
        }
  
        attachListeners();
      } catch (error) {
        console.error("Error loading join requests:", error);
        requestsTableBody.innerHTML = `<tr><td colspan="4" class="text-danger">Error loading join requests.</td></tr>`;
      }
    }
  
    function attachListeners() {
      document.querySelectorAll(".accept-session").forEach(button => {
        button.addEventListener("click", async function () {
          const requestId = this.getAttribute("data-id");
          await updateRequestStatus(requestId, "accept");
        });
      });
  
      document.querySelectorAll(".reject-session").forEach(button => {
        button.addEventListener("click", async function () {
          const requestId = this.getAttribute("data-id");
          await updateRequestStatus(requestId, "reject");
        });
      });
    }
  
    async function updateRequestStatus(requestId, action) {
      try {
        const endpoint = `/tutoruser/join/requests/${action}/${requestId}`;
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(`Request ${action}ed successfully`);
          loadJoinRequests(); // Refresh
        } else {
          alert(result.error || `Failed to ${action} request`);
        }
      } catch (error) {
        console.error(`Error updating request status:`, error);
      }
    }
  
    loadJoinRequests();
  });
  