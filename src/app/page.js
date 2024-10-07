import Image from "next/image";

export default function Home() {
  return (
    <div className="major-mono-display-regular">
      <div class="main"></div>
      <main className="mt-[17%]">
        <h1 className="text-center font-bold text-red-400 mb-4 text-7xl">
          Exo-Classroom
        </h1>

        <div className="flex justify-center">
          <a href="/join">
            <button className="button-30 h-10" role="button">
              Join
            </button>
          </a>
          <a href="/login">
            <button className="button-30 ml-4 h-10" role="button">
              Login
            </button>
          </a>
        </div>
      </main>
    </div>
  );
}
