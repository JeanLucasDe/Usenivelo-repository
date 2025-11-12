import { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { ImageOff } from "lucide-react";
import { useParams } from "react-router-dom";

export default function SubmoduleLogoDisplay({ logoUrl, size = 100, rounded = true }) {
  

  return (
    <div className="flex justify-center items-center">
      {logoUrl ? (
        <div
          className={`shadow-md border border-gray-200 bg-center bg-cover bg-no-repeat ${
            rounded ? "rounded-full" : "rounded-lg"
          }`}
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${logoUrl})`,
          }}
        />
      ) : null}
    </div>
  );
}
