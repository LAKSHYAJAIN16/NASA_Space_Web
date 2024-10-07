// Only supposed to be ran once
import { NextResponse } from "next/server";
import * as data from "../init-exoplanets/systems.json";

// To handle a POST request to /api
export async function POST(request) {
  const { length, page } = await request.json();
  console.log(length);
  console.log(page);
  let return_ar = [];
  let keys = Object.entries(data);
  for (let i = ((page - 1) * length); i < (page * length); i++) {
    const element = keys[i][1];
    console.log(element)
    return_ar.push({...element, name : keys[i][0]});
  }
  return NextResponse.json({ docs: return_ar }, { status: 200 });
}
