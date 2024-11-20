'use client'
import WebcamCapture from '@/components/webcamCapture'
import React, { useState, useEffect } from 'react'
import {
  extractFaceFeatures,
  initializeTensorFlow,
  loadModels
} from '../signup/page'
import { useRouter } from 'next/navigation'
const FacePage = () => {
  const router = useRouter()
  useEffect(() => {
    initializeTensorFlow()
  }, [])

  useEffect(() => {
    loadModels()
  }, [])
  const handleCapture = async (image: string) => {
    console.log('========>', image)
    const faceDescriptor = await extractFaceFeatures(image)
    console.log('1111', faceDescriptor)
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faceFeatures: faceDescriptor })
    })
    if (response.status === 200) {
      router.push('/verification')
    }
  }

  return (
    <div className="w-screen h-screen flex bg-blue-700 justify-center items-center text-white">
      <WebcamCapture onCapture={handleCapture} />
    </div>
  )
}

export default FacePage
