import { doc, getDocs, query, collection, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "../create-teacher/fire";

// To handle a POST request to /api
export async function POST(request) {
  const { id } = await request.json();
  const act = await query(
    collection(db, "missions"),
    where("teacher.id", "==", id)
  );
  const querySnapshot = await getDocs(act);
  let dat = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    dat.push(doc.data());
  });
  console.log(dat);

  return NextResponse.json(dat, { status: 200 });
}
