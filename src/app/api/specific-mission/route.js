// Only supposed to be ran once
import { NextResponse } from "next/server";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "../create-teacher/fire";

// To handle a POST request to /api
export async function POST(request) {
  const { id } = await request.json();

  // See if the mission exists
  const snap = await getDoc(doc(db, "missions", id));

  const dat = await snap.data();
  console.log(dat);

  //   New Query, for children
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

  return NextResponse.json({ mission : dat, children : dat2 }, { status: 200 });
  //   Users
}
