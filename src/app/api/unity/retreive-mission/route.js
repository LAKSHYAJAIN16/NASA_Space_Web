// Only supposed to be ran once
import { NextResponse } from "next/server";
import {
  setDoc,
  doc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "../../create-teacher/fire";

// To handle a POST request to /api
export async function POST(request) {
  const { classCode, name } = await request.json();

  // See if the mission exists
  const q = query(collection(db, "missions"), where("CODE", "==", classCode));
  const snap = await getDocs(q);
  let dat = undefined;
  snap.forEach((dos) => (dat = dos.data()));
  console.log(dat);
  if (dat === undefined) {
    return NextResponse.json({ message: "1" });
  } else {
    // set
    const doc12 = await setDoc(doc(db, "users", classCode + ":" + name), {
      name: name,
      classCode: classCode,
      actions: ["Entered the game"],
    });
    console.log(doc12);
    return NextResponse.json({ message: "2", dat: dat });
  }

  //   Users
}
