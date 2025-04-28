document.addEventListener("DOMContentLoaded", async function () {
    const token = getCookie("token");
    
    const incomingTableBody = document.getElementById("incomingRequestsTableBody");
  
    if (!token || !incomingTableBody) {
      console.warn("Token or incoming table body missing.");
      return;
    }
  
    async function loadIncomingRequests() {
      try {
        const response = await fetch("/student/join/requests?studentOnly=true", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` ,"Cache-Control": "no-cache"}
        });
  
        const data = await response.json();
        const { pending = [] } = data.data || {};
  
        incomingTableBody.innerHTML = "";
  
        if (pending.length === 0) {
          incomingTableBody.innerHTML = `<tr><td colspan="4" class="text-muted">No incoming join requests.</td></tr>`;
        } else {
          pending.forEach(request => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${request.requestedSession?.subject || 'Unknown Subject'}</td>
              <td>${request.requestingStudent?.username || 'Unknown Student'}</td>
              <td>${new Date(request.createdAt).toLocaleString()}</td>
              <td>
                <button class="btn btn-sm btn-success accept-request" data-id="${request.id}">Accept</button>
                <button class="btn btn-sm btn-danger reject-request" data-id="${request.id}">Reject</button>
              </td>
            `;
            incomingTableBody.appendChild(row);
          });
          attachListeners();
        }
      } catch (error) {
        console.error("Error loading incoming requests:", error);
      }
    }
  
    function attachListeners() {
      document.querySelectorAll(".accept-request").forEach(button => {
        button.addEventListener("click", async function () {
          const requestId = this.getAttribute("data-id");
          await updateRequestStatus(requestId, "accept");
        });
      });
  
      document.querySelectorAll(".reject-request").forEach(button => {
        button.addEventListener("click", async function () {
          const requestId = this.getAttribute("data-id");
          await updateRequestStatus(requestId, "reject");
        });
      });
    }
  
    async function updateRequestStatus(requestId, action) {
      try {
        const endpoint = `/student/join/requests/${action}/${requestId}`;
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` }
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(`Request ${action}ed successfully`);
          loadIncomingRequests(); // Refresh table
        } else {
          alert(result.error || `Failed to ${action} request`);
        }
      } catch (error) {
        console.error(`Error updating request status:`, error);
      }
    }
  
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  
    loadIncomingRequests();
  });
  