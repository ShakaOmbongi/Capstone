// public/assets/js/updateprofile.js

document.addEventListener("DOMContentLoaded", async function () {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const token = getCookie("token");
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "/login";
    return;
  }

  // ─── 1) Load profile data ──────────────────────────────────────
  try {
    const response = await fetch("/student/profile/data", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch profile");

    const data    = await response.json();
    const profile = data.profile || {};

    // Display basic info
    document.getElementById("studentName").textContent     = profile.username || "Student";
    document.getElementById("profileName").textContent     = profile.username || "Student";
    document.getElementById("email").textContent           = profile.email || "email@example.edu";
    document.getElementById("bio").textContent             = profile.bio   || "No bio available.";
    document.getElementById("subjectsList").innerHTML      = profile.subjects
      ? profile.subjects.split(',').map(s => `<li>${s.trim()}</li>`).join('')
      : '<li>No subjects listed.</li>';
    document.getElementById("availabilityInput").value     = profile.availability || "";

    document.getElementById("username").value              = profile.username || "";
    document.getElementById("emailInput").value            = profile.email    || "";
    document.getElementById("bioInput").value              = profile.bio      || "";
    document.getElementById("subjectsInput").value         = profile.subjects || "";

    if (document.getElementById("learningStyle")) {
      document.getElementById("learningStyle").textContent = profile.learningstyle || "Learning Style Not Set";
    }
    if (document.getElementById("profilePic")) {
      document.getElementById("profilePic").src             = profile.profilePic || "default.jpg";
    }

    // ─── Populate "Current Availability" list ───────────────────
    const currentList = document.getElementById("currentAvailability"); // ← ERROR HERE? if this ID is missing, `.getElementById` returns null
    if (profile.availability) {
      currentList.innerHTML = profile.availability
        .split(',')
        .map(slot => `<li>${slot.trim()}</li>`)
        .join('');
    } else {
      currentList.innerHTML = '<li>No availability set.</li>';
    }

  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile");
  }

  // ─── 2) Update profile form submission ────────────────────────
  document.getElementById("updateProfileForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const token = getCookie("token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      return;
    }

    const formData = new FormData(this);
    try {
      const response = await fetch("/student/updateProfile", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Failed to update profile.");
        return;
      }

      alert("Profile updated successfully!");
      // Refresh displayed fields
      document.getElementById("studentName").textContent     = result.data.username;
      document.getElementById("profileName").textContent     = result.data.username;
      document.getElementById("email").textContent           = result.data.email;
      document.getElementById("bio").textContent             = result.data.bio || "No bio available.";
      document.getElementById("availabilityInput").value     = result.data.availability || "";
      document.getElementById("subjectsList").innerHTML      = result.data.subjects
        ? result.data.subjects.split(',').map(s => `<li>${s.trim()}</li>`).join('')
        : '<li>No subjects listed.</li>';
      if (document.getElementById("profilePic")) {
        document.getElementById("profilePic").src = result.data.profilePic || "default.jpg";
      }
      // Re-populate the "Current Availability" list after update
      const currentList = document.getElementById("currentAvailability");
      currentList.innerHTML = result.data.availability
        ? result.data.availability.split(',').map(s => `<li>${s.trim()}</li>`).join('')
        : '<li>No availability set.</li>';

      document.cookie = `username=${result.data.username}; path=/;`;

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  });

  // ─── 3) Wire up the “Add Availability” button ───────────────
  const addBtn = document.getElementById("addAvailabilityBtn");
  if (addBtn) {
    addBtn.addEventListener("click", addAvailability);
  }
});

// ─── 4) Add availability block to the textarea ────────────────
function addAvailability() {
  const day   = document.getElementById("daySelect").value;
  const start = document.getElementById("startTimeSelect").value;
  const end   = document.getElementById("endTimeSelect").value;

  if (day === "Day" || start === "Start Time" || end === "End Time") {
    return alert("Please select a valid day, start time, and end time.");
  }

  const availabilityInput = document.getElementById("availabilityInput");
  const newEntry          = `${day} ${start}-${end}`;
  availabilityInput.value
    ? availabilityInput.value += `, ${newEntry}`
    : availabilityInput.value = newEntry;

  // Reset dropdowns
  document.getElementById("daySelect").selectedIndex       = 0;
  document.getElementById("startTimeSelect").selectedIndex = 0;
  document.getElementById("endTimeSelect").selectedIndex   = 0;
}
