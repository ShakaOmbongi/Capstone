document.addEventListener('DOMContentLoaded', function () {
    console.log('shared.js loaded!'); // Debugging
  
    // Check if the current page is settings.html
    if (window.location.pathname.includes('settings.html')) {
      console.log('Running settings page logic...'); // Debugging
  
      // Function to save checkbox state to localStorage
      function saveCheckboxState(checkboxId) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
          console.log(`Checkbox found: ${checkboxId}`); // Debugging
  
          // Load saved state from localStorage
          const savedState = localStorage.getItem(checkboxId);
          if (savedState !== null) {
            checkbox.checked = savedState === 'true'; // Restore the checkbox state
          }
  
          // Save state when checkbox is toggled
          checkbox.addEventListener('change', function () {
            console.log(`Checkbox ${checkboxId} changed to ${this.checked}`); // Debugging
            localStorage.setItem(checkboxId, this.checked);
            console.log(`Saved ${checkboxId} to localStorage:`, this.checked); // Debugging
          });
        } else {
          console.error(`Checkbox not found: ${checkboxId}`); // Debugging
        }
      }
  
      // Save state for each checkbox
      saveCheckboxState('toggleSection2');
      saveCheckboxState('toggleSection3');
      saveCheckboxState('toggleSection4');
      saveCheckboxState('toggleSection5');
      saveCheckboxState('toggleSection6');
    }
  
    // Check if the current page is dashboard.html
    if (window.location.pathname.includes('dashboard.html')) {
      console.log('Running dashboard page logic...'); // Debugging
  
      // Function to toggle visibility based on localStorage
      function toggleSectionVisibility(sectionId, checkboxId) {
        const section = document.getElementById(sectionId);
        const savedState = localStorage.getItem(checkboxId);
  
        if (section && savedState !== null) {
          const isVisible = savedState === 'true';
          section.style.display = isVisible ? 'block' : 'none';
          console.log(`Set visibility for ${sectionId}:`, isVisible); // Debugging
        } else {
          console.error(`Element not found: ${sectionId} or no saved state for ${checkboxId}`); // Debugging
        }
      }
  
      // Toggle visibility for each section
      toggleSectionVisibility('upcoming-schedule', 'toggleSection2');
      toggleSectionVisibility('peer-tutor-matches', 'toggleSection3');
      toggleSectionVisibility('session-requests', 'toggleSection4');
      toggleSectionVisibility('calendar-section', 'toggleSection5');
      toggleSectionVisibility('messages-section', 'toggleSection6');
    }
  });