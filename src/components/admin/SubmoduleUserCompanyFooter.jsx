import { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building2 } from "lucide-react";

export default function SubmoduleUserCompanyFooter({ userFields,  companyFields,company, user}) {
 
  if (!userFields.length && !companyFields.length) return null;

  return (
    <footer className="w-full dark:bg-gray-900 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
      <div className="max-w-4xl mx-auto flex flex-col  justify-center items-center gap-4 text-sm text-gray-800 dark:text-gray-00 mt-2">
        
       {/* Usuário */}
        {userFields.length > 0 && (
          <div className="flex flex-col justify-center gap-4 items-center">
            {userFields
              .filter((f) => f.field_name.toLowerCase() !== "logo") // 👈 ignora o campo logo
              .map((f) => (
                <span
                  key={f.field_name}
                  className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate"
                >
                  {user?.[f.field_name] ?? "-"}
                </span>
              ))}
          </div>
        )}

        {/* Empresa */}
        {companyFields.length > 0 && company && (
          <div className="flex flex-col justify-center gap-4 items-center">
            {companyFields
              .filter((f) => f.field_name.toLowerCase() !== "logo") // 👈 ignora o campo logo
              .map((f) => (
                <span
                  key={f.field_name}
                  className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate"
                >
                  {company?.[f.field_name] ?? "-"}
                </span>
              ))}
          </div>
        )}

      </div>
    </footer>
  );
}
