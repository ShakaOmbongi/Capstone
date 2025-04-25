document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');

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
    contentHeight: 'auto', // ✅ Or use height: 'auto' or height: 600
    expandRows: true, // ✅ Optional but helpful for full height layout
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
});
