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
  deleteDoc
} from "firebase/firestore";
import { db } from "../create-teacher/fire";

// To handle a POST request to /api
export async function POST(request) {
  const { id } = await request.json();

  // See if the mission exists
  const snap = await deleteDoc(doc(db, "missions", id));

  return NextResponse.json({ snap : snap, msg : "good job boi" }, { status: 200 });
  //   Users
}
