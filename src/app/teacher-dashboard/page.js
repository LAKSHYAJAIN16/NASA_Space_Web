"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

export default function TeacherDashboard() {
  const [name, setName] = useState();
  const [id, setId] = useState();
  const [ui, setUI] = useState(1);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [addingQuestionText, setAddingQuestionText] = useState("");
  const [addingQuestionAnswer, setAddingQuestionAnswer] = useState("");
  const [page, setPage] = useState(1);

  const [defaultIntroduction, setDefaultIntroduction] = useState(true);
  const [customintroduction, setCustomintroduction] = useState("");
  const [useQuiz, setUseQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [renderExos, setRenderExos] = useState(true);
  const [retrievedExoplanets, setRetrievedExoplanets] = useState([]);
  const [selectedExoplanets, setSelectedExoplanets] = useState([]);

  const introRef = useRef();
  const systemRef = useRef();
  const quizRef = useRef();

  const [missions, setMissions] = useState([]);

  // API request for exo-planets
  const api_fun = async () => {
    const res = await axios.post("/api/retrieve-exoplanets", {
      length: 4,
      page: page,
    });
    const things = res.data.docs;
    console.log(res);
    let local_retrievedExos = retrievedExoplanets;
    const new_retrievedExos = local_retrievedExos.concat(things);
    console.log(new_retrievedExos);
    setRetrievedExoplanets(new_retrievedExos);
    setPage(page + 1);
  };

  // APi request for missions
  const missions_fun = async(id) => {
    const res = await axios.post("/api/my-missions", {id : id} );
    const data = res.data;
    setMissions(data);
  }

  const selectExo = async (exo) => {
    setRenderExos(false);
    console.log("mig");
    let local_exos = retrievedExoplanets;

    // remove
    local_exos.splice(local_exos.indexOf(exo), 1);
    console.log(local_exos);
    setRetrievedExoplanets(local_exos);

    // add
    let local_selected = selectedExoplanets;
    local_selected.push(exo);
    setSelectedExoplanets(local_selected);

    await new Promise((r) => setTimeout(r, 100));
    setRenderExos(true);
  };

  const deSelectExo = async (exo) => {
    setRenderExos(false);
    let local_exos = retrievedExoplanets;

    // remove
    local_exos.push(exo);
    setRetrievedExoplanets(local_exos);

    // add
    let local_selected = selectedExoplanets;
    local_selected.splice(local_selected.indexOf(exo), 1);
    setSelectedExoplanets(local_selected);

    await new Promise((r) => setTimeout(r, 100));
    setRenderExos(true);
  };

  useEffect(() => {
    const name_local = localStorage.getItem("name_logged_in");
    const id_local = localStorage.getItem("id_logged_in");
    setName(name_local);
    setId(id_local);

    const def = async () => {
      await api_fun();
      await missions_fun(id_local);
    };

    def();
  }, []);

  useEffect(() => {
    const name_local = localStorage.getItem("name_logged_in");
    const id_local = localStorage.getItem("id_logged_in");
    setName(name_local);
    setId(id_local);
  }, [retrievedExoplanets]);

  function addingQuestionFunction(value) {
    setAddingQuestion(value);
    setAddingQuestionText("");
    setAddingQuestionAnswer("");
  }

  function addQuestion() {
    let local_questions = questions;
    local_questions.push({
      text: addingQuestionText,
      answer: addingQuestionAnswer,
    });
    setQuestions(local_questions);
    addingQuestionFunction(false);
  }

  function deleteSpecificIndex(index) {
    let local_questions = questions;
    local_questions.splice(index, 1);
    console.log(local_questions);
    setUseQuiz(false);
    setQuestions(local_questions);
    setUseQuiz(true);
  }

  async function create() {
    // get the exoplanets (PLANETs, because i'm dumb)
    let local_exos = selectedExoplanets;
    let systems = [];
    for (let kkk = 0; kkk < local_exos.length; kkk++) {
      let system = local_exos[kkk];

      // extract keys
      const ent = Object.entries(system);

      ent.forEach((element) => {
        if (element[0].includes(system["name"])) {
          if ("planets" in system == false) {
            system["planets"] = [element[0]];
          } else {
            system["planets"].push(element[0]);
          }
        }
      });

      console.log(system);
      systems.push(system["name"]);
    }
    const payload = {
      teacher: {
        name: name,
        id: id,
      },
      mission: {
        defaultIntroduction: defaultIntroduction,
        customintroduction: customintroduction,
        quiz: {
          useQuiz: false,
          questions: questions,
        },
        exos: local_exos,
        systems : systems
      },
      CODE: (Math.random() + 1).toString(36).substring(5),
      tc: Date.now(),
    };

    const res = await axios.post("/api/create-mission", payload);
    window.location = "/mission?q=" + res.data.c;
  }

  return (
    <div className="mt-[3%] major-mono-display-regular">
      {ui === 1 && (
        <>
          <h1 className="text-center font-bold text-2xl">Welcome, {name}</h1>
          <div className="ml-32 mt-7">
            <button className="button-30 h-14 w-56" onClick={() => setUI(2)}>
              <Image
                src="/plus.png"
                width={30}
                height={30}
                className="mr-3"
              ></Image>
              Create New Mission
            </button>
          </div>
          <div className="ml-32 mt-16">
            <p>Ongoing Missions</p>
          </div>

          <div>
            {missions.map((e, idx) => (
              <>
              <div className="mt-3 ml-32">
                <a href={`/mission?m=${e.CODE}`}>
                <h2 className="font-bold"><span className="text-red-500">Mission</span> {e.CODE}</h2>
                </a>
              </div>
              </>
            ))}
          </div>
        </>
      )}

      {ui === 2 && (
        <>
          <h1 className="text-center font-extrabold  text-5xl">New Mission</h1>

          {/* Fixed Nav */}
          <div className="md:flex hidden -mt-20 flex-col fixed h-full ml-[10%] justify-center">
            <h2 className="text-3xl text-red-500">Settings</h2>
            <h3
              className="text-2xl mt-3 cursor-pointer"
              onClick={() =>
                introRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              Intro
            </h3>
            <h3
              className="text-2xl mt-1 cursor-pointer"
              onClick={() => {
                systemRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Systems
            </h3>
            <h3
              className="text-2xl mt-1 cursor-pointer"
              onClick={() =>
                quizRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              Quiz
            </h3>
          </div>

          {/* actual nav */}
          <div className="mb-20 md:ml-[30vw] ml-2 mt-20">
            <div ref={introRef}>
              <h2 className="font-bold text-4xl text-blue-500">Intro</h2>
              <div className="mt-5">
                <label class="block text-white font-semibold text-xl">
                  Show Default Introduction
                </label>
                <p className="text-sm">
                  Our preloaded introduction which includes basic details about
                  NASA.
                </p>
                <div class="mt-2">
                  <div class="checkbox-wrapper-6">
                    <input
                      class="tgl tgl-light"
                      id="cb1-6"
                      type="checkbox"
                      value={defaultIntroduction}
                      onChange={(e) => setDefaultIntroduction(e.target.value)}
                    />
                    <label class="tgl-btn" for="cb1-6" />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label
                  for="custom-intro"
                  class="block text-white font-semibold text-xl z-30"
                >
                  Custom Introduction
                </label>
                <p className="text-sm">Custom Text you want displayed.</p>
                <div class="mt-2">
                  <input
                    type="text"
                    name="custom-intro"
                    value={customintroduction}
                    onChange={(e) => setCustomintroduction(e.target.value)}
                    class="z-40 text-black block w-80 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400"
                  />
                </div>
              </div>
            </div>

            <div ref={systemRef} className="mt-24">
              <h2 className="font-bold text-4xl text-blue-500">Systems</h2>

              <div className="mt-5">
                <label
                  for="custom-intro"
                  class="block text-white font-semibold text-xl z-30"
                >
                  Select Systems
                </label>
                <p className="text-sm">
                  These are stellar systems your children will be able to
                  navigate.
                </p>
                {renderExos == true && (
                  <div>
                    <div class="-ml-6 mt-6 flex flex-wrap justify-evenly">
                      {/* Loop over all of the systems */}
                      {selectedExoplanets.map((doc, idx) => (
                        <div className="flex flex-col cursor-pointer hover:scale-110 transition-all">
                          <p className="text-green-500">Selected </p>
                          <div
                            onClick={() => deSelectExo(doc)}
                            className="border-2 p-2 border-green-500 w-40 h-52 mb-7 rounded-xl flex-col flex items-center shadow-xl "
                          >
                            <img
                              src={doc.img}
                              className="w-326 h-36 rounded-xl"
                            ></img>
                            <h1 className="font-bold mt-2">{doc.name}</h1>
                            {/* <p>Mass Spectrometry Lab, Gravity Lab, Identification Lab</p> */}
                          </div>
                        </div>
                      ))}
                      {retrievedExoplanets.map((doc, idx) => (
                        <div
                          onClick={() => selectExo(doc)}
                          className="mt-6 cursor-pointer hover:scale-110 transition-all w-40 h-52 mb-7 rounded-xl flex-col flex items-center shadow-xl shadow-gray-500"
                        >
                          <img
                            src={doc.img}
                            className="w-326 h-36 rounded-xl"
                          ></img>
                          <h1 className="font-bold mt-2">{doc.name}</h1>
                          {/* <p>Mass Spectrometry Lab, Gravity Lab, Identification Lab</p> */}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <button
                        className="button-30 h-10 w-30"
                        onClick={() => api_fun()}
                      >
                        Load More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div ref={quizRef} className="mt-24">
              <h2 className="font-bold text-4xl text-blue-500">Quiz</h2>

              <div className="mt-5">
                <label class="block text-white font-semibold text-xl">
                  Use Quiz
                </label>
                <div class="mt-2">
                  <div class="checkbox-wrapper-6">
                    <input
                      class="tgl tgl-light"
                      id="cb2-6"
                      type="checkbox"
                      value={useQuiz}
                      onChange={(e) => setUseQuiz(e.target.value)}
                    />
                    <label class="tgl-btn" for="cb2-6" />
                  </div>
                </div>
              </div>
              <div>
                {useQuiz && (
                  <>
                    <div className="mt-5">
                      <button
                        className="button-30 h-10 w-30"
                        onClick={() => addingQuestionFunction(!addingQuestion)}
                      >
                        <Image
                          src="/plus.png"
                          width={30}
                          height={30}
                          className="mr-3"
                        ></Image>
                        Add Question
                      </button>
                    </div>
                    {addingQuestion && (
                      <>
                        <div className="mt-5">
                          <label
                            for="custom-intro"
                            class="block text-red-500 font-semibold text-2xl z-30"
                          >
                            Question #{questions.length + 1}{" "}
                            <div className="mt-1 mb-2 flex">
                              <img
                                src="/remove.png"
                                width={20}
                                height={20}
                                className="cursor-pointer hover:scale-110 transition-all"
                                onClick={() => addingQuestionFunction(false)}
                              ></img>
                              <img
                                src="/check.png"
                                width={20}
                                height={20}
                                className="ml-3 cursor-pointer hover:scale-110 transition-all"
                                onClick={() => addQuestion()}
                              ></img>
                            </div>
                          </label>

                          <label
                            for="adding-question-text"
                            class="block text-white font-semibold text-lg z-30 mt-2"
                          >
                            Question Text
                          </label>
                          <div class="mt-2">
                            <input
                              type="text"
                              name="adding-question-text"
                              value={addingQuestionText}
                              onChange={(e) =>
                                setAddingQuestionText(e.target.value)
                              }
                              class="z-40 text-black block w-80 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400"
                            />
                          </div>

                          <label
                            for="adding-question-answer"
                            class="block text-white font-semibold text-lg z-30 mt-2"
                          >
                            Question Answer
                          </label>
                          <div class="mt-2">
                            <input
                              type="text"
                              name="adding-question-answer"
                              value={addingQuestionAnswer}
                              onChange={(e) =>
                                setAddingQuestionAnswer(e.target.value)
                              }
                              class="z-40 text-black block w-80 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <br />
                    <br />
                    {questions.map((question, idx) => (
                      <>
                        <div className="mt-5">
                          <img
                            src="/remove.png"
                            width={20}
                            height={20}
                            className="cursor-pointer hover:scale-110 transition-all"
                            onClick={() => deleteSpecificIndex(idx)}
                          ></img>
                          <h3 className="font-bold text-lg">
                            Question #{idx + 1}
                          </h3>

                          <h4>{question.text}</h4>
                          <h5> - {question.answer}</h5>
                        </div>
                      </>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="mt-20">
              <button className="button-30 h-10 w-52" onClick={() => create()}>
                Create Mission
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
