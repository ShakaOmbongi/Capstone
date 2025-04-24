// public/assets/js/reportUser.js

document.addEventListener('DOMContentLoaded', () => {
  const roleFilter = document.getElementById('roleFilter');
  const userSelect = document.getElementById('userSelect');
  let allUsers = [];

  // Utility: read auth token from cookie
  function getCookie(name) {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }

  // 1) Load users from server (with auth header)
  async function loadUsers() {
    const token = getCookie('token');
    if (!token) {
      console.warn('No token, cannot load users');
      userSelect.innerHTML = '<option disabled>Please log in to load users</option>';
      return;
    }

    try {
      const resp = await fetch('/api/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!resp.ok) {
        console.error('Failed to fetch users:', resp.status, resp.statusText);
        userSelect.innerHTML = '<option disabled>Error loading users</option>';
        return;
      }

      const { users } = await resp.json();
      allUsers = users;
      populateUsers();
      preselectFromQuery();

    } catch (err) {
      console.error('Network error loading users:', err);
      userSelect.innerHTML = '<option disabled>Error loading users</option>';
    }
  }

  // 2) Populate the dropdown based on roleFilter
  function populateUsers() {
    const filter = roleFilter.value; // all | student | tutor
    userSelect.innerHTML = '<option disabled selected value="">-- choose a user --</option>';

    allUsers
      .filter(u => {
        if (filter === 'all') return true;
        if (filter === 'student') return u.roleId === 7;  // student roleId
        if (filter === 'tutor')   return u.roleId === 8;  // tutor roleId
      })
      .forEach(u => {
        const opt = document.createElement('option');
        opt.value       = u.id;
        opt.textContent = `${u.username} (${u.email})`;
        userSelect.appendChild(opt);
      });
  }

  // 2a) Read ?reportedId=… from URL and auto-select that option
  function preselectFromQuery() {
    const params   = new URLSearchParams(window.location.search);
    const idToPick = params.get('reportedId');
    if (!idToPick) return;
    const opt = Array.from(userSelect.options)
                     .find(o => o.value === idToPick);
    if (opt) {
      userSelect.value = idToPick;
    }
  }

  // 3) Re-populate when filter changes
  roleFilter.addEventListener('change', populateUsers);

  // 4) Handle form submit
  document.getElementById('reportUserForm').addEventListener('submit', async e => {
    e.preventDefault();
    const reportedId = e.target.reportedId.value;
    const reason     = e.target.reason.value.trim();
    if (!reason) return alert('Please enter a reason.');

    const token = getCookie('token');
    if (!token) return alert('Please log in.');

    try {
      const r = await fetch('/report-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportedId, reason })
      });
      if (r.ok) {
        alert('Report submitted.');
        // Optionally clear the reason field:
        e.target.reason.value = '';
      } else {
        const { message } = await r.json();
        alert(message || 'Failed to submit report.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending report.');
    }
  });

  // Kick it off
  loadUsers();
});
