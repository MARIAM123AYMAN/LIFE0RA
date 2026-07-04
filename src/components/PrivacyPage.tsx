import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 1200);
    const timer2 = setTimeout(() => setStage(2), 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (stage === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>

        <h1 className="mt-8 text-3xl font-bold">
          Loading Privacy Policy...
        </h1>

        <p className="mt-2 text-gray-400">
          Please wait...
        </p>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className="min-h-screen bg-red-600 flex items-center justify-center">
        <h1 className="text-white text-6xl font-black animate-pulse">
          🚨 SECURITY ALERT 🚨
        </h1>
      </div>
    );
  }

  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={250}
      />
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-white to-cyan-100 flex items-center justify-center p-5">
        <motion.div
          initial={{
            opacity: 0,
            scale: .4,
            rotate: -20,
            y: 300
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            y: 0
          }}
          transition={{
            duration: .9,
            type: "spring",
            stiffness: 120
          }}
          className="bg-white p-4 rounded-3xl w-full shadow-2xl p-10 max-w-xl text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-sky-300 rounded-full blur-3xl animate-pulse opacity-40"></div>

          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-cyan-300 rounded-full blur-3xl animate-pulse opacity-40"></div>
          
          <h1 className="text-5xl font-black">
            <motion.h1
              animate={{
                rotate: [0, -8, 8, -8, 8, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 4
              }}
              className="text-6xl font-black"
            >
            </motion.h1>
          </h1>

          <p className="mt-6 text-xl">
            🔍Privacy Policy
            للأسف...
            وقعت في الـ  😂
          </p>

          <p className="mt-3 text-lg">
            👀  تم اكتشاف شخص هنا 
          </p>

          <div className="mt-8 bg-sky-50 rounded-2xl p-6">
            <h2 className="text-3xl font-bold">
              ❤️ رسالة خاصة
            </h2>

            <p className="mt-5 text-2xl font-extrabold text-sky-700">
              نتمنى المشروع ينال إعجابكم بعد كل الحركات دي 🌹🌹
            </p>

            <div className="mt-6 space-y-3 text-xl font-bold">
              <p>🌟 د. سيد نوح</p>
              <p>🌟 د. محمد حسين</p>
              <p>🌟 د. ممتاز</p>
              
              <motion.p
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
                className="mt-8 text-sky-800 italic"
              >
                Made with ❤️ by Team LifeOra
              </motion.p>
            </div>

            <p className="mt-8 italic text-gray-500">
              شكراً إنك وصلت لحد هنا 😂
              نرجع نكمل اللي ورانا بقا؟
            </p>
          </div>

          <motion.button
            whileHover={{
              scale: 1.1
            }}
            whileTap={{
              scale: .9
            }}
            onClick={() => navigate(-1)}
            className="mt-10 bg-sky-700 p-4 hover:bg-sky-200 text-sky-900 px-10 py-4 rounded-full font-bold shadow-lg"
          >
            😂 خلاص... رجعني بسرعة
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}