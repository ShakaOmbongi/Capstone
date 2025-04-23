document.addEventListener('DOMContentLoaded', async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    const tableBody = document.getElementById('tutorReviewsTableBody');
  
    try {
      const res = await fetch('http://localhost:3000/feedback/tutor/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const reviews = data.data || [];
  
      tableBody.innerHTML = '';
      if (reviews.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-muted">No reviews yet.</td></tr>`;
        return;
      }
  
      reviews.forEach(review => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${review.reviewer?.username || 'Unknown'}</td>
          <td>${review.session?.subject || 'Unknown'}</td>
          <td>${review.rating}</td>
          <td>${review.comment || ''}</td>
          <td>${new Date(review.createdAt).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Error loading tutor reviews:', err);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load reviews.</td></tr>`;
    }
  });
  