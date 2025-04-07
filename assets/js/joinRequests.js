document.addEventListener('DOMContentLoaded', function () {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
  
    const tableBody = document.getElementById('joinRequestsTableBody');
  
    async function loadJoinRequests() {
      try {
        const res = await fetch('/student/join/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        const data = await res.json();
        const requests = data.data || [];
  
        tableBody.innerHTML = '';
  
        requests.forEach(request => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${request.session?.subject || 'Unknown Subject'}</td>
            <td>${request.student?.username || 'Unknown User'}</td>
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
        const res = await fetch(`/student/join/requests/${action}/${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
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
  