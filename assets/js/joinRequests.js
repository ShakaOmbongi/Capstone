document.addEventListener('DOMContentLoaded', function () {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  const pendingTable = document.getElementById('joinRequestsTableBody');
  const acceptedTable = document.getElementById('acceptedRequestsTableBody'); // Add this for accepted

  if (!token || !pendingTable || !acceptedTable) {
    console.warn('Token or table body missing.');
    return;
  }

  async function loadJoinRequests() {
    try {
      const res = await fetch('/tutoruser/join/requests?tutorOnly=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      const { pending = [], accepted = [] } = data.data;

      // Clear both tables
      pendingTable.innerHTML = '';
      acceptedTable.innerHTML = '';

      // Populate pending requests
      if (pending.length === 0) {
        pendingTable.innerHTML = `<tr><td colspan="4">No pending requests.</td></tr>`;
      } else {
        pending.forEach(request => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${request.requestedSession?.subject || 'Unknown'}</td>
            <td>${request.requestingStudent?.username || 'Unknown'}</td>
            <td>${new Date(request.createdAt).toLocaleString()}</td>
            <td>
              <button class="btn btn-success btn-sm" data-id="${request.id}" data-action="accept">Accept</button>
              <button class="btn btn-danger btn-sm" data-id="${request.id}" data-action="reject">Reject</button>
            </td>
          `;
          pendingTable.appendChild(row);
        });
      }

      // Populate accepted requests
      if (accepted.length === 0) {
        acceptedTable.innerHTML = `<tr><td colspan="3">No accepted requests.</td></tr>`;
      } else {
        accepted.forEach(request => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${request.requestedSession?.subject || 'Unknown'}</td>
            <td>${request.requestingStudent?.username || 'Unknown'}</td>
            <td>${new Date(request.createdAt).toLocaleString()}</td>
          `;
          acceptedTable.appendChild(row);
        });
      }

      attachListeners(); // Attach accept/reject buttons
    } catch (err) {
      console.error('Error loading join requests:', err);
    }
  }

  function attachListeners() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async function () {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        await handleRequestAction(id, action);
      });
    });
  }

  async function handleRequestAction(id, action) {
    try {
      const res = await fetch(`/tutoruser/join/requests/${action}/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      alert(result.message);
      loadJoinRequests();
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  }

  loadJoinRequests();
});
