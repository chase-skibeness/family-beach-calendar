const express = require('express')
const router = express.Router()

const {
    getAllBookings,
    getAllRecentBookings,
    getBooking,
    postCreateBooking,
    putUpdateBooking,
    deleteBooking,
} = require('../controllers/BookingControllers')

/**
 * @route GET api/booking
 * @description get all bookings
 * @access public
 */
router.get('/', getAllBookings)

/**
 * @route GET api/booking/:day
 * @description only get bookings in a time window
 * @access public
 */
router.get('/:time', getAllRecentBookings)

/**
 * @route GET api/booking/:id
 * @description get specific booking by id
 * @access public
 */
router.get('/:id', getBooking)

/**
 * @route POST api/booking
 * @description add a new Booking
 * @access public
 */
router.post('/', postCreateBooking)

/**
 * @route PUT api/booking/:id
 * @description update Booking by id
 * @access public
 */
router.put('/:id', putUpdateBooking)

/**
 * @route DELETE api/Booking/:id
 * @description delete Booking by id
 * @access public
 */
router.delete('/:id', deleteBooking)

module.exports = router
