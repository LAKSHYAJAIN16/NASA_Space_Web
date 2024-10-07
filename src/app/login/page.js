"use client";
import axios from "axios";
import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function send() {
    const payload = {
      username: username,
      password: password,
    };
    const result = await axios.post("/api/login-teacher", payload);
    if (result.data.text == "L") {
      window.alert("Try Again");
    } else {
      console.log(result);

      localStorage.setItem("id_logged_in", result.data.id);
      localStorage.setItem("name_logged_in", username);
      window.location.replace("/teacher-dashboard");
    }
  }

  return (
    <>
      {" "}
      <div className="major-mono-display-regular">
        <div className="mt-[5%]">
          <h1 className="text-center font-bold text-blue-400 mb-4 text-6xl ">
            Login (only for teachers)
          </h1>
          <div className="ml-[30vw] mt-10">
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
                  class="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
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
                  class="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
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
          Login
        </button>
      </div>
    </>
  );
}
