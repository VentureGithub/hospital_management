import connectPostgres from "@/app/libs/postgres";
import OPDRegistration from "@/app/models/OPDRegistration";
//import { NextResponse } from "next/server";



export async function POST(request) {
    const { IPDNO,PATEINTNAME } = await request.json();
    await connectMongoDB();
    await OPDRegistration.create({ IPDNO,PATEINTNAME});
    return NextResponse.json(
      { message: "Patient Id created successfully" },
      { status: 200 }
    );
  }
  