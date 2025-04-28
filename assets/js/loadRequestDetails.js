function getCookie(name) {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const token = getCookie('token');
    const container = document.getElementById('sessionRequestsContainer');
    const loading = document.getElementById('loadingPlaceholder');
  
    if (!token || !container) {
      console.warn('Token or container missing.');
      return;
    }
  
    try {
      const res = await fetch('/student/join/requests?studentOnly=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      const data = await res.json();
      const requests = data.data?.pending || [];
  
      // Hide loading spinner
      loading.style.display = 'none';
      // Show the container
      container.style.display = 'flex';  // Use flex to make cards align nicely
  
      container.innerHTML = ''; // Clear old content
  
      if (requests.length === 0) {
        container.innerHTML = `<div class="col-12"><p class="text-muted">No session requests found.</p></div>`;
      } else {
        requests.forEach(req => {
          const card = document.createElement('div');
          card.className = 'col-md-4';
  
          const student = req.requestingStudent || {};
          const profilePic = student.profilePic || '/assets/images/white.jpeg';
          const subject = req.requestedSession?.subject || 'Unknown Subject';
          const note = req.note || 'No note provided.';
  
          card.innerHTML = `
            <div class="card shadow-sm mb-3">
              <div class="card-body d-flex">
                <img src="${profilePic}" class="rounded-circle" alt="Student Picture"
                     style="width: 80px; height: 80px; object-fit: cover;">
                <div class="ms-3">
                  <h5 class="card-title mb-1">
                    <a href="/student/details?id=${req.id}" style="text-decoration: none; color: inherit;">
                      ${student.username || 'Unknown Student'}
                    </a>
                  </h5>
                  <p class="card-text mb-1 text-muted">${subject}</p>
                  <p class="card-text text-secondary">${note}</p>
                  <a href="/student/details?id=${req.id}" class="text-dark"
                     style="font-size: 14px; text-decoration: underline;">View Request</a>
                </div>
              </div>
            </div>
          `;
  
          container.appendChild(card);
        });
      }
  
    } catch (err) {
      console.error('Error loading session requests:', err);
      loading.innerHTML = `<p class="text-danger">Failed to load session requests.</p>`;
    }
  });
  