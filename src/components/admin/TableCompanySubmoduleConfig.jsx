import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Save } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";

export default function TableCompanySubmoduleConfig() {
  const { submoduleId } = useParams();
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [visibleFields, setVisibleFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [allFields, setAllFields] = useState([]);
  const initialized = useRef(false); // ✅ evita recriar defaults depois do primeiro load

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Usuário logado
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;

      // 2️⃣ Dados do usuário
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();
      if (userError) throw userError;
      setUser(userData);

      // 3️⃣ Empresa
      let companyData = null;
      if (userData.company_id) {
        const { data: compData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", userData.company_id)
          .single();
        if (!companyError) companyData = compData;
      }
      setCompany(companyData);

      // 4️⃣ Campos disponíveis
      const userFields = Object.keys(userData).filter(
        (k) => userData[k] !== null && typeof userData[k] !== "object"
      );
      const companyFields = companyData
        ? Object.keys(companyData).filter(
            (k) => companyData[k] !== null && typeof companyData[k] !== "object"
          )
        : [];

      const all = [
        ...userFields.map((f) => ({ field: f, type: "user" })),
        ...companyFields.map((f) => ({ field: f, type: "company" })),
      ];
      setAllFields(all);

      // 5️⃣ Busca configs existentes
      const { data: configs, error: configError } = await supabase
        .from("user_submodule_fields")
        .select("*")
        .eq("user_id", userData.id)
        .eq("submodule_id", submoduleId);

      if (configError) throw configError;

      // 6️⃣ Cria defaults só se não existirem (somente 1x)
      if (!initialized.current && (!configs || configs.length === 0)) {
        const defaults = all.map((f) => ({
          user_id: userData.id,
          submodule_id: submoduleId,
          field_name: f.field,
          field_origin: f.type,
          visible: false,
        }));

        await supabase
          .from("user_submodule_fields")
          .upsert(defaults, {
            onConflict: "user_id,submodule_id,field_name,field_origin",
          });
        initialized.current = true; // ✅ evita recriar
      }

      // 7️⃣ Atualiza visibilidade com base no que existe no banco
      const visibility = all.reduce((acc, f) => {
        const saved = configs?.find(
          (r) => r.field_name === f.field && r.field_origin === f.type
        );
        acc[`${f.type}.${f.field}`] = saved ? saved.visible : false;
        return acc;
      }, {});
      setVisibleFields(visibility);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submoduleId]);

  const handleToggle = (key, checked) => {
    setVisibleFields((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updates = allFields.map(({ field, type }) => ({
        user_id: user.id,
        submodule_id: submoduleId,
        field_name: field,
        field_origin: type,
        visible: visibleFields[`${type}.${field}`] || false,
      }));

      // ✅ Usa upsert em lote — seguro, simples, e não reinicializa
      const { error } = await supabase
        .from("user_submodule_fields")
        .upsert(updates, {
          onConflict: "user_id,submodule_id,field_name,field_origin",
        });

      if (error) throw error;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      await fetchData(); // recarrega estado visual atualizado
    }
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Configurar Colunas de Usuário e Empresa
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6 mt-4">
        {/* Usuário */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Usuário</h3>
          {allFields
            .filter((f) => f.type === "user")
            .map(({ field, type }) => (
              <div
                key={`${type}.${field}`}
                className="flex items-center justify-between py-1"
              >
                <Label>{field.replace(/_/g, " ").toUpperCase()}</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={visibleFields[`${type}.${field}`] || false}
                    onChange={(checked) =>
                      handleToggle(`${type}.${field}`, checked)
                    }
                  />
                  {visibleFields[`${type}.${field}`] ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
        </div>

        <Separator />

        {/* Empresa */}
        {company && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Empresa</h3>
            {allFields
              .filter((f) => f.type === "company")
              .map(({ field, type }) => (
                <div
                  key={`${type}.${field}`}
                  className="flex items-center justify-between py-1"
                >
                  <Label>{field.replace(/_/g, " ").toUpperCase()}</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={visibleFields[`${type}.${field}`] || false}
                      onChange={(checked) =>
                        handleToggle(`${type}.${field}`, checked)
                      }
                    />
                    {visibleFields[`${type}.${field}`] ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

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
