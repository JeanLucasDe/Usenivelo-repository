import { MailWarning, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function EmailConfirmationAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="m-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl shadow-md text-amber-800 dark:text-amber-100 backdrop-blur-sm">
        
        {/* Ícone + texto */}
        <div className="flex items-start gap-3 flex-1">
          <MailWarning className="w-5 h-5 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="font-semibold leading-tight">
              Confirme seu e-mail
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
              Verifique sua caixa de entrada e clique no link de confirmação que enviamos.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
