// public/assets/js/tutorProfile.js
document.addEventListener('DOMContentLoaded', async () => {
    function getCookie(name) {
      const v = `; ${document.cookie}`;
      const parts = v.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }
  
    const token   = getCookie('token') || localStorage.getItem('token');
    const params  = new URLSearchParams(window.location.search);
    const tutorId = params.get('id');
    if (!token || !tutorId) {
      return alert('Missing auth or tutor ID.');
    }
  
    // Elements
    const picEl      = document.getElementById('profilePic');
    const nameEl     = document.getElementById('profileName');
    const styleEl    = document.getElementById('learningStyle');
    const bioEl      = document.getElementById('aboutMe');
    const subsEl     = document.getElementById('subjectsList');
    const availEl    = document.getElementById('availabilityList');
    const emailEl    = document.getElementById('email');
    const scheduleBtn= document.getElementById('scheduleBtn');
    const reviewsCon = document.getElementById('reviewsContainer');
  
    // 1) Fetch tutor’s profile by ID
    const profileRes = await fetch(`/tutoruser/profile/by-id?id=${tutorId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!profileRes.ok) return alert('Failed to load tutor profile');
    const { profile } = await profileRes.json();
  
    // Populate
    picEl.src        = profile.profilePic;
    nameEl.textContent     = profile.username;
    styleEl.textContent    = profile.learningstyle || 'Not set';
    bioEl.textContent      = profile.bio || 'No bio available.';
    emailEl.textContent    = profile.email;
    subsEl.innerHTML = profile.subjects
      .split(',').map(s => `<li>${s.trim()}</li>`).join('');
    availEl.innerHTML = profile.availability
      .split(',').map(s => `<li>${s.trim()}</li>`).join('');
  
    // 2) Fetch reviews (if you have this endpoint)
    try {
        const revRes = await fetch(
            `/feedback/tutor/reviews?tutorId=${tutorId}`,
            { headers:{ 'Authorization': `Bearer ${token}` } }
          );
          
          
      if (revRes.ok) {
        const { reviews } = await revRes.json();
        reviewsCon.innerHTML = reviews.map(r => `
          <div class="review p-3 border rounded mb-3 position-relative">
            <p><strong>${'⭐'.repeat(r.rating)}</strong></p>
            <p class="text-secondary"><em>"${r.comment}"</em></p>
            <p class="text-muted">- ${r.reviewerUsername}</p>
          </div>
        `).join('');
      }
    } catch(_) { /* silently ignore */ }
  
// after fetching profile + reviews…

// wire up the modal
const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
scheduleBtn.addEventListener('click', () => {
  // reset form
  document.getElementById('scheduleForm').reset();
  scheduleModal.show();
});

// handle the schedule form submission
document.getElementById('scheduleForm').addEventListener('submit', async e => {
  e.preventDefault();
  const date = document.getElementById('sessionDate').value;
  const time = document.getElementById('sessionTime').value;
  const note = document.getElementById('sessionNote').value.trim();

  // POST to the new custom-join route
  const res = await fetch('/student/join/custom', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tutorId, date, time, note })
  });

  const result = await res.json();
  alert(result.message || (res.ok ? 'Request sent!' : 'Failed to send request'));
  if (res.ok) scheduleModal.hide();
});

  });
  