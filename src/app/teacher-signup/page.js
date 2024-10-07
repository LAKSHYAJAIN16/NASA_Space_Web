"use client";
import axios from "axios";
import React, { useState } from "react";

export default function TeacherSignup() {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function send() {
    let r = (Math.random() + 1).toString(36).substring(7);
    const payload = {
      email,
      username,
      password,
      id: r,
    };
    const result = await axios.post("/api/create-teacher", payload);
    console.log(result);

    localStorage.setItem("id_logged_in",r);
    localStorage.setItem("name_logged_in",username);
    window.location = "/teacher-dashboard";
  }

  return (
    <>
      {" "}
      <div className="major-mono-display-regular">
        <div className="mt-[5%]">
          <h1 className="text-center font-bold text-blue-400 mb-4 text-6xl ">
            Teacher Signup
          </h1>
          <div className="ml-[30vw] mt-10">
            <div>
              <label for="email" class="block text-white font-semibold text-sm">
                Email
              </label>
              <div class="mt-2">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="text-black block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                />
              </div>
            </div>
            <div className="mt-5">
              <label for="name" class="block text-white font-semibold text-sm">
                Username
              </label>
              <div class="mt-2">
                <input
                  type="text"
                  name="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  class="text-black  block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                />
              </div>
            </div>
            <div className="mt-5">
              <label
                for="password"
                class="block text-white font-semibold text-sm"
              >
                Password
              </label>
              <div class="mt-2">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="text-black  block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="major-mono-display-regular button-30 mt-10 h-10 w-36"
          onClick={() => send()}
        >
          Next
        </button>
      </div>
    </>
  );
}
