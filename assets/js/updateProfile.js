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

    const data = await response.json();
    console.log('Profile response from backend:', data);  // Debugging

    if (!data.profile) {
      console.error("Profile data missing in response.");
      alert("Failed to load profile data.");
      return;
    }

    const profile = data.profile;
    console.log('Profile object:', profile);
    console.log('Profile username:', profile.username);
    console.log('ProfilePic URL:', profile.profilePic);

    // ─── Safely update DOM elements ──────────────────────────────
    const studentNameEl = document.getElementById("studentName");
    if (studentNameEl) studentNameEl.textContent = profile.username || "Student";

    const profileNameEl = document.getElementById("profileName");
    if (profileNameEl) profileNameEl.textContent = profile.username || "Student";

    const emailEl = document.getElementById("email");
    if (emailEl) emailEl.textContent = profile.email || "email@example.edu";

    const bioEl = document.getElementById("bio");
    if (bioEl) bioEl.textContent = profile.bio || "No bio available.";

    const subjectsListEl = document.getElementById("subjectsList");
    if (subjectsListEl) {
      subjectsListEl.innerHTML = profile.subjects
        ? profile.subjects.split(',').map(s => `<li>${s.trim()}</li>`).join('')
        : '<li>No subjects listed.</li>';
    }

    const availabilityInputEl = document.getElementById("availabilityInput");
    if (availabilityInputEl) availabilityInputEl.value = profile.availability || "";

    // ─── Input fields for updating ───────────────────────────────
    const usernameInput = document.getElementById("username");
    if (usernameInput) usernameInput.value = profile.username || "";

    const emailInput = document.getElementById("emailInput");
    if (emailInput) emailInput.value = profile.email || "";

    const bioInput = document.getElementById("bioInput");
    if (bioInput) bioInput.value = profile.bio || "";

    const subjectsInput = document.getElementById("subjectsInput");
    if (subjectsInput) subjectsInput.value = profile.subjects || "";

    const learningStyleEl = document.getElementById("learningStyle");
    if (learningStyleEl) learningStyleEl.textContent = profile.learningstyle || "Learning Style Not Set";

    // ─── Profile Picture handling ────────────────────────────────
    const profilePicEl = document.getElementById("profilePic");
    if (profilePicEl) {
      console.log("Setting profilePic src to:", profile.profilePic);  // Debugging
      profilePicEl.src = profile.profilePic || "default.jpg";
    }

    // ─── Populate "Current Availability" list ────────────────────
    const currentList = document.getElementById("currentAvailability");
    if (currentList) {
      currentList.innerHTML = profile.availability
        ? profile.availability.split(',').map(slot => `<li>${slot.trim()}</li>`).join('')
        : '<li>No availability set.</li>';
    }

  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile.");
  }

  // ─── 2) Update profile form submission ─────────────────────────
  const updateForm = document.getElementById("updateProfileForm");
  if (updateForm) {
    updateForm.addEventListener("submit", async function (event) {
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
        console.log('Profile update response:', result);  // Debugging

        if (!response.ok) {
          alert(result.error || "Failed to update profile.");
          return;
        }

        alert("Profile updated successfully!");
        window.location.reload(); // Refresh to see changes

      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile.");
      }
    });
  }

  // ─── 3) Wire up the “Add Availability” button ──────────────────
  const addBtn = document.getElementById("addAvailabilityBtn");
  if (addBtn) {
    addBtn.addEventListener("click", addAvailability);
  }
});

// ─── 4) Add availability block to the textarea ───────────────────
function addAvailability() {
  const day   = document.getElementById("daySelect").value;
  const start = document.getElementById("startTimeSelect").value;
  const end   = document.getElementById("endTimeSelect").value;

  if (day === "Day" || start === "Start Time" || end === "End Time") {
    return alert("Please select a valid day, start time, and end time.");
  }

  const availabilityInput = document.getElementById("availabilityInput");
  const newEntry = `${day} ${start}-${end}`;
  availabilityInput.value
    ? availabilityInput.value += `, ${newEntry}`
    : availabilityInput.value = newEntry;

  // Reset dropdowns
  document.getElementById("daySelect").selectedIndex = 0;
  document.getElementById("startTimeSelect").selectedIndex = 0;
  document.getElementById("endTimeSelect").selectedIndex = 0;
}
