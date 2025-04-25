document.addEventListener('DOMContentLoaded', async () => {
  // Helper to read the JWT from cookie (or fallback to localStorage)
  function getCookie(name) {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }

  const token = getCookie('token') || localStorage.getItem('token');

  // DOM refs
  const nameFilterInput = document.getElementById('filterName');
  const subjectFilterInput = document.getElementById('filterSubject');
  const listContainer = document.getElementById('tutorList');
  const messageDiv = document.getElementById('message');
  const applyBtn = document.getElementById('applyFilters');

  // Require auth
  if (!token) {
    messageDiv.innerHTML =
      `<div class="alert alert-danger">Please log in to view tutors.</div>`;
    return;
  }

  // Core loader
  async function loadTutors() {
    listContainer.innerHTML = '';
    messageDiv.innerHTML = '';

    try {
      // Fetch all users
      const resp = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error('Failed to fetch tutors');
      const { users } = await resp.json();

      // Filter tutors by roleId = 8 (TUTOR)
      let filtered = users.filter(u => u.roleId === 8);  // <-- Only TUTORS

      // Apply client-side name filter
      const nameTerm = nameFilterInput?.value.trim().toLowerCase() || '';
      if (nameTerm) {
        filtered = filtered.filter(u =>
          u.username.toLowerCase().includes(nameTerm)
        );
      }

      // Apply client-side subject filter
      const subjTerm = subjectFilterInput?.value.trim().toLowerCase() || '';
      if (subjTerm) {
        filtered = filtered.filter(u =>
          u.subjects
            .split(',')
            .some(s => s.trim().toLowerCase().includes(subjTerm))
        );
      }

      // No tutors found
      if (!filtered.length) {
        messageDiv.innerHTML =
          `<div class="alert alert-info">No tutors found.</div>`;
        return;
      }

      // Render each tutor
      filtered.forEach(u => {
        const pic = u.profilePic || '/assets/images/white.jpeg';
        const bio = u.bio || 'No bio available.';
        const subjects = u.subjects
          ? u.subjects.split(',').map(s => s.trim()).join(', ')
          : 'None specified';

        const item = document.createElement('div');
        item.className = 'list-group-item mb-2 shadow-sm d-flex align-items-center';
        item.innerHTML = `
          <img src="${pic}" class="rounded-circle me-3" 
               style="width:60px;height:60px;object-fit:cover;">
          <div class="flex-grow-1">
            <h5 class="mb-1">${u.username}</h5>
            <small>${bio}</small><br/>
            <small><strong>Subjects:</strong> ${subjects}</small>
          </div>
          <a href="/student/tutorProfile?id=${u.id}" 
             class="btn btn-outline-primary btn-sm">
            View Profile
          </a>
        `;
        listContainer.appendChild(item);
      });

    } catch (err) {
      console.error(err);
      messageDiv.innerHTML =
        `<div class="alert alert-danger">Error loading tutors.</div>`;
    }
  }

  applyBtn?.addEventListener('click', loadTutors);
  loadTutors();
});
