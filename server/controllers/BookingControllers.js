const Booking = require('../models/booking')
const moment = require('moment')

exports.getAllBookings = (req, res) => {
    Booking.find()
        .then((bookings) => res.json(bookings))
        .catch((err) =>
            res
                .status(404)
                .json({ message: 'No Bookings found', error: err.message })
        )
}

exports.getAllRecentBookings = (req, res) => {
    Booking.find({
        start_date: {
            $gte: moment(req.params.time).subtract(45, 'days'),
            $lt: moment(req.params.time).add(45, 'days'),
        },
    })
        .then((data) => res.json(data))
        .catch((err) =>
            res
                .status(404)
                .json({
                    message: 'Bookings in timeframe not found',
                    error: err.message,
                })
        )
}

exports.getBooking = (req, res) => {
    Booking.findById(req.params.id)
        .then((data) => res.json(data))
        .catch((err) =>
            res
                .status(404)
                .json({ message: 'Booking not found', error: err.message })
        )
}

exports.postCreateBooking = (req, res) => {
    Booking.create(req.body)
        .then((data) =>
            res.json({ message: 'Booking successfully created', data })
        )
        .catch((err) =>
            res
                .status(400)
                .json({
                    message: 'Failed to create booking',
                    error: err.message,
                })
        )
}

exports.putUpdateBooking = (req, res) => {
    Booking.findByIdAndUpdate(req.params.id, req.body)
        .then((data) =>
            res.json({ message: 'Booking successfully updated', data })
        )
        .catch((err) =>
            res
                .status(400)
                .json({
                    message: 'Failed to update booking',
                    error: err.message,
                })
        )
}

exports.deleteBooking = (req, res) => {
    Booking.findByIdAndRemove(req.params.id, req.body)
        .then((data) =>
            res.json({ message: 'Booking successfully deleted', data })
        )
        .catch((err) =>
            res
                .status(404)
                .json({
                    message: 'Booking not found, delete was unsuccessful',
                    error: err.message,
                })
        )
}
