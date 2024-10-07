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
import { db } from "../create-teacher/fire";

// To handle a POST request to /api
export async function POST(request) {
  const { id } = await request.json();

  const newQ = await query(
    collection(db, "users"),
    where("classCode", "==", id)
  );
  const querySnapshot2 = await getDocs(newQ);
  let dat2 = [];
  querySnapshot2.forEach((doc2) => {
    // doc.data() is never undefined for query doc snapshots
    dat2.push(doc2.data());
  });
  console.log(dat2);
  return NextResponse.json({ dat : dat2 }, { status: 200 });
  //   Users
}
