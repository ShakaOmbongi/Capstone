// public/assets/js/findTutors.js
document.addEventListener('DOMContentLoaded', async () => {
    // helper to read the JWT from cookie (or fallback to localStorage)
    function getCookie(name) {
      const v = `; ${document.cookie}`;
      const parts = v.split(`; ${name}=`);
      return parts.length === 2 
        ? parts.pop().split(';').shift() 
        : null;
    }
    const token = getCookie('token') || localStorage.getItem('token');
    
    // DOM refs
    const nameFilterInput    = document.getElementById('filterName');
    const subjectFilterInput = document.getElementById('filterSubject');
    const listContainer      = document.getElementById('tutorList');
    const messageDiv         = document.getElementById('message');
    const applyBtn           = document.getElementById('applyFilters');
    
    // require auth
    if (!token) {
      messageDiv.innerHTML = 
        `<div class="alert alert-danger">Please log in to view tutors.</div>`;
      return;
    }
  
    // core loader
    async function loadTutors() {
      listContainer.innerHTML = '';
      messageDiv.innerHTML    = '';
  
      try {
        // fetch all users (you might want to filter server‐side to roleId=2)
        const resp = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error('Failed to fetch tutors');
        const { users } = await resp.json();
  
        // apply client‐side filters
        let filtered = users;
        const nameTerm = nameFilterInput?.value.trim().toLowerCase() || '';
        if (nameTerm) {
          filtered = filtered.filter(u =>
            u.username.toLowerCase().includes(nameTerm)
          );
        }
        const subjTerm = subjectFilterInput?.value.trim().toLowerCase() || '';
        if (subjTerm) {
          filtered = filtered.filter(u =>
            u.subjects
              .split(',')
              .some(s => s.trim().toLowerCase().includes(subjTerm))
          );
        }
  
        if (!filtered.length) {
          messageDiv.innerHTML =
            `<div class="alert alert-info">No tutors found.</div>`;
          return;
        }
  
        // render each tutor
        filtered.forEach(u => {
          const pic      = u.profilePic || '/assets/images/white.jpeg';
          const bio      = u.bio        || 'No bio available.';
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
   class="btn btn-outline-danger btn-sm">
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
  