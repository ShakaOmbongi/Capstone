document.addEventListener("DOMContentLoaded", async function () {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  
    const tableBody = document.getElementById("adminFeedbackTableBody");
  
    async function loadFeedback() {
      try {
        const res = await fetch("http://localhost:3000/admin/feedback", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const data = await res.json();
        const feedbacks = data.data || [];
  
        tableBody.innerHTML = '';
  
        feedbacks.forEach((fb) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${fb.reviewer?.username || 'N/A'}</td>
            <td>${fb.reviewee?.username || 'N/A'}</td>
            <td>${fb.rating}</td>
            <td>${fb.comment}</td>
            <td>
              <button class="btn btn-danger delete-feedback" data-id="${fb.id}">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
  
        attachFeedbackEventListeners();
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      }
    }
  
    function attachFeedbackEventListeners() {
      document.querySelectorAll(".delete-feedback").forEach((button) => {
        button.addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          handleDeleteFeedback(id);
        });
      });
    }
  
    async function handleDeleteFeedback(id) {
      const confirmDelete = confirm("Are you sure you want to delete this feedback?");
      if (!confirmDelete) return;
  
      const res = await fetch(`http://localhost:3000/admin/feedback/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const result = await res.json();
      alert(result.message || "Feedback deleted.");
      loadFeedback(); // Refresh the table
    }
  
    loadFeedback();
  });
  