import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import { db } from '../../lib/db'

interface UserData {
  fullName: string
  birth: Date
  phoneNumber: string
  email: string
  password: string
  faceFeatures: Array<any>
  // avatar?: string
}

// const convertImageToBase64 = async (filePath: string): Promise<string> => {
//   try {
//     const data = await fs.readFile(filePath)
//     return data.toString('base64')
//   } catch (err) {
//     throw new Error(`Failed to read file: ${err}`)
//   }
// }

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const data: UserData = await req.json()
  
    let isDefaultAvatar = false
    // if (!data.avatar) {
    //   const defaultAvatarPath =
    //     'E:\\my online project\\2- nextjs\\New folder (2)\\sample.png' // Replace with your default avatar path
    //   data.avatar = await convertImageToBase64(defaultAvatarPath)
    //   isDefaultAvatar = true
    // }
    // Access Users collection from your database instance
    const Users = db.Users

    console.log("==========>",data)

    // Create a new user instance
    const user = new Users(data)
    console.log("222222");
    // Hash the password using bcrypt
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10)
    }
    // Save the user to the database
    try {
      console.log("sssf");
      await user.save()
    } catch (saveError) {
      console.error('Error saving user to database:', saveError)
      return new NextResponse(
        JSON.stringify({
          message:
            'The email or other constraints already exist. Please try another email.',
          error: saveError
        }),
        { status: 400 }
      )
    }
    if (isDefaultAvatar) {
      // Clear avatar field to indicate usage of default avatar
      user.avatar = undefined
    }
    return new NextResponse(JSON.stringify(user), { status: 201 })
  } catch (error) {
    console.error('Error:', error)

    return new NextResponse(
      JSON.stringify({
        message: 'The email already exists. Please try another email.',
        error: (error as Error).message
      }),
      { status: 400 }
    )
  }
}
// }
