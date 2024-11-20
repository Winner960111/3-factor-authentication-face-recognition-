import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../../lib/db'
import twilio from 'twilio'
import { cookies } from 'next/headers'
interface LoginData {
  cellphone: string
  password: string
}
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
export async function POST(req: NextRequest) {
  try {
    // Extract the Users collection
    const Users = db.Users
    // Define the LoginData interface

    // Parse the request body to get the login data
    const data: LoginData = await req.json()
    console.log('login__________', data)
    // Find the user by email
    const user = await Users.findOne({ phoneNumber: data.cellphone })
    if (user) {
      console.log('user--------------------------->', user)
      // Compare the supplied password with the hashed password
      const isMatch = await bcrypt.compare(data.password, user.password)

      if (isMatch === true) {
        // Generate JWT token data
        // const tokenData = { email: user.email }
        // const token = jwt.sign(
        //   { data: tokenData, exp: Date.now() + 108000 },
        //   'secretKey'
        // )
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString()

        // Send SMS
        try {
          console.log('=================>', verificationCode, data.cellphone)
          await client.verify.v2
            .services('VAc3ed847f58f7fd23bd7f681110abe420')
            .verifications.create({ to: '+18646571715', channel: 'sms' })
            .then(message => console.log(`Message sent: ${message.sid}`))
            .catch(error => {
              console.error('Error sending message:', error)
            })
            console.log(".😥", user.faceFeatures.length);
            cookies().set('faceFeatures',  JSON.stringify(user.faceFeatures), {
              expires: new Date(Date.now() + 1000*1000),
              httpOnly: true
            })
          console.log('=================>', verificationCode, data.cellphone)
          // Store the verification code in the database (optional)
          cookies().set('verificationCode', verificationCode, {
            expires: new Date(Date.now() + 600 * 1000), // 600 seconds (10 minutes)
            httpOnly: true
          })
          return new NextResponse(
            JSON.stringify({ message: 'Login Successful' }),
            { status: 200 }
          )
        } catch (error) {
          return new NextResponse(JSON.stringify({ message: 'Sever error' }), {
            status: 500
          })
        }

        // Create a response with a success message and token
        // const response = new NextResponse(
        //   JSON.stringify({ message: 'Login Successful', token: token }),
        //   { status: 200 }
        // )

        // Set the token as an HTTP-only cookie
        // response.headers.set(
        //   'Set-Cookie',
        //   cookie.serialize('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        //     maxAge: 86400, // 1 day in seconds
        //     path: '/'
        //   })
        // )
      }
    }

    // Return an error response if authentication fails
    return new NextResponse(
      JSON.stringify({ message: 'Invalid email or password' }),
      { status: 401 }
    )
  } catch (error) {
    // Handle any unexpected errors
    console.error(error)
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
