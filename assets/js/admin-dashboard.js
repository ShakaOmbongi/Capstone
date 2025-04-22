document.addEventListener("DOMContentLoaded", async function () {
    // Elements
    const totalUsersElement = document.getElementById("total-users");
    const activeSessionsElement = document.getElementById("active-sessions");
    const pendingFeedbackElement = document.getElementById("pending-feedback");

    try {
        // Fetch total users
        const usersResponse = await fetch("/api/stats/total-users");
        const usersData = await usersResponse.json();
        totalUsersElement.textContent = usersData.count || 0;

        // Fetch active tutoring sessions
        const sessionsResponse = await fetch("/api/stats/active-sessions");
        const sessionsData = await sessionsResponse.json();
        activeSessionsElement.textContent = sessionsData.count || 0;

        // Fetch pending feedback
        const feedbackResponse = await fetch("/api/stats/pending-feedback");
        const feedbackData = await feedbackResponse.json();
        pendingFeedbackElement.textContent = feedbackData.count || 0;
        
    } catch (error) {
        console.error("Error fetching stats:", error);
    }
});
