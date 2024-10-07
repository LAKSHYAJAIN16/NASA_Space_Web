import React from "react";

export default function Join() {
  return (
    <div className="major-mono-display-regular">
      {/* <div className="main" /> */}
      <div className="mt-[7%]">
        <h1 className="text-center text-5xl text-yellow-500">Select Role</h1>
        <h2 className="text-center mt-3 text-3xl">I am a -</h2>
        <div className="mt-9 flex justify-evenly ">
          <a href="/student-download">
            <button className="button-30 bg-white shadow-xl w-[20vw] h-48 rounded-xl text-black text-2xl">
              <p>
                <b>Student</b>
              </p>
            </button>
          </a>
          <a href="/teacher-signup">
            <button className="button-30 bg-white shadow-xl w-[20vw] h-48 rounded-xl text-black text-2xl">
              <p>
                <b>Teacher</b>
              </p>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
