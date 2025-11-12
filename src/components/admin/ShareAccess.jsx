import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Copy, Link2, Share2, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { useParams } from "react-router-dom";

export default function ShareAccess() {
  const { moduleId, submoduleId } = useParams();

  const [module, setModule] = useState(null);
  const [submodule, setSubmodule] = useState(null);
  const [fields, setFields] = useState([]);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 🔹 Gera link
  const generateLink = (moduleId, submoduleId) => {
    return `${window.location.origin}/sharedsubmodules/${moduleId}/sub/${submoduleId}`;
  };

  // 🔹 Copia o link
  const copyToClipboard = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 🔹 Busca dados
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw userError;

      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", moduleId)
        .single();
      if (moduleError) throw moduleError;

      const { data: submoduleData, error: submoduleError } = await supabase
        .from("submodules")
        .select("*")
        .eq("id", submoduleId)
        .single();
      if (submoduleError) throw submoduleError;

      const { data: fieldsData, error: fieldsError } = await supabase
        .from("submodule_fields")
        .select("*")
        .eq("submodule_id", submoduleId);
      if (fieldsError) throw fieldsError;

      setModule(moduleData);
      setSubmodule(submoduleData);
      setFields(fieldsData);
      setLink(generateLink(moduleData.id, submoduleData.id));

    } catch (err) {
      console.error("❌ Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleId, submoduleId]);

  // 🔹 Alterna o compartilhamento
  const handleShareToggle = async (checked) => {
    if (!submodule) return;
    setUpdating(true);

    const { error } = await supabase
      .from("submodules")
      .update({ share: checked })
      .eq("id", submodule.id);

    if (error) {
      console.error("Erro ao atualizar compartilhamento:", error);
    } else {
      setSubmodule((prev) => ({ ...prev, share: checked }));
      console.log("✅ Compartilhamento atualizado:", checked);
    }

    setUpdating(false);
  };

  // 🔹 Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  // 🔹 Render principal
  return (
    <div className="p-4">
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Compartilhar acesso ao Formulário
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label>Compartilhamento público</Label>
            <Switch
              checked={!!submodule?.share}
              disabled={updating}
              onChange={handleShareToggle}
            />
          </div>

          {submodule?.share ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Label>Link de acesso</Label>
              <div className="flex gap-2">
                <Input readOnly value={link} className="flex-1" />
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center border border-dashed rounded-xl py-4">
              <Link2 className="w-5 h-5 mx-auto mb-1 text-gray-400" />
              Nenhum link ativo — ative o compartilhamento para gerar um link.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
