document.addEventListener('DOMContentLoaded', async function() {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">You must be logged in to find sessions.</div>`;
        return;
    }

    async function loadSessions() {
        try {
            const response = await fetch('http://localhost:3000/sessions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            const sessionsList = document.getElementById('sessionsList');
            sessionsList.innerHTML = '';

            // Adjusted to use "data.data" based on your backend response
            if (!data.data || data.data.length === 0) {
                sessionsList.innerHTML = '<p class="text-muted">No available sessions.</p>';
                return;
            }

            data.data.forEach(session => {
                const sessionItem = document.createElement('div');
                sessionItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                sessionItem.innerHTML = `
                    <div>
                        <h5>${session.subject}</h5>
                        <p>Date: ${new Date(session.sessionDate).toLocaleString()}</p>
                    </div>
                    <button class="btn btn-success join-session" data-id="${session.id}">Request to Join</button>
                `;

                sessionsList.appendChild(sessionItem);
            });

            document.querySelectorAll('.join-session').forEach(button => {
                button.addEventListener('click', async function() {
                    const sessionId = this.getAttribute('data-id');

                    // Ensure that you have an endpoint defined for joining a session
                    const joinResponse = await fetch(`http://localhost:3000/sessions/request/${sessionId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await joinResponse.json();
                    if (joinResponse.ok) {
                        alert('You have successfully joined the session!');
                        loadSessions(); // Reload sessions list
                    } else {
                        alert(result.error || 'Failed to join session');
                    }
                });
            });
        } catch (error) {
            console.error("Error fetching sessions:", error);
            document.getElementById('message').innerHTML = `<div class="alert alert-danger">Failed to load sessions. Try again later.</div>`;
        }
    }

    loadSessions();
});
