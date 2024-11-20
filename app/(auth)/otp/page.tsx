'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const OtpPage: React.FC = () => {
  const [OTP, setOTP] = useState('')
  const router = useRouter()
  const handleOTPSubmit = async () => {
    try {
      await axios.post('/api/smsverify', OTP).then(res => {
        router.push('/face')
      })

      //await localStorage.setItem('token', response.data.token)
      // handleSendOtp()
    } catch (error) {
      alert('Invalid email or password. Please try again.')
      console.error('Error log in :', error)
    }
  }
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOTP(e.target.value)
  }
  return (
    <div className="w-screen  h-screen flex bg-blue-700 justify-center items-center text-white">
      <div className="flex flex-col sm:w-[400px] w-[80vw]  h-[600px] bg-transparent bg-opacity-10 bg-white rounded-3xl px-16  border-[4px] border-opacity-10 border-white justify-between items-center py-40">
        <h1 className="text-3xl text-white font-bold">OTP</h1>
        <div>
          <input
            type="text"
            value={OTP}
            onChange={handleOTPChange}
            placeholder="Enter OTP"
            className="w-full border text-black border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            onClick={handleOTPSubmit}
            className={`w-full bg-green-500 text-white py-3 rounded-md`}
            style={{ backgroundColor: 'green' }}
          >
            Submit OTP
          </button>
        </div>
      </div>
    </div>
  )
}
export default OtpPage
