const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true,
    },
    start_date: {
        type: 'Date',
        required: true,
    },
    end_date: {
        type: 'Date',
        requierd: true,
    },
    guest_count: {
        type: 'Number',
    },
})

const Booking = mongoose.model('booking', BookingSchema)

module.exports = Booking
