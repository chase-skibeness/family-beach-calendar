require('dotenv').config()
const express = require('express')
const cors = require('cors')

const connectDB = require('./config/dbConnect')

const app = express()

const bookingRoutes = require('./routes/BookingRoutes')

connectDB()

app.use(cors({ origin: true, credentials: true }))

app.use(express.json({ extended: false }))

app.use('/api/bookings', bookingRoutes)

const PORT = process.env.PORT || 30000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
