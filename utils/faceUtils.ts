'use sever'
import * as faceapi from 'face-api.js'; // Ensure you have this library installed

// Load models
export const loadModels = async (): Promise<void> => {
  const MODEL_URL = '/models'; // Change this to your model path
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
};

// Compare face features
export type FaceDescriptor = number[] | Float32Array

export const FACE_SIMILARITY_THRESHOLD = 0.6

export const compareFaceDescriptors = (descriptor1: FaceDescriptor, descriptor2: FaceDescriptor): boolean => {
  // Use faceapi's built-in Euclidean distance method
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);

  // Log the calculated distance for debugging
  console.log("Face distance:", distance);

  // Return true if distance is below threshold
  return distance < FACE_SIMILARITY_THRESHOLD;
};

// Example usage
// Ensure you have face-api.js loaded and descriptor data for both faces
export const compareFaces = async (image1: string, image2: string) => {
  // Assume image1 and image2 are base64 encoded image data
  const img1 = await faceapi.fetchImage(image1);
  const img2 = await faceapi.fetchImage(image2);

  // Detect faces and extract descriptors
  const descriptor1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
  const descriptor2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();

  if (!descriptor1 || !descriptor2) {
    throw new Error("One or both images do not contain detectable faces");
  }

  // Compare the descriptors
  const result = compareFaceDescriptors(descriptor1.descriptor, descriptor2.descriptor);
  console.log(result ? 'Faces match' : 'Faces do not match');
  return result;
};