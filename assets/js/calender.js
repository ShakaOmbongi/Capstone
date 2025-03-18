document.addEventListener('DOMContentLoaded', async function () {
    var calendarEl = document.getElementById('calendar');
    let events = [];
    try {
      const response = await fetch('/student/sessions', { credentials: 'include' });
      const data = await response.json();
      events = data.events || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: events
    });
    calendar.render();
  });