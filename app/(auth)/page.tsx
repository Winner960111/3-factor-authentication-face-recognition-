'use client'
import React, { useState, useEffect } from 'react'
import PasswordInput from '@/components/ui/passwordInput'
import Link from 'next/link'
import SignInButton from '@/components/ui/signinButton'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { app } from '../firebase'
axios.defaults.baseURL = process.env.BASE_URL
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth'
const SigninPage = () => {
  const [cellphone, setCellphone] = useState('')
  const [password, setPassword] = useState('')
  //
  const [phoneNumber, setPhoneNumber] = useState('16505551234')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const auth = getAuth(app)

  const router = useRouter()

  useEffect(() => {
    // Initialize RecaptchaVerifier when 'auth' changes
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'normal',
        callback: (response: string) => {
          console.log('Recaptcha verified with response:', response)
        },
        // Handle Recaptcha callback if needed
        'expired-callback': () => {
          console.log('Recaptcha expired')
        }
        // Handle Recaptcha expiration if needed
      }
    )
    // Cleanup function for RecaptchaVerifier if you want you can add
    //return () => {
    //window.recaptchaVerifier.clear();
  }, [auth]) // Run this effect when 'auth' changes
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
  }

  const handleSendOtp = async () => {
    try {
      const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      )
      setConfirmationResult(confirmation)
      setOtpSent(true)
      setPhoneNumber('')
      alert('OTP has been sent')
    } catch (error) {
      console.error(error)
    }
  }

  const handleOTPSubmit = async () => {
    try {
      if (confirmationResult) {
        // Check if confirmationResult is not null
        await confirmationResult.confirm(otp)
        setOtp('')
        router.push('/verification')
      } else {
        console.error('Confirmation result is null. Cannot confirm OTP.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      cellphone: cellphone,
      password: password
    }

    try {
      await axios.post('/api/login', data)
      .then((res) => {
        router.push('/otp')
      })

      //await localStorage.setItem('token', response.data.token)
      // handleSendOtp()
      
    } catch (error) {
      alert('Invalid email or password. Please try again.')
      console.error('Error log in :', error)
    }
    // Handle form submission here
    // console.log('Name:', email);
    // console.log('Password:', password);
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {!otpSent && (
        <div>
          <div id="recaptcha-container" className="w-full"></div>
          <div className="w-screen h-screen flex bg-blue-700 justify-center items-center text-white">
            <div className="flex flex-col sm:w-[400px] w-[80vw]  h-[600px] bg-transparent bg-opacity-10 bg-white rounded-3xl px-16 py-4 border-[4px] border-opacity-10 border-white justify-between">
              <div className="py-4">
                <p className="text-3xl font-bold text-center w-full">
                  Your logo
                </p>
              </div>
              <div>
                <p className="text-xl font-bold w-full pb-6 pt-2">Login</p>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-3 text-md"
                >
                  <label>Cell Phone Number</label>
                  <input
                    type="tel"
                    id="cellphone"
                    className="w-full text-black px-3 py-[6px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                    placeholder="Cell Phone Number"
                    onChange={e => setCellphone(e.target.value)}
                  />
                  <label>Password</label>
                  <PasswordInput
                    label="Password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Link href="/" className="hover:text-red-500 text-sm">
                    Forgot Password?
                  </Link>
                  <div className="py-2">
                    <SignInButton />
                  </div>
                </form>
              </div>
              <div className="flex flex-col text-center gap-4">
                <div className="flex flex-row text-[12px] justify-center gap-1 py-4">
                  <p>Don't have an account yet? </p>
                  <Link
                    href="/signup"
                    className="font-bold text-red-500 hover:text-red-600"
                  >
                    Register for free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {otpSent && (
        <div className="w-screen  h-screen flex bg-blue-700 justify-center items-center text-white">
          <div className="flex flex-col sm:w-[400px] w-[80vw]  h-[600px] bg-transparent bg-opacity-10 bg-white rounded-3xl px-16  border-[4px] border-opacity-10 border-white justify-between items-center py-40">
            <input
              type="text"
              value={otp}
              onChange={handleOTPChange}
              placeholder="Enter OTP"
              className="w-full border text-black border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              onClick={handleOTPSubmit}
              className={`w-full bg-${otpSent ? 'green' : 'blue'}-500 text-white py-3 rounded-md`}
              style={{ backgroundColor: otpSent ? 'green' : 'blue' }}
            >
              'Submit OTP'
            </button>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default SigninPage
