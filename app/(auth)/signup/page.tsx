'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import WebcamCapture from '@/components/webcamCapture'
import * as faceapi from 'face-api.js'; 
import * as tf from '@tensorflow/tfjs';
axios.defaults.baseURL = process.env.BASE_URL
interface RegisterFormProps {}
export async function extractFaceFeatures(base64Image: string): Promise<number[] | null> {
  const img = new Image();
  img.src = base64Image;

  // Ensure the image is loaded before proceeding
  await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = (error) => {
          console.error("Image loading error:", error);
          reject(new Error("Failed to load image"));
      };
  });

  // Log to verify that the image has loaded
  console.log("Image loaded successfully");

  // Perform face detection
  try {
    console.log("1111");
    
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    console.log("222");
      if (!detections) {
          console.warn("No face detected");
          return null; // Return null if no face is detected
      }

      console.log("Detections:", detections);
      return Array.from(detections.descriptor); // Convert descriptor to array
  } catch (error) {
      console.error("Error during face detection:", error);
      return null; // Handle any errors during detection
  }
}
export async function initializeTensorFlow() {
  try {
    const checkWebGL = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl');
      return context !== null;
    };

    const isWebGLAvailable = checkWebGL();
    await tf.setBackend(isWebGLAvailable ? 'webgl' : 'cpu');
    await tf.ready();
    console.log('Using TensorFlow.js backend:', tf.getBackend());
  } catch (error) {
    console.error('Error initializing TensorFlow:', error);
    await tf.setBackend('cpu');
    await tf.ready();
    console.warn('Falling back to CPU backend');
  }
}

export async function loadModels() {
  const MODEL_URL = '/models'
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);
  // Set state to true when models are loaded
    console.log("Models loaded successfully");
  } catch (error) {
    console.error("Error loading models:", error);
  }
}
const RegisterPage: React.FC<RegisterFormProps> = ({}) => {
  const router = useRouter()

  // State variables for form inputs
  const [fullname, setFullname] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [cellphone, setCellphone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [faceFeature, setFaceFeature] = useState<Array<Float32Array>>([])
  useEffect(() => {
    const init = async () => {
      await initializeTensorFlow();
      await loadModels();
    };
    init();
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   // e.preventDefault()

  //   // // Perform validation checks
  //   // if (!validateFullName(fullname)) {
  //   //   alert('Please enter a valid full name')
  //   //   return
  //   // }

  //   // if (!validateDateOfBirth(dateOfBirth)) {
  //   //   alert('Please enter a valid date of birth')
  //   //   return
  //   // }

  //   // if (!validateEmail(email)) {
  //   //   alert('Please enter a valid email address')
  //   //   return
  //   // }

  //   // if (!validatePassword(password)) {
  //   //   alert('Please enter a password with at least 8 characters')
  //   //   return
  //   // }

  //   // if (password !== passwordConfirm) {
  //   //   alert('Passwords do not match')
  //   //   return
  //   // }

  //   // try {
  //   //   const data = {
  //   //     fullName: fullname,
  //   //     birth: dateOfBirth,
  //   //     phoneNumber: cellphone,
  //   //     email: email,
  //   //     password: password
  //   //   }

  //   //   console.log(data)
  //   //   const response = await axios.post('/api/register', data)
  //   //   console.log(response.data)

  //   //   router.push('/')
  //   // } catch (error) {
  //   //   console.error('Registration failed:', error)
  //   //   alert('An error occurred during registration. Please try again.')
  //   // }
  // }

  const validateFullName = (value: string): boolean => {
    return /^[a-zA-Z\s]+$/.test(value)
  }

  const validateDateOfBirth = (value: string): boolean => {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const validatePassword = (value: string): boolean => {
    return value.length >= 8
  }
  const handleCapture = async (image: string) => {
    console.log("========>", image);

    const faceDescriptor = await extractFaceFeatures(image)
    console.log("=========>✍🏻", faceDescriptor);
 // Determine action based on state

 // Perform validation checks
 if (!validateFullName(fullname)) {
   alert('Please enter a valid full name')
   return
 }

 if (!validateDateOfBirth(dateOfBirth)) {
   alert('Please enter a valid date of birth')
   return
 }

 if (!validateEmail(email)) {
   alert('Please enter a valid email address')
   return
 }

 if (!validatePassword(password)) {
   alert('Please enter a password with at least 8 characters')
   return
 }

 if (password !== passwordConfirm) {
   alert('Passwords do not match')
   return
 }

 try {
   const data = {
     fullName: fullname,
     birth: dateOfBirth,
     phoneNumber: cellphone,
     email: email,
     password: password,
     faceFeatures: faceDescriptor
   }

   console.log(data)
  await axios.post('/api/register', data)
  .then((res) => {
    router.push('/')
  })

  
 } catch (error) {
   console.error('Registration failed:', error)
   alert('An error occurred during registration. Please try again.')
 }
    // const response = await fetch("/api/auth", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, faceFeatures: faceDescriptor }),
    // });

    // const data = await response.json();
  };
  return (
    <div className="w-screen h-screen flex bg-blue-700 justify-center items-center text-white">
      <div className="flex flex-col sm:w-[800px] w-[80vw] justify-between h-[600px] bg-transparent bg-opacity-10 bg-white rounded-3xl px-16 py-10 border-[4px] border-opacity-10 border-white">
        <p className="text-3xl font-bold mb-6 w-full text-center">SignUp</p>
        <div  className="flex flex-col gap-6">
          <div className='flex flex-row'>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="fullname" className="text-xs w-24 font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  required
                  title="Enter your full name"
                  className="w-full h-8 rounded-md text-sm text-black placeholder:text-xs placeholder:text-gray-500 px-2"
                  placeholder="Full Name"
                  onChange={e => setFullname(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="dateOfBirth" className="text-xs w-24 font-bold">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  required
                  title="Select your date of birth"
                  className="w-full h-8 rounded-md text-xs text-black placeholder:text-xs placeholder:text-gray-500 px-2"
                  onChange={e => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="cellphone" className="text-xs w-24 font-bold">
                  Cell Phone Number
                </label>
                <input
                  type="tel"
                  id="cellphone"
                  className="w-full h-8 text-sm rounded-md text-black placeholder:text-xs placeholder:text-gray-500 px-2"
                  placeholder="Cell Phone Number"
                  onChange={e => setCellphone(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="email" className="text-xs w-24 font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  title="Enter your email address"
                  className="w-full rounded-md h-8 text-sm text-black placeholder:text-xs placeholder:text-gray-500 px-2"
                  placeholder="Your email address"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="password" className="text-xs w-24 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  title="Enter a password with at least 8 characters"
                  className="w-full rounded-md text-sm h-8 text-black placeholder:text-xs placeholder:text-gray-500 px-2"
                  placeholder="new password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label
                  htmlFor="passwordConfirm"
                  className="text-xs w-24 font-bold"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  required
                  title="Re-enter your password to confirm"
                  className="w-full h-8 rounded-md text-sm text-black placeholder:text-xs placeholder:text-gray-500 px-2"
                  placeholder="confirm password"
                  onChange={e => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>
            <div>
            <WebcamCapture onCapture={handleCapture} />
            </div>
          </div>
          {/* <button
            type="submit"
            className="bg-blue-900 text-white hover:scale-[1.1] px-4 py-2 rounded-lg mt-4 hover:bg-blue-500 font-bold"
          >
            Register
          </button> */}
          <div className="text-xs flex flex-row justify-center gap-2">
            <Link
              href={'/'}
              className="text-red-500 hover:text-red-600 font-bold"
            >
              Click here
            </Link>
            <p>if you already have an account</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
