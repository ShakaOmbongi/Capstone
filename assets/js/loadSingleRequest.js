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
      const res = await fetch(`/student/join/request/${requestId}/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      const { data } = await res.json();
      console.log('Loaded request details:', data);  // Debugging log
  
      // Populate DOM elements with fetched data
      document.getElementById('studentProfilePic').src = data.student.profilePic || '/assets/images/white.jpeg';
      document.getElementById('studentName').textContent = data.student.username || 'Unknown Student';
      document.getElementById('studentSubjects').textContent = data.student.subjects || 'No subjects listed';
      document.getElementById('studentBio').textContent = data.student.bio || 'No bio provided';
  
      // Hook up action buttons
      document.getElementById('acceptBtn').addEventListener('click', async () => {
        await handleRequestAction('accept', requestId, token);
      });
  
      document.getElementById('declineBtn').addEventListener('click', async () => {
        await handleRequestAction('reject', requestId, token);
      });
  
    } catch (err) {
      console.error('Error loading request details:', err);
    }
  });
  
  async function handleRequestAction(action, requestId, token) {
    try {
      const res = await fetch(`/student/join/requests/${action}/${requestId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      const result = await res.json();
      if (res.ok) {
        alert(`Request ${action}ed successfully`);
        window.location.href = '/student/studentdashboard';  // Redirect back to dashboard
      } else {
        alert(result.error || `Failed to ${action} request`);
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  }
  