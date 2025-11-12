import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function LimitReachedFullScreen() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-white via-yellow-50 to-orange-100 text-gray-900"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="flex flex-col items-center text-center px-6 py-10 rounded-3xl shadow-xl bg-white/80 backdrop-blur-md border border-yellow-200 max-w-lg"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center rounded-full bg-orange-100 p-6 shadow-md"
            >
            </motion.div>
            <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          <h1 className="text-3xl font-extrabold mb-3 text-gray-800">
            Ingressos Esgotados
          </h1>

          <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
            Todos os ingressos para este evento foram vendidos.  
            🥺 Mas não se preocupe — ainda vêm muitos momentos incríveis por aí!
          </p>

          <Link
            to="https://usenivelo.com"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg shadow-sm transition"
          >
            Fique de olho nos próximos eventos
          </Link>

          <p className="mt-10 text-sm text-gray-400">
            Acompanhe nossas novidades para não perder o próximo! ✨
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
