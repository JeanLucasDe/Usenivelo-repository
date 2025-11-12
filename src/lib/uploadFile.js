import { supabase } from "@/lib/customSupabaseClient";

export async function uploadFileToSupabase(file, folder = "uploads") {
  try {
    // 🔒 Sanitiza o nome do arquivo
    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const filePath = `${folder}/${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
      .from("usenivelo-arquivos")
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("usenivelo-arquivos")
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (err) {
    console.error("Erro ao fazer upload:", err.message);
    return null;
  }
}
