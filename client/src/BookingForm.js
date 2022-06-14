import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';

function BookingForm({ handleClose }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState();
  const [message, setMessage] = useState();
  const [newBooking, setNewBooking] = useState({
    name: null,
    start_date: null,
    end_date: null,
    guest_count: 0,
    private_stay: false
  });

  const URL = 'http://localhost:30000/api/bookings';

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    newBooking.private_stay = newBooking.private_stay === 'on' ? true : false;
    newBooking.start_date = new Date(newBooking.start_date);
    newBooking.end_date = new Date(newBooking.end_date);
    setValidated(true);
    setLoading(true);
    event.preventDefault();
    try {
      let res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(newBooking)
      });
      if (res.status === 200) {
        setLoading(false);
        setSuccess(true);
        setNewBooking({
          name: null,
          start_date: null,
          end_date: null,
          guest_count: 0,
          private_stay: false
        });
        setMessage('Booking created successfully!');
      } else {
        setSuccess(false);
        setLoading(false);
        setMessage('There was a problem creating your booking');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit} validated={validated}>
      <Modal.Header closeButton>
        <Modal.Title>New Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Who are you?</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter your name"
            required
            onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })}
          />
          <Form.Label>How many guests will you have with you?</Form.Label>
          <Form.Control
            type="number"
            defaultValue="0"
            onChange={(e) => setNewBooking({ ...newBooking, guest_count: e.target.value })}
          />
        </Form.Group>
        <hr />
        <Form.Group>
          <Form.Label>When will you be there?</Form.Label>
          <Form.Control
            type="date"
            required
            onChange={(e) => setNewBooking({ ...newBooking, start_date: e.target.value })}
          />
          <Form.Text className="text-muted">Start Date</Form.Text>
          <Form.Control
            type="date"
            required
            onChange={(e) => setNewBooking({ ...newBooking, end_date: e.target.value })}
          />
          <Form.Text className="text-muted">End Date</Form.Text>
        </Form.Group>
        <hr />
        <Form.Group>
          <Form.Label>I would like to be there privately</Form.Label>
          <Form.Check
            type="checkbox"
            onChange={(e) => setNewBooking({ ...newBooking, private_stay: e.target.value })}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit">
          {loading ? <Spinner animation="border" role="status" as="span" size="sm" /> : 'Submit'}
          {message ? message : ''}
        </Button>
      </Modal.Footer>
    </Form>
  );
}

BookingForm.propTypes = {
  handleClose: PropTypes.func.isRequired
};

export default BookingForm;
