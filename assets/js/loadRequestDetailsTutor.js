// Helper: Get cookie value
function getCookie(name) {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const token = getCookie('token');
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get('id');
  
    if (!token || !requestId) {
      console.warn('Missing token or request ID');
      return;
    }
  
    try {
      const res = await fetch(`/tutoruser/join/request/${requestId}/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch details: ${res.status}`);
      }
  
      const { data } = await res.json();
      console.log('Loaded request details:', data);
  
      // Safely populate DOM elements
      const imgEl = document.getElementById('studentProfilePic');
      const nameEl = document.getElementById('studentName');
      const subjEl = document.getElementById('studentSubjects');
      const bioEl = document.getElementById('studentBio');
  
      if (!data || !data.student) {
        throw new Error('Incomplete student data');
      }
  
      if (imgEl) imgEl.src = data.student.profilePic || '/assets/images/white.jpeg';
      if (nameEl) nameEl.textContent = data.student.username || 'Unknown Student';
      if (subjEl) subjEl.textContent = data.student.subjects || 'No subjects listed';
      if (bioEl) bioEl.textContent = data.student.bio || 'No bio provided';
  
      // Handle Accept / Decline buttons
      const acceptBtn = document.getElementById('acceptBtn');
      const declineBtn = document.getElementById('declineBtn');
  
      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => handleRequestAction('accept', requestId, token));
      }
  
      if (declineBtn) {
        declineBtn.addEventListener('click', () => handleRequestAction('reject', requestId, token));
      }
  
    } catch (err) {
      console.error('Error loading request details:', err);
      alert('Failed to load request details.');
    }
  });
  
  // Accept / Decline logic
  async function handleRequestAction(action, requestId, token) {
    try {
      const res = await fetch(`/tutoruser/join/requests/${action}/${requestId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert(`Request ${action}ed successfully`);
        window.location.href = '/tutoruser/tutordashboard';
      } else {
        alert(result.error || `Failed to ${action} request`);
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  }
  