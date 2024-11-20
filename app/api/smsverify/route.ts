import { NextRequest, NextResponse } from 'next/server'

import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const data: string = await req.json()
  console.log(data)
  const verificationCode = cookies().get('verificationCode')
  console.log('=====>', verificationCode?.value)
  try {
    if (data == verificationCode?.value) {
      return new NextResponse(
        JSON.stringify({ message: 'Successfully verified' }),
        { status: 200 }
      )
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error(error)
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    )
  }
}
