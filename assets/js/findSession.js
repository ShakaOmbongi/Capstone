// findSession.js

document.addEventListener("DOMContentLoaded", async function () {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (!token) {
    document.getElementById('message').innerHTML = `<div class="alert alert-danger">You must be logged in to find sessions.</div>`;
    return;
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  let currentUserId = getCookie('userId');
  if (!currentUserId) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const decoded = JSON.parse(jsonPayload);
    currentUserId = decoded.id;
  }

  currentUserId = parseInt(currentUserId);

  async function loadSessions() {
    try {
      const response = await fetch('/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      const myList = document.getElementById('mySessionsList');
      const otherList = document.getElementById('otherSessionsList');
      myList.innerHTML = '';
      otherList.innerHTML = '';

      const subjectFilter = document.getElementById('filterSubject')?.value.toLowerCase() || '';
      const dateFilter = document.getElementById('filterDate')?.value || '';
      const learningStyleFilter = document.getElementById('filterLearningStyle')?.value.toLowerCase() || '';

      for (const session of data.data) {
        const matchesSubject = session.subject.toLowerCase().includes(subjectFilter);
        const matchesDate = !dateFilter || new Date(session.sessionDate).toISOString().startsWith(dateFilter);
        const matchesStyle = !learningStyleFilter || (session.tutor?.profile?.learningstyle?.toLowerCase().includes(learningStyleFilter));

        if (!matchesSubject || !matchesDate || !matchesStyle) continue;

        const item = document.createElement('div');
        item.classList.add('list-group-item', 'p-3', 'mb-2', 'shadow-sm');

        const isOwner =
          (session.tutor && parseInt(session.tutor.id) === currentUserId) ||
          (session.student && parseInt(session.student.id) === currentUserId);
          const creator = (session.tutorId === session.studentId) ? session.tutor : session.student;

          const tutorName = creator?.username || "Unknown";
          const profilePic = creator?.profilePic || "/assets/images/peerAid-tr.png";
          const bio = creator?.profile?.bio || "No bio available.";
          const learningStyle = creator?.profile?.learningstyle || "Not set";
          
        const details = `
          <div class="d-flex align-items-center mb-2">
            <img src="${profilePic}" alt="Tutor" class="rounded-circle me-3" style="width: 60px; height: 60px; object-fit: cover;">
            <div>
              <h5 class="mb-0">${session.subject}</h5>
              <small><strong>Tutor:</strong> ${tutorName}</small><br>
              <small><strong>Date:</strong> ${new Date(session.sessionDate).toLocaleString()}</small><br>
              ${session.description ? `<small><strong>Notes:</strong> ${session.description}</small><br>` : ''}
              <small><strong>Learning Style:</strong> ${learningStyle}</small><br>
              <small><strong>Bio:</strong> ${bio}</small>
            </div>
          </div>
        `;

        if (isOwner) {
          item.innerHTML = `${details}<div class="text-end">
            <button class="btn btn-primary edit-session" data-id="${session.id}">Edit</button>
            <button class="btn btn-danger delete-session" data-id="${session.id}">Delete</button>
          </div>`;
          myList.appendChild(item);
        } else {
          item.innerHTML = `${details}<div class="text-end">
            <button class="btn btn-success join-session" data-id="${session.id}">Request to Join</button>
          </div>`;
          otherList.appendChild(item);
        }
      }

      document.querySelectorAll('.join-session').forEach(button => {
        button.addEventListener('click', async function () {
          console.log('Join button clicked for session:', this.dataset.id);  // Add this debug log!
      
          const id = this.dataset.id;
          const joinRes = await fetch(`/sessions/request/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await joinRes.json();
          alert(result.message || 'Joined!');
          loadSessions();
        });
      });

      document.querySelectorAll('.delete-session').forEach(button => {
        button.addEventListener('click', async function () {
          if (!confirm("Are you sure?")) return;
          const id = this.dataset.id;
          await fetch(`/sessions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          loadSessions();
        });
      });

      document.querySelectorAll('.edit-session').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.dataset.id;
          openEditModal(id);
        });
      });
    } catch (err) {
      console.error("Error loading sessions:", err);
      document.getElementById('message').innerHTML = `<div class="alert alert-danger">Failed to load sessions.</div>`;
    }
  }

  function openEditModal(id) {
    fetch(`/sessions/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        document.getElementById('editSessionId').value = data.data.id;
        document.getElementById('editSubject').value = data.data.subject;
        document.getElementById('editDate').value = new Date(data.data.sessionDate).toISOString().slice(0, 16);
        document.getElementById('editDescription').value = data.data.description || '';
        new bootstrap.Modal(document.getElementById('editSessionModal')).show();
      });
  }

  document.getElementById('editSessionForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('editSessionId').value;
    const updated = {
      subject: document.getElementById('editSubject').value,
      sessionDate: document.getElementById('editDate').value,
      description: document.getElementById('editDescription').value,
    };
    await fetch(`/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    });
    bootstrap.Modal.getInstance(document.getElementById('editSessionModal')).hide();
    loadSessions();
  });

  // Attach filter button listener safely
  const filterButton = document.getElementById('applyFilters');
  if (filterButton) {
    filterButton.addEventListener('click', loadSessions);
  }

  loadSessions();
});
