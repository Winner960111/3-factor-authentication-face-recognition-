import { db } from "../../lib/db"; // Create a User model
import { compareFaceDescriptors, FaceDescriptor } from "../../../utils/faceUtils"
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("1111");
  const { faceFeatures } = await req.json();
  console.log("qqq", typeof faceFeatures);
  const User = db.Users;
    const face :any = cookies().get("faceFeatures")
    const userFace = face ? JSON.parse(face.value) : [];
    console.log("face====>", userFace.length);
      console.log("-=--=-=-=-=",new Float32Array(faceFeatures));
    const isMatch = compareFaceDescriptors(new Float32Array(faceFeatures),
    new Float32Array(userFace));
    console.log("----------->", isMatch);
    if (!isMatch)
      return new NextResponse(
        JSON.stringify({ message: "Face not recognized" }),
        { status: 401 }
      );

    return new NextResponse(
      JSON.stringify({ message: "Sign in successfully!" }),
      { status: 200 }
    );
  

  return new NextResponse(JSON.stringify({ message: "Face not recognized" }), {
    status: 401,
  });
}
