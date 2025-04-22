document.addEventListener('DOMContentLoaded', function () {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const tableBody = document.getElementById('joinRequestsTableBody');
  if (!tableBody) {
    console.warn("No table body found for join requests.");
    return;
  }

  const isTutor = window.location.pathname.includes('/tutoruser');
  const basePath = isTutor ? '/tutoruser/join' : '/student/join';
  const url = isTutor ? `${basePath}/requests?tutorOnly=true` : `${basePath}/requests`;

  async function loadJoinRequests() {
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      const requests = data.data || [];

      tableBody.innerHTML = '';

      if (requests.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-muted">No pending requests.</td></tr>`;
        return;
      }

      requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${request.requestedSession?.subject || 'Unknown Subject'}</td>
          <td>${request.requestingStudent?.username || 'Unknown User'}</td>
          <td>${new Date(request.createdAt).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-success" data-id="${request.id}" data-action="accept">Accept</button>
            <button class="btn btn-sm btn-danger" data-id="${request.id}" data-action="reject">Reject</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      attachListeners();
    } catch (err) {
      console.error('Failed to load join requests:', err);
      tableBody.innerHTML = `<tr><td colspan="4" class="text-danger">Failed to load join requests.</td></tr>`;
    }
  }

  async function handleRequestAction(id, action) {
    try {
      const res = await fetch(`${basePath}/requests/${action}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();
      alert(result.message || `${action}ed successfully`);
      loadJoinRequests(); // Refresh
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  }

  function attachListeners() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        handleRequestAction(id, action);
      });
    });
  }

  loadJoinRequests();
});
