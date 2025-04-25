document.addEventListener("DOMContentLoaded", async function () {
  const token = getToken();
  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
    return;
  }

  await loadEligibleSessions(token);
  await loadFeedbackGiven(token);
  await loadFeedbackReceived(token);
  attachFeedbackEventListeners(); // Handles delete/edit
});

// Token retrieval
function getToken() {
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  return cookieToken || localStorage.getItem('token');
}

// Load eligible sessions (pending reviews)
async function loadEligibleSessions(token) {
  const tbody = document.getElementById("eligibleSessionsTableBody");
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Loading...</td></tr>';

  try {
    const res = await fetch("/student/reviews/eligible", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    tbody.innerHTML = "";

    if (!data.sessions.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No sessions awaiting review.</td></tr>';
      return;
    }

    data.sessions.forEach(session => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${session.subject}</td>
        <td>${new Date(session.sessionDate).toLocaleString()}</td>
        <td>${session.tutor.username}</td>
        <td><a href="/student/reviewForm?sessionId=${session.id}" class="btn btn-primary btn-sm">Leave Review</a></td>`;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading eligible sessions:", error);
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading sessions.</td></tr>';
  }
}

// Load feedback you've given
async function loadFeedbackGiven(token) {
  const tbody = document.getElementById("feedbackGivenTableBody");
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Loading...</td></tr>';

  try {
    const res = await fetch("/student/reviews/given", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    tbody.innerHTML = "";

    if (!data.feedbacks.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No reviews given yet.</td></tr>';
      return;
    }

    data.feedbacks.forEach(feedback => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${feedback.reviewee.username}</td>
        <td>${feedback.rating}</td>
        <td>${feedback.comment}</td>
        <td>
          <button class="edit-feedback btn btn-info btn-sm" data-id="${feedback.id}" data-rating="${feedback.rating}" data-comment="${feedback.comment}">Edit</button>
          <button class="delete-feedback btn btn-danger btn-sm" data-id="${feedback.id}">Delete</button>
        </td>`;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading given feedback:", error);
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading reviews.</td></tr>';
  }
}

// Load feedback received about you
async function loadFeedbackReceived(token) {
  const tbody = document.getElementById("feedbackReceivedTableBody");
  tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Loading...</td></tr>';

  try {
    const res = await fetch("/student/reviews/received", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    tbody.innerHTML = "";

    if (!data.feedbacks.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No feedback received yet.</td></tr>';
      return;
    }

    data.feedbacks.forEach(feedback => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${feedback.reviewer.username}</td>
        <td>${feedback.rating}</td>
        <td>${feedback.comment}</td>`;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading received feedback:", error);
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error loading feedback.</td></tr>';
  }
}

// Delete & Edit feedback logic
function attachFeedbackEventListeners() {
  document.addEventListener("click", async function (e) {
    const token = getToken();

    // DELETE FEEDBACK
    if (e.target.classList.contains("delete-feedback")) {
      const feedbackId = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this feedback?")) {
        try {
          const res = await fetch(`/feedback/${feedbackId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            alert("Feedback deleted.");
            location.reload();
          } else {
            alert("Failed to delete feedback.");
          }
        } catch (err) {
          console.error("Error deleting feedback:", err);
        }
      }
    }

    // EDIT FEEDBACK
    if (e.target.classList.contains("edit-feedback")) {
      const feedbackId = e.target.dataset.id;
      const currentRating = e.target.dataset.rating;
      const currentComment = e.target.dataset.comment;

      const newRating = prompt("Enter new rating (1-5):", currentRating);
      const newComment = prompt("Enter new comment:", currentComment);

      if (!newRating || !newComment) {
        alert("Rating and comment are required.");
        return;
      }

      try {
        const res = await fetch(`/feedback/${feedbackId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ rating: parseInt(newRating), comment: newComment })
        });
        if (res.ok) {
          alert("Feedback updated successfully.");
          location.reload();
        } else {
          alert("Failed to update feedback.");
        }
      } catch (err) {
        console.error("Error updating feedback:", err);
      }
    }
  });
}
