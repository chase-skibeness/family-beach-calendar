import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

function BookingForm({ handleClose, selectedDates }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState();
  const [message, setMessage] = useState();
  const [alertStatus, setAlertStatus] = useState();
  const [newBooking, setNewBooking] = useState({
    name: null,
    start_date: selectedDates.start,
    end_date: selectedDates.end,
    guest_count: 0,
    private_stay: false
  });

  const URL = process.env.REACT_APP_URL;

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setMessage('Please fill out all required fields.');
      setAlertStatus('warning');
      return;
    }

    setValidated(true);
    event.preventDefault();
    setLoading(true);
    newBooking.private_stay = newBooking.private_stay === 'on' ? true : false;
    newBooking.start_date = new Date(newBooking.start_date);
    newBooking.end_date = new Date(newBooking.end_date);
    try {
      let res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept-Encoding': 'gzip, deflate, sdch'
        },
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
        setAlertStatus('success');
        setMessage('Booking created successfully!');
        setTimeout(handleClose, 2000);
      } else {
        setSuccess(false);
        setLoading(false);
        setAlertStatus('danger');
        setMessage(
          'There was a problem creating your booking, please refresh the page and try again.'
        );
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
          <br />
          <Form.Label>How many guests will you have with you?</Form.Label>
          <Form.Control
            type="number"
            defaultValue="0"
            onChange={(e) => setNewBooking({ ...newBooking, guest_count: e.target.value })}
          />
          <br />
        </Form.Group>
        <hr />
        <Form.Group>
          <Form.Label>When will you be there?</Form.Label>
          <br />
          <Form.Text className="text-muted">Start Date</Form.Text>
          <Form.Control
            type="date"
            required
            defaultValue={selectedDates.startStr}
            onChange={(e) => setNewBooking({ ...newBooking, start_date: e.target.value })}
          />
          <br />
          <Form.Text className="text-muted">End Date</Form.Text>
          <Form.Control
            type="date"
            required
            defaultValue={selectedDates.endStr}
            onChange={(e) => setNewBooking({ ...newBooking, end_date: e.target.value })}
          />
        </Form.Group>
        <br />
        <hr />
        <Form.Group className="privateCheckbox">
          <Form.Check
            type="checkbox"
            onChange={(e) => setNewBooking({ ...newBooking, private_stay: e.target.value })}
          />
          <Form.Label>I would like to be there privately</Form.Label>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Alert variant={alertStatus} show={message || loading ? true : false}>
          {loading ? <Spinner animation="border" role="status" as="span" size="sm" /> : ''}
          {message ? message : ''}
        </Alert>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Form>
  );
}

BookingForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  selectedDates: PropTypes.object
};

export default BookingForm;
