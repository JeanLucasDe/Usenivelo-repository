import { useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function UpdateLimitInput({ submoduleId, currentLimit }) {
  const [limit, setLimit] = useState(currentLimit || 0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateLimit = async () => {
    if (!submoduleId) {
      toast({ title: "Erro", description: "ID do submódulo não informado.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("submodules")
      .update({ limit })
      .eq("id", submoduleId);

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao atualizar limite",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Limite atualizado!",
        description: `O novo limite é ${limit}.`,
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 border border-gray-200 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm w-full sm:w-auto">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Limite:
      </label>

      <Input
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        className="w-full sm:w-32"
        placeholder="Ex: 50"
      />

      <Button
        onClick={handleUpdateLimit}
        disabled={loading}
        className="bg-purple-700 hover:bg-purple-600 text-white w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </div>
  );
}
