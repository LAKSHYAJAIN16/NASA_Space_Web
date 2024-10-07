"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Mission() {
  const [displayMissionUI, setDisplayMissionUI] = useState(false);
  const [mission, setMission] = useState();
  const [students, setStudents] = useState([]);
  const [idActual, setIdActual] = useState();

  useEffect(() => {
    setDisplayMissionUI(false);

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("m");
    setIdActual(id);

    // request
    const fn = async () => {
      setDisplayMissionUI(false);
      const res = await axios.post("/api/specific-mission", { id: id });
      console.log(res);
      const dat = res.data;
      setMission(dat["mission"]);
      setStudents(dat["children"]);
      await new Promise((r) => setTimeout(r, 500));
      setDisplayMissionUI(true);
    };

    fn();
    setDisplayMissionUI(true);
  }, []);

  async function queryChildren() {
    setDisplayMissionUI(false);
    const res = await axios.post("/api/get-children", { id: idActual });
    const dat = res.data["dat"];
    console.log(dat);
    setStudents([]);
    setStudents(dat);
    setDisplayMissionUI(true);
  }

  async function del() {
    const res = await axios.post("/api/delete-mission", { id: idActual });
    window.location = "/teacher-dashboard";
  }

  return (
    <div className="major-mono-display-regular ml-32 mt-5">
      <h1 className="text-5xl">
        <span className="text-red-500">Mission</span> {idActual}
      </h1>
      <p
        onClick={() => (window.location = "/teacher-dashboard")}
        className="cursor-pointer"
      >
        Go Back
      </p>
      <button className="button-30 w-32 h-10 mt-2" onClick={() => del()}>
        End Mission
      </button>
      {displayMissionUI && (
        <div className="mb-10 flex flex-col">
          <div>
            <h2 className="mt-8 font-bold text-2xl">SETTINGS</h2>
            <p>DISPLAY INTRO TEXT : {mission?.mission?.defaultIntroduction}</p>
            <p>CUSTOM INTRO TEXT : {mission?.mission?.customintroduction}</p>
            <p>
              QUIZ ENABLED : {JSON.stringify(mission?.mission?.quiz.useQuiz)}
            </p>
            <p>
              TOTAL QUIZ QUESTIONS :{" "}
              {JSON.stringify(mission?.mission?.quiz?.questions.length)}
            </p>
            <p>
              EXOPLANET SYSTEMS :{" "}
              {JSON.stringify(mission?.mission?.exos?.length)}
            </p>
          </div>

          <br />
          <br />

          <div>
            <h2 className="mt-7 font-bold text-2xl flex items-center ">
              STUDENTS{" "}
              <button
                className="button-30 ml-4 -mt-1 w-24 h-8  text-xl  scale-100"
                onClick={() => queryChildren()}
              >
                Refresh
              </button>
            </h2>

            {students?.length == 0 ? (
              <p>No students right now...</p>
            ) : (
              <div className="flex justify-evenly">
                {students?.map((e, idx) => (
                  <>
                    <div className="mt-3 text-white">
                      <h3 className="uppercase font-bold text-xl text-yellow-500">
                        {e.name}
                      </h3>
                      <ul className>
                        {e.actions.map((f, idx) => (
                          <li>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
