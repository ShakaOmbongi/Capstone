// Helper to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  document.addEventListener("DOMContentLoaded", async function () {
    // Get token from cookie
    const token = getCookie("token");
    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "/login";
      return;
    }
    
    try {
      // Fetch profile data from the server
      const response = await fetch("/student/profile/data", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      
      const data = await response.json();
      
      // Assume data.profile contains the user info
      const profile = data.profile || {};
      document.getElementById("studentName").textContent = profile.username || "Student";
      document.getElementById("profileName").textContent = profile.username || "Student";
      document.getElementById("email").textContent = profile.email || "email@example.edu";
      document.getElementById("emailInput").value = profile.email || "";
      document.getElementById("learningStyle").textContent = profile.learningStyle || "Not Set";
      document.getElementById("aboutMe").textContent = profile.aboutMe || "No bio available.";
      
      // Populate subjects list if provided
      const subjectsList = document.getElementById("subjectsList");
      subjectsList.innerHTML = "";
      (profile.subjects || []).forEach(subject => {
        const li = document.createElement("li");
        li.textContent = subject;
        subjectsList.appendChild(li);
      });
      
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Error loading profile");
    }
  });
  