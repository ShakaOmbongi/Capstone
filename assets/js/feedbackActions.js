document.addEventListener("DOMContentLoaded", function () {
  // Attach feedback event listeners after DOM loads
  attachFeedbackEventListeners();
});

function attachFeedbackEventListeners() {
  document.querySelectorAll(".delete-feedback").forEach(button => {
    button.addEventListener("click", function () {
      const feedbackId = this.getAttribute("data-id");
      handleDeleteFeedback(feedbackId);
    });
  });

  document.querySelectorAll(".edit-feedback").forEach(button => {
    button.addEventListener("click", function () {
      const feedbackId = this.getAttribute("data-id");
      handleEditFeedback(feedbackId);
    });
  });
}

function handleDeleteFeedback(feedbackId) {
  if (confirm("Are you sure you want to delete this feedback?")) {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    fetch(`http://localhost:3000/feedback/${feedbackId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          alert("Feedback deleted successfully");
          location.reload();
        } else {
          alert("Failed to delete feedback");
        }
      })
      .catch(error => {
        console.error("Error deleting feedback:", error);
        alert("An error occurred while deleting feedback.");
      });
  }
}

function handleEditFeedback(feedbackId) {
  alert(`Edit functionality for feedback ${feedbackId} not implemented yet.`);
}
