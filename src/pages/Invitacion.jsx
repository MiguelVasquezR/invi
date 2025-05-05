"use client";

import { useEffect, useRef, useState } from "react";
import BellaInicio from "@/image/BellaInit.jpg";
import Conteo from "../image/Conteo.jpg";
import Fondo from "../image/Fondo.png";
import { DateTime } from "luxon";
import clsx from "clsx";
import { FaEnvelope } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/swiper-bundle.css";
import app from "@/service/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";

const Invitacion = () => {
  const songRef = useRef(null);
  const divRef = useRef(null);

  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const initRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [valueAssistance, setValueAssistance] = useState(false);

  const [persona, setPersona] = useState();

  const db = getFirestore(app);

  const fetchCollectionData = async (id) => {
    try {
      const coleccionRef = collection(db, "invitacion");
      const consulta = query(coleccionRef, where("codigo", "==", parseInt(id)));
      const resultado = await getDocs(consulta);

      if (resultado.empty) {
        return [];
      }

      const data = resultado.docs.map((doc) => ({
        id: doc.id, // id del documento de Firestore
        ...doc.data(), // los datos del documento
      }));

      const { pases, reservacion } = data[0];
      const { adultos, niños } = pases;
      const total =
        niños || niños > 0
          ? parseInt(adultos) + parseInt(niños)
          : parseInt(adultos);

      setValueAssistance(reservacion);

      const persona = {
        ...data[0],
        total: total,
      };

      setPersona(persona);
      return [];
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
      return [];
    }
  };

  useEffect(() => {
    const get = async () => {
      const valor = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id="))
        ?.split("=")[1];

      await fetchCollectionData(valor);
    };

    get();
  }, []);

  const [buttonActive, setButtonActive] = useState({
    iglesia: true,
    hacienda: false,
  });

  useEffect(() => {
    if (isActiveModal && formRef.current && !valueAssistance) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      formRef.current.focus();
    }

    if (!isActiveModal) {
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      divRef.current.focus();
    }
  }, [isActiveModal]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      if (divRef.current) {
        observer.unobserve(divRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const enablePlayback = () => {
      setCanPlay(true);
      window.removeEventListener("click", enablePlayback);
      window.removeEventListener("touchstart", enablePlayback);
    };

    window.addEventListener("click", enablePlayback);
    window.addEventListener("touchstart", enablePlayback);

    return () => {
      window.removeEventListener("click", enablePlayback);
      window.removeEventListener("touchstart", enablePlayback);
    };
  }, []);

  useEffect(() => {
    if (isVisible && canPlay && !hasPlayed && songRef.current) {
      const playAudio = async () => {
        try {
          await songRef.current.play();
          setHasPlayed(true);
        } catch (error) {}
      };

      playAudio();
    }
  }, [isVisible, canPlay, hasPlayed]);

  const handleMap = () => {
    if (buttonActive.iglesia) {
      setButtonActive({
        iglesia: false,
        hacienda: true,
      });
    }

    if (buttonActive.hacienda) {
      setButtonActive({
        iglesia: true,
        hacienda: false,
      });
    }
  };

  const PRIMERAS = [
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282459/IMG_0845_nzyh56.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282458/IMG_0829_sz8lu8.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282454/IMG_0704_v6e5d4.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282454/IMG_0767_w67zmz.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282453/IMG_0694_ivb0mo.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282453/IMG_0647_prhubl.jpg",
  ];

  const SEGUNDAS = [
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282458/IMG_0842_ywerhb.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282455/IMG_0762_o4amsm.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282455/IMG_0755_q2axxu.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282454/IMG_0750_flumcf.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282453/IMG_0613_ergbjw.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282453/IMG_0577_g4hc6p.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282450/IMG_0494_f7qd1h.jpg",
    "https://res.cloudinary.com/di3ldc36w/image/upload/v1746282450/IMG_0510_dynswt.jpg",
  ];

  const confirm = () => {
    const actualizarDocumento = async (id, nuevosDatos) => {
      try {
        const docRef = doc(db, "invitacion", id);
        await updateDoc(docRef, nuevosDatos);
      } catch (error) {
        console.error("❌ Error al actualizar el documento:", error);
      }
    };

    const newData = {
      ...persona,
      confirmacion: true,
      reservacion: valueAssistance,
    };

    actualizarDocumento(persona.id, newData);
    setIsActiveModal(false);
  };

  useEffect(() => {
    if (songRef.current) {
      initRef.current.click();
      songRef.current.play();
    }
  }, [persona]);

  return (
    <div ref={initRef} className="overflow-hidden">
      <div ref={divRef} style={{ height: "0px" }}>
        <audio
          ref={songRef}
          src={"/audio/cancion.mp3"}
          controls
          style={{ height: "0px" }}
        />
      </div>

      <div
        className="relative"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/di3ldc36w/image/upload/v1746282457/IMG_0809_rr6044.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-[#f2f2f2]/30 flex flex-col justify-center items-center">
          <p className="text-[80px] text-[#f474d6] font-playfair font-bold">
            Sbeydy
          </p>
          <p className="text-[#f474d6] font-playfair text-[32px] font-bold">
            MIS XV AÑOS
          </p>
          <br />
          <br />
          <br />
          <br />
          <p className="text-[#f474d6] font-playfair text-[32px] font-bold">
            17 - MAYO - 2025
          </p>
          <div className="animate-pulse absolute bottom-10">
            <MdOutlineKeyboardDoubleArrowDown size={120} color="f474d6" />
          </div>

          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-[#fcfcfc] pointer-events-none"></div>
        </div>
      </div>

      <div className="relative text-black leading-8 flex justify-center items-center flex-col gap-5 text-center font-playfair p-5 bg-[#fcfcfc]">
        {isActiveModal && (
          <div
            onClick={(e) => {
              setIsActiveModal(false);
            }}
            className="w-full h-full bg-black/50 absolute z-50 flex justify-center items-center"
          >
            <form
              ref={formRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-[90%] max-w-lg p-6 shadow-lg space-y-6 text-gray-800 z-[100]"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold font-italiana">
                  Tu nombre es:
                </p>
                <p className="text-xl font-bold text-primary">
                  {persona.nombre}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-lg font-semibold fonita">
                  Tienes {persona?.total} pases disponibles:
                </p>

                <div className={clsx("flex justify-center items-center gap-5")}>
                  <p>{persona?.pases.adultos} Adultos</p>
                  {persona?.pases.niños && <p>{persona?.pases.niños} Niños</p>}
                </div>

                {persona?.pases.extras && (
                  <div className="font-bold text-primary">
                    <p className="underline p-1">
                      {persona.pases.extras} Extras
                    </p>
                    Es un regalo especial de mi parte por aceptar ser mis
                    padrinos <br />
                    ¡Muchas gracias!
                  </div>
                )}
              </div>

              <div className="bg-primary/50 rounded-md p-4">
                <p className="text-gray-600">
                  Sabemos que la hora es un poco tarde, pero no te preocupes: la
                  hacienda cuenta con habitaciones para que puedas quedarte a
                  dormir si lo deseas.
                </p>
              </div>

              <div className="flex flex-col justify-center items-center sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-black font-medium">
                  ¿Deseas hacer una reservación?
                </p>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    checked={valueAssistance}
                    type="checkbox"
                    onChange={(e) => {
                      e.stopPropagation();
                      console.log(e.target.checked);
                      setValueAssistance(!valueAssistance);
                    }}
                  />
                  <div className="peer rounded-full outline-none duration-100 after:duration-500 w-28 h-14 bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 after:content-['No'] after:absolute after:outline-none after:rounded-full after:h-12 after:w-12 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['Sí'] peer-checked:after:border-white"></div>
                </label>
              </div>

              <a
                href="https://wa.me/5212288538444?text=Hola, ame. Tengo una duda sobre los 15 años de tu hija ☺️"
                className="underline text-blue-500 my-5 flex justify-center items-center"
                target="_blank"
              >
                Cualquier duda, contacta a mi mamá ☺️
              </a>

              <button
                onClick={(e) => {
                  confirm();
                }}
                className="bg-primary rounded-md p-2 w-full text-white font-bold"
                disabled={persona?.confirmacion || false}
              >
                {!persona?.confirmacion
                  ? "Confirmar mi asistencia"
                  : "Has confirmado, muchas gracias!"}
              </button>
            </form>
          </div>
        )}

        <div>
          <p className="text-[24px] py-3 font-italiana font-bold">
            Hola, {persona?.nombre || ""}
          </p>

          <p className="">
            Con gran alegría, te invito a la Misa de Acción de Gracias al Señor
            con motivo de la celebración de nuestros <strong>XV años</strong>,
            que se llevará a cabo el día{" "}
            <strong>17 de mayo a las 17:30 hrs</strong>. en la Iglesia del
            Calvario, ubicada en{" "}
            <strong>
              Calle Libertad No. 1, Colonia Centro, C.P. 91000, Xalapa, Veracruz
            </strong>
            .
          </p>
          <br />

          <div>
            <p className="font-bold text-[22px] font-italiana">Mis Papás</p>
            <div>
              <p>Ameyaly Vásquez Rosas</p>
              <p>Luis Enrique Nostroza Martínez</p>
            </div>
          </div>

          <br />

          <div>
            <p className="font-bold text-[22px] font-italiana">Mis Padrinos</p>
            <div>
              <p>Emiliana Rosas García</p>
              <p>Gerardo Emilio Hernández Martínez</p>
            </div>
          </div>

          <br />

          <div>
            <p>
              Después de la ceremonia religiosa, agradeceremos contar con tu
              presencia en la <strong>Hacienda Quality</strong>, ubicada en{" "}
              <strong>
                San Miguel Adalberto, calle Tejeda No. 21, Colonia Centro, C.P.
                91315, Rafael Lucio, Veracruz
              </strong>
              , a partir de las <strong>19:00 hrs</strong>
              ., para celebrar juntos este momento tan especial.
            </p>
          </div>

          <br />
          <div>
            <p>
              Si no estás seguro de cómo llegar, no te preocupes, aquí te dejo
              los mapas con las ubicaciones:
            </p>
            <br />

            <div>
              <div>
                <button
                  type="button"
                  onClick={handleMap}
                  className={clsx(
                    "border-primary font-italiana border-[1px] border-solid px-5 py-2 w-1/2 text-primary font-bold rounded-l-md",
                    { "bg-primary text-white": buttonActive.iglesia }
                  )}
                >
                  Iglesía
                </button>
                <button
                  type="button"
                  onClick={handleMap}
                  className={clsx(
                    "border-primary font-italiana border-[1px] border-solid px-5 py-2 w-1/2 text-primary font-bold rounded-r-md",
                    { "bg-primary text-white": buttonActive.hacienda }
                  )}
                >
                  Hacienda
                </button>
              </div>

              <br />
              <div className="flex flex-col justify-center items-center my-3">
                <iframe
                  src={
                    buttonActive.iglesia
                      ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d631.3587131305281!2d-96.92329274471952!3d19.534789323921515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db2e01accf5ed9%3A0x4366266a39269aa7!2sParroquia%20De%20Nuestro%20Se%C3%B1or%20del%20Calvario!5e0!3m2!1ses-419!2ses!4v1746253704625!5m2!1ses-419!2ses"
                      : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.7750484487497!2d-96.98656662403796!3d19.59413578172011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db2f15c2a1bb7b%3A0x71ffd4e84988a163!2sHacienda%20Quality!5e0!3m2!1ses-419!2ses!4v1746253741621!5m2!1ses-419!2ses"
                  }
                  width="320"
                  height="320"
                  loading="lazy"
                  className="rounded-md"
                />
              </div>
              <p className="text-[12px] text-gray-500">
                Sabemos que está un poco retirado, pero tendrémos transporte de
                ida y de regreso. Terminado la ceremonia religiosa, habrá un
                autobús que te llevará a la hacienda. <br />
                El regreso será a las 23:00 hrs. <br />
                <br />
                ¡Queremos que disfrutes sin preocupaciones!
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundImage: `url(${Conteo.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
          }}
          className="py-10 rounded-md relative text-white z-0"
        >
          <div className="absolute bg-primary/40 w-full h-full top-0 left-0 z-10 rounded-md" />

          <div className="relative z-20 text-center">
            <p className="text-white font-bold">
              Nos haría mucha ilusión contar contigo. <br /> ¡La cuenta
              regresiva ha comenzado! <br />
              Solo faltan:
            </p>
            <br />
            <ConteoRegresivo />
            <br />
          </div>
        </div>

        <br />

        <div style={{ width: "100%", height: "400px" }}>
          <Carrusel images={PRIMERAS} />
        </div>

        <br />
        <br />
        <br />
        <br />

        <div className="p-2 shadow-xl rounded-md flex justify-center items-center gap-2 flex-col bg-white">
          <div>
            <p>
              El mejor regalo es tu presencia en este día tan especial, pero si
              deseas tener un detalle, te facilitaré el camino. <br /> ¡Gracias
              por acompañarme con tanto amor!
            </p>
          </div>
          <div className="animate-pulse flex justify-center items-center gap-3 flex-col">
            <FaEnvelope size={120} color="pink" />
            <p className="text-primary font-bold">LLUVIA DE SOBRES</p>
          </div>
        </div>

        <br />

        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <p className="text-xl font-semibold text-center text-gray-800 mb-4 font-italiana">
            Confirmación de Asistencia
          </p>
          <div className="mb-6">
            <p className="text-gray-600 text-lg">
              De la forma más atenta, te pido que confirmes tu asistencia para
              que podamos hacer los arreglos correspondientes.
            </p>
          </div>
          <button
            ref={buttonRef}
            onClick={() => {
              setIsActiveModal(true);
            }}
            type="button"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary transition duration-300 font-italiana"
          >
            Confirmar
          </button>
        </div>
        <br />

        <div style={{ width: "100%", height: "400px" }}>
          <Carrusel images={SEGUNDAS} />
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

const ConteoRegresivo = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const today = DateTime.now();
      const quinceaneraDate = DateTime.fromISO("2025-05-17T17:30:00");
      const difference = quinceaneraDate.diff(today, [
        "days",
        "hours",
        "minutes",
        "seconds",
      ]);

      setTimeLeft({
        days: difference.days,
        hours: difference.hours,
        minutes: difference.minutes,
        seconds: difference.seconds,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row justify-center items-center gap-5">
      <div>
        <p className="text-[52px]">{parseInt(timeLeft.days)}</p>
        <br />
        <p className="font-bold">Días</p>
      </div>

      <div>
        <p className="text-[52px]">{parseInt(timeLeft.hours)}</p>
        <br />
        <p className="font-bold">Horas</p>
      </div>

      <div>
        <p className="text-[52px]">{parseInt(timeLeft.minutes)}</p>
        <br />
        <p className="font-bold">Minutos</p>
      </div>

      <div>
        <p className="text-[52px]">{parseInt(timeLeft.seconds)}</p>
        <br />
        <p className="font-bold">Segundos</p>
      </div>
    </div>
  );
};

const Carrusel = ({ images }) => {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      className="mySwiper w-[90%] h-[500px]"
      modules={[EffectCards, Autoplay]}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
        reverseDirection: true,
      }}
    >
      {images?.map((img, index) => (
        <SwiperSlide key={index}>
          <img src={img} alt={`Imagen ${index + 1}`} className="rounded-md" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Invitacion;
