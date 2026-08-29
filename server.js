const express = require('express')
const dotenv = require('dotenv')
const sgMail = require('@sendgrid/mail')

dotenv.config()

const app = express()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/subscribe", async (req, res) => {

    const email = req.body.email

    if (!email) {
        return res.status(400).send("Email is required")
    }

    const message = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Welcome to DEV@Deakin!",
        text: "Welcome to DEV@Deakin! Thank you for subscribing to our newsletter."
    }

    try {

        const response = await sgMail.send(message)

        console.log("Email API status:", response[0].statusCode)
        console.log("Welcome email sent to:", email)

        res.status(202).send("Subscription successful! Welcome to DEV@Deakin.")

    } catch (error) {

        console.log("Email error:", error.response?.body || error.message)

        res.status(500).send("Unable to send welcome email")
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})