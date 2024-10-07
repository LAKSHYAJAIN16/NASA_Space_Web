import { doc, getDocs, query, collection, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { db } from "../create-teacher/fire";

// To handle a POST request to /api
export async function POST(request) {
  const { username, password } = await request.json();
  const act = await query(
    collection(db, "teachers"),
    where("name", "==", username)
  );
  const querySnapshot = await getDocs(act);
  let dat = null;
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    dat = doc.data();
  });
  console.log(dat);

  if(dat == null){
    return NextResponse.json({ text: "L" }, { status: 200 });
  }
  compare(password, dat.password, (err, result) => {
    if (err) {
      // Handle error
      console.error("Error comparing passwords:", err);
      return NextResponse.json({ text: "sorry bro" }, { status: 200 });
    }

    if (result) {
      // Passwords match, authentication successful
      return NextResponse.json({ text: "W", act }, { status: 200 });
    } else {
      // Passwords don't match, authentication failed
      return NextResponse.json({ text: "L" }, { status: 200 });
    }
  });

  return NextResponse.json({ text: "sorry bro" }, { status: 200 });
}
