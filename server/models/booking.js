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
        required: true,
    },
    guest_count: {
        type: 'Number',
    },
    private_stay: {
        type: 'Boolean'
    },
})

const Booking = mongoose.model('booking', BookingSchema)

module.exports = Booking
