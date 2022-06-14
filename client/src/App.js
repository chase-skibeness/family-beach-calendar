import './App.css';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import Container from 'react-bootstrap/Container';
import LoadingSpinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BookingForm from './BookingForm';

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const URL = process.env.REACT_APP_URL;

  const isMobileScreen = useMediaQuery({ query: '(max-width: 800px)' });

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error(`This is an HTTP error: The status is ${res.status}`);
        return res.json();
      })
      .then((result) => {
        setBookings(result);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setBookings(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [show]);

  function bookingsToEvents(bookings) {
    return (
      bookings &&
      bookings.map((booking) => {
        return {
          id: booking._id,
          start: booking.start_date,
          end: booking.end_date,
          title:
            `${booking.name}` +
            (booking.guest_count > 0 ? ` and ${booking.guest_count} guests` : ''),
          allDay: true
        };
      })
    );
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="App">
      <Container fluid className="CalendarContainer">
        <h1>Family Beach Calendar</h1>
        {loading && (
          <LoadingSpinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </LoadingSpinner>
        )}
        {error && (
          <Alert variant={'danger'}>
            There was a problem gathering the data, please refresh the page.
          </Alert>
        )}
        <Button variant="primary" onClick={handleShow}>
          Book the Beach
        </Button>
        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <BookingForm handleClose={handleClose} />
        </Modal>
        <FullCalendar
          initialView={isMobileScreen ? 'listMonth' : 'dayGridMonth'}
          plugins={[dayGridPlugin, listPlugin]}
          events={bookingsToEvents(bookings)}
          height="100%"
        />
      </Container>
    </div>
  );
}

export default App;
