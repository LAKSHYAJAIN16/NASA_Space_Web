import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "./fire";
import { genSalt, hash } from "bcrypt";

// To handle a POST request to /api
export async function POST(request) {
  const { username, email, password, id } = await request.json();

  const saltRounds = 10;
  genSalt(saltRounds, (err, salt) => {
    if (err) {
      // Handle error
      return NextResponse.json({ text: "sorry bro" }, { status: 200 });
    } else {
      // Salt generation successful, proceed to hash the password
      console.log(salt);
      hash(password, salt, (err, hash) => {
        if (err) {
          // Handle error
          return NextResponse.json({ text: "sorry bro" }, { status: 200 });
        } else {
          // Hashing successful, 'hash' contains the hashed password
          console.log("Hashed password:", hash);
          async function run() {
            // Do whatever you want
            const return_doc = await setDoc(doc(db, "teachers", id), {
              name: username,
              email: email,
              password: hash
            });
            return NextResponse.json({ ...return_doc }, { status: 200 });
          }
          run();
        }
      });
    }
  });

  return NextResponse.json({ text: "sorry bro" }, { status: 200 });
}
