import { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import Container from 'react-bootstrap/Container';
import LoadingSpinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import BookingForm from './BookingForm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import moment from 'moment';
import useTides from './useTides';

function App() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedDates, setSelectedDates] = useState();
  const calendarRef = useRef(null);
  // eslint-disable-next-line no-undef
  const URL = process.env.REACT_APP_URL;
  const isMobileScreen = useMediaQuery({ query: '(max-width: 800px)' });

  let today = moment();
  let tides = getTidesForYear(today);

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

  useEffect(() => {
    getEvents();
  }, [bookings]);

  function getTidesForYear(date) {
    return useTides({
      startDate: `${date.format('YYYY')}0101`,
      endDate: `${date.format('YYYY')}1231`
    });
  }

  function tidesToEvents(tides) {
    const tideEvents = tides
      .map((tide) => {
        return [
          {
            start: new Date(tide.lowTide.t).toISOString(),
            end: new Date(tide.lowTide.t).toISOString(),
            title: `Low Tide: ${tide.lowTide.v}`
          },
          {
            start: new Date(tide.highTide.t).toISOString(),
            end: new Date(tide.highTide.t).toISOString(),
            title: `High Tide: ${tide.highTide.v}`
          }
        ];
      })
      .flat();
    return tideEvents;
  }

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

  function getEvents() {
    const newEvents = [];
    newEvents.push(tidesToEvents(tides));
    newEvents.push(bookingsToEvents(bookings));
    setEvents(newEvents.flat());
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleDateSelect(info) {
    setSelectedDates({
      start: info.start,
      end: info.end,
      startStr: moment(info.start).format('YYYY-MM-DD'),
      endStr: moment(info.end).subtract(1, 'days').format('YYYY-MM-DD')
    });
    handleShow();
  }

  function handleUnselect() {
    setSelectedDates({ start: '', end: '' });
  }

  return (
    <div className="App">
      <Container fluid>
        <Navbar>
          <Container className="NavbarContainer">
            <Navbar.Brand>Skibeness Beach Calendar</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
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
              <Button variant="primary" onClick={handleShow} className="bookButton">
                {isMobileScreen ? <i className="bi bi-calendar-plus"></i> : 'Book the Beach'}
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <BookingForm handleClose={handleClose} selectedDates={selectedDates} />
        </Modal>
        <Container className="CalendarContainer">
          <FullCalendar
            ref={calendarRef}
            initialView={isMobileScreen ? 'listMonth' : 'dayGridMonth'}
            plugins={[dayGridPlugin, listPlugin, bootstrap5Plugin, interactionPlugin]}
            events={events}
            themeSystem="bootstrap5"
            selectable="true"
            select={handleDateSelect}
            unselect={handleUnselect}
            height={'100%'}
          />
        </Container>
      </Container>
    </div>
  );
}

export default App;
