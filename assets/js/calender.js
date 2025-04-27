document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const cardsContainer = document.getElementById('sessionCardsContainer');

  let events = [];
  try {
    const response = await fetch('/student/sessions', { credentials: 'include' });
    const data = await response.json();
    events = data.events || [];
  } catch (error) {
    console.error('Error loading calendar events:', error);
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events,
    eventClick: function(info) {
      const title = info.event.title;
      const date = new Date(info.event.start).toLocaleString();
      const description = info.event.extendedProps.description;
      alert(`Session: ${title}\nDate: ${date}\nDescription: ${description}`);
    }
  });
  calendar.render();

  if (cardsContainer) {
    cardsContainer.innerHTML = ''; 

    events.forEach(event => {
      const card = document.createElement('div');
      card.classList.add('col-md-4');

      const cardHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${event.title}</h5>
            <p class="card-text">${new Date(event.start).toLocaleString()}</p>
            ${event.extendedProps && event.extendedProps.description ? 
              `<p class="card-text">${event.extendedProps.description}</p>` 
              : ''}
          </div>
        </div>
      `;

      card.innerHTML = cardHTML;
      cardsContainer.appendChild(card);
    });
  }
});
