import express from 'express'
import authRoute from './route/auth.route.js'
import cookieParser from 'cookie-parser'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)

app.listen(PORT, () => {
    `Server is running on port ${PORT}`
})
