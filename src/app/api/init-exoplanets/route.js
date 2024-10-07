// Only supposed to be ran once
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import * as data from "./systems.json";
import { db } from "../create-teacher/fire";

// To handle a POST request to /api
export async function GET(request) {
  for (let id = 0; id < Object.entries(data).length; id++) {
    const system = Object.entries(data)[id];
    console.log(system);

    // create document
    const return_doc = await setDoc(
      doc(db, "systems", system[0]),
      {
        ...system[1],
      }
    );
    console.log(return_doc);
  }
  return NextResponse.json({ text: "deed is done broski" }, { status: 200 });
}
