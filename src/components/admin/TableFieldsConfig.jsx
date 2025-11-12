import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Save } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { useParams } from "react-router-dom";

export default function TableFieldsConfig() {
  const [fields, setFields] = useState([]);
  const {submoduleId} = useParams();
  const [visibleFields, setVisibleFields] = useState({});
  const [loading, setLoading] = useState(true);

  // Carrega os campos do submódulo (exemplo: id fixo)
  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("submodule_fields")
        .select("*")
        .eq("submodule_id", submoduleId); // troque depois pelo ID dinâmico

      if (error) console.error(error);
      else {
        setFields(data);
        // Marca como visíveis os que já estão configurados
        const saved = data.reduce((acc, f) => {
          acc[f.id] = f.show_in_table || false;
          return acc;
        }, {});
        setVisibleFields(saved);
      }
      setLoading(false);
    };

    fetchFields();
  }, []);

  const handleToggle = (fieldId, checked) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldId]: checked,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    for (const fieldId in visibleFields) {
      const show = visibleFields[fieldId];
      await supabase
        .from("submodule_fields")
        .update({ show_in_table: show })
        .eq("id", fieldId);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center text-muted-foreground py-10">Carregando...</div>;

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Configurar Colunas da Tabela
        </CardTitle>
      </CardHeader>

      <Separator/>

      <CardContent className="space-y-4 mt-4">
        {fields
        .map((field) => (
          <div key={field.id} className="flex items-center justify-between">
            <Label>{field.name}</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={visibleFields[field.id] || false}
                onChange={(checked) => handleToggle(field.id, checked)}
              />
              {visibleFields[field.id] ? (
                <Eye className="w-4 h-4 text-green-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        ))}

        <Separator className="my-4" />

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Salvar Configuração
        </Button>
      </CardContent>
    </Card>
  );
}
