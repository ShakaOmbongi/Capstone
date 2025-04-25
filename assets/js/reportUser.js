// public/assets/js/reportUser.js
document.addEventListener('DOMContentLoaded', () => {
  const roleFilter = document.getElementById('roleFilter');
  const userSelect = document.getElementById('userSelect');
  let allUsers = [];

  // Utility: read auth token from cookie
  function getCookie(name) {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2
      ? parts.pop().split(';').shift()
      : null;
  }

  // 1) Load users from server
  async function loadUsers() {
    const token = getCookie('token');
    if (!token) {
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
      if (!resp.ok) throw new Error('Failed to fetch users');

      const { users } = await resp.json();
      allUsers = users;
      populateUsers();
      preselectFromQuery();

    } catch (err) {
      console.error('Error loading users:', err);
      userSelect.innerHTML = '<option disabled>Error loading users</option>';
    }
  }

  // 2) Fill the <select> based on roleFilter.value
  function populateUsers() {
    const filter = roleFilter.value; // "all" | "student" | "tutor"
    userSelect.innerHTML = '<option disabled selected value="">-- choose a user --</option>';

    allUsers
      .filter(u => {
        if (filter === 'all') return true;   
                          // show everyone
        if (filter === 'student') {
          // either using string role or numeric roleId
          return u.role === 'STUDENT' || u.roleId === 7;
        }
        if (filter === 'tutor') {
          return u.role === 'TUTOR'   || u.roleId === 8;
        }
        return false;
      })
      .forEach(u => {
        const opt = document.createElement('option');
        opt.value       = u.id;
        opt.textContent = `${u.username} (${u.email})`;
        userSelect.appendChild(opt);
      });
  }

  // 2a) If URL has ?reportedId=123, auto‐select that option
  function preselectFromQuery() {
    const idToPick = new URLSearchParams(window.location.search).get('reportedId');
    if (!idToPick) return;
    const opt = Array.from(userSelect.options).find(o => o.value === idToPick);
    if (opt) userSelect.value = idToPick;
  }

  // 3) Re-filter when the user changes the role dropdown
  roleFilter.addEventListener('change', populateUsers);

  // 4) Handle the “Report User” form submit
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

  // Kick it all off
  loadUsers();
});
