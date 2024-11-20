'use client'
import React, { useState } from 'react'
import Show from '@/public/eye.png'
import hide from '@/public/hidden.png'
import Image from 'next/image'

interface PasswordInputProps {
  label: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  onChange
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          onChange={onChange}
          placeholder="Password"
          className="w-full text-black px-3 py-[6px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
          title="Password must contain at least 1 letter, 1 number, and 1 special character, minimum length 8 characters"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
        >
          {showPassword ? (
            <Image src={Show} alt="show" className="w-3 h-3" />
          ) : (
            <Image src={hide} alt="hide" className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
