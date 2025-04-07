document.addEventListener("DOMContentLoaded", async function () {
  // Helper to get a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Get the token from cookies
  const token = getCookie("token");
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "/tutorlogin"; // Redirect to tutor login page
    return;
  }

  // Fetch and pre-populate the current tutor profile data
  try {
    const response = await fetch("/tutor/profile/data", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    const profile = data.profile || {};

    // Update profile display elements on the page
    document.getElementById("tutorName").textContent = profile.username || "Tutor";
    document.getElementById("profileName").textContent = profile.username || "Tutor";
    document.getElementById("email").textContent = profile.email || "email@example.edu";

    // Pre-populate the update form fields
    document.getElementById("username").value = profile.username || "";
    document.getElementById("emailInput").value = profile.email || "";
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Error loading profile");
  }

  // Listen for update profile form submission
  document.getElementById("updateProfileForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Re-fetch the token
    const token = getCookie("token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      return;
    }

    // Get the updated values from the input fields
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("emailInput");
    if (!usernameInput || !emailInput) {
      alert("Required input elements are missing.");
      return;
    }
    const newUsername = usernameInput.value;
    const newEmail = emailInput.value;

    // Send the updated profile data to the server
    try {
      const response = await fetch("/tutor/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername, email: newEmail })
      });

      const result = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        // Update the display elements on the page with new data
        document.getElementById("tutorName").textContent = newUsername;
        document.getElementById("profileName").textContent = newUsername;
        document.getElementById("email").textContent = newEmail;

        // Update the username cookie so that the dashboard displays the new name
        document.cookie = `username=${newUsername}; path=/;`;
      } else {
        alert(result.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  });
});
