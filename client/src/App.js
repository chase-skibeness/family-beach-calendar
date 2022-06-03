import './App.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function App() {
  const handleDateClick = (arg) => {
    console.log(arg.dateStr);
  };

  return (
    <div className="App">
      <div className="Container FormContainer">
        <header>
          <h1>Hello World</h1>
        </header>
      </div>
      <div className="Container CalendarContainer">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={[{ title: 'event 1', date: '2022-06-01' }]}
        />
      </div>
    </div>
  );
}

export default App;
