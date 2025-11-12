import React from "react";
import { CheckCircle2 } from "lucide-react";
import SubmoduleUserCompanyFooter from "../../SubmoduleUserCompanyFooter";

export default function ConfirmationTemplate({ title, subtitle, message, companyFields, userFields,  company, user,demo}) {

  return (
    <div className={`h-[100vh] inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm`}>
      <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 shadow-md text-center">
        <CheckCircle2 className="mx-auto w-16 h-16 text-green-500 dark:text-green-400" />
        <h2 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-200">
          {title || "Inscrição Confirmada!"}
        </h2>
        <h3 className="mt-2 text-lg font-medium text-green-700 dark:text-green-300">
          {subtitle || "Parabéns!"}
        </h3>
        <div className="mt-6 bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-200 p-4 rounded-lg text-sm">
          {message || "✅ Fique atento ao seu e-mail para próximos passos."}
        </div>
        {!demo && <div className="mt-6">
          <SubmoduleUserCompanyFooter 
            companyFields={companyFields} 
            userFields={userFields}
            company={company}
            user={user}
            />
        </div>}
      </div>
    </div>
  );
}
