import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "../create-teacher/fire";

export async function POST(request) {
  const payload = await request.json();
  // Do whatever you want
  const return_doc = await setDoc(doc(db, "missions", payload.CODE), {
    ...payload,
  });

  return NextResponse.json({ c : payload.CODE }, { status: 200 });
}
