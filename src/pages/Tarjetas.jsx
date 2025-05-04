"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Tarjeta = () => {
  const [active, setActive] = useState(false);
  const router = useRouter();

  const audioRef = useRef(null);

  const params = useSearchParams();

  useEffect(() => {
    if (params.get("id")) {
      document.cookie = `id=${params.get("id")}; path=/; max-age=86400`;
    }
  }, []);

  const handleClick = () => {
    setActive(true);
  };

  return (
    <div className="bg-primary h-screen w-screen flex justify-center items-center flex-col gap-5">
      {!active && (
        <p className="font-italiana text-[32px] font-bold text-center animate-pulse">
          ¡Presiona el centro del sobre!
        </p>
      )}

      <div className="card">
        <div
          onClick={handleClick}
          className={`relative bg-white w-[300px] sm:w-[350px] transition-all duration-700 aspect-video flex items-center justify-center ${
            active ? "group" : ""
          }`}
        >
          <div
            className={`transition-all flex flex-col items-center py-5 justify-start duration-300 ${
              active ? "duration-1000 -translate-y-16" : ""
            } bg-[#fdfdfd] w-full h-full absolute`}
          >
            <p className="text-xl sm:text-2xl font-semibold text-gray-500 font-serif">
              ¡Muchas Gracías!
            </p>
            <p className="px-10 text-[10px] sm:text-[12px] text-gray-700 text-center">
              Es muy bonito que te des el tiempo de ver esta invitación
            </p>
            <p className="font-serif text-[10px] sm:text-[12px] text-gray-700"></p>
            <p className="font-sans text-[10px] text-gray-700 pt-5 text-center mb-5">
              Sbeydy Kristel <br /> Nostroza Vásquez
            </p>
          </div>

          <button
            className={`seal bg-primary text-red-800 w-10 aspect-square rounded-full z-40 text-[10px] flex items-center justify-center font-semibold [clip-path:polygon(50%_0%,_80%_10%,_100%_35%,_100%_70%,_80%_90%,_50%_100%,_20%_90%,_0%_70%,_0%_35%,_20%_10%)] transition-all duration-1000 border-4 border-rose-900 ${
              active ? "opacity-0 scale-0 rotate-180" : ""
            }`}
          >
            SKNV
          </button>

          <div
            className={`tp transition-all duration-1000 absolute w-full h-full bg-white ${
              active
                ? "[clip-path:polygon(50%_0%,_100%_0,_0_0)]"
                : "[clip-path:polygon(50%_50%,_100%_0,_0_0)]"
            }`}
          />
          <div
            className={`lft transition-all duration-700 absolute w-full h-full bg-[#f2f2f2] ${
              active
                ? "[clip-path:polygon(50%_50%,_0_0,_0_100%)]"
                : "[clip-path:polygon(50%_50%,_0_0,_0_100%)]"
            }`}
          />
          <div
            className={`rgt transition-all duration-700 absolute w-full h-full bg-[#f2f2f2] ${
              active
                ? "[clip-path:polygon(50%_50%,_100%_0,_100%_100%)]"
                : "[clip-path:polygon(50%_50%,_100%_0,_100%_100%)]"
            }`}
          />
          <div
            className={`btm transition-all duration-700 absolute w-full h-full bg-white ${
              active
                ? "[clip-path:polygon(50%_50%,_100%_100%,_0_100%)]"
                : "[clip-path:polygon(50%_50%,_100%_100%,_0_100%)]"
            }`}
          />
        </div>
      </div>

      {active && (
        <button
          type="button"
          onClick={() => {
            router.push("/invitacion");
          }}
          className="border-white px-5 py-3 border-[1px] rounded-md w-1/2 text-white"
        >
          Continuar
        </button>
      )}
    </div>
  );
};

export default Tarjeta;
