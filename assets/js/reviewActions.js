document.addEventListener('DOMContentLoaded', function () {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
  
    const tableBody = document.getElementById('eligibleSessionsTableBody');
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    const reviewForm = document.getElementById('reviewForm');
  
    // Load sessions awaiting review
    async function loadEligibleSessions() {
      try {
        const res = await fetch('/feedback/student/reviews/eligible', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const sessions = data.data || [];
  
        tableBody.innerHTML = '';
  
        if (sessions.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="4" class="text-muted">No sessions awaiting review.</td></tr>`;
          return;
        }
  
        sessions.forEach(session => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${session.subject}</td>
            <td>${new Date(session.sessionDate).toLocaleString()}</td>
            <td>${session.tutor.username}</td>
            <td><button class="btn btn-primary btn-sm" data-session-id="${session.id}" data-tutor-id="${session.tutor.id}">Leave Review</button></td>
          `;
          tableBody.appendChild(row);
        });
  
        attachReviewButtons();
      } catch (err) {
        console.error('Error loading eligible sessions:', err);
      }
    }
  
    // Attach click handlers to "Leave Review" buttons
    function attachReviewButtons() {
      document.querySelectorAll('[data-session-id]').forEach(button => {
        button.addEventListener('click', function () {
          const sessionId = this.getAttribute('data-session-id');
          const tutorId = this.getAttribute('data-tutor-id');
          document.getElementById('sessionId').value = sessionId;
          document.getElementById('reviewForm').setAttribute('data-tutor-id', tutorId);
          reviewModal.show();
        });
      });
    }
  
    // Handle form submission
    reviewForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const sessionId = document.getElementById('sessionId').value;
      const tutorId = reviewForm.getAttribute('data-tutor-id');
      const rating = document.getElementById('rating').value;
      const comment = document.getElementById('comment').value;
  
      try {
        const res = await fetch('/feedback/student/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionId, revieweeId: tutorId, rating, comment })
        });
  
        const result = await res.json();
        if (res.ok) {
          alert('Review submitted successfully!');
          reviewModal.hide();
          loadEligibleSessions();
        } else {
          alert(result.error || 'Failed to submit review.');
        }
      } catch (err) {
        console.error('Error submitting review:', err);
      }
    });
  
    loadEligibleSessions();
  });
  