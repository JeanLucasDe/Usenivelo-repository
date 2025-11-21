import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Building2, MapPin, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/customSupabaseClient";
import { useDashboard } from '@/contexts/DashboardContext';
import PermissionsTab from "./Tabs/PermissionsTab";
import CurrentPlanCard from "./CurrentPlanCard";
import { uploadFileToSupabase } from "../../lib/uploadFile";

export default function AccountSettings() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("perfil");
    const [userData, setUserData] = useState({});
    const [companyData, setCompanyData] = useState({});
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const { refreshSidebar } = useDashboard();

  const fetchModules = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getUser();
      const user = data?.user;
      if (userError || !user) return;

      const { data: dbUser, error: dbUserError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (dbUserError) throw dbUserError;

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("id", dbUser.company_id)
        .single();

      if (companyError) throw companyError;

      setUserData(dbUser);
      setCompanyData(company);
      setFormData({
        ...dbUser,
        company_name: company?.name || "",
        company_email: company?.email || "",
        company_phone: company?.phone || "",
        instagram: company?.instagram || "",
        logo: company?.logo || ""
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    setLoading(true);
    console.log(formData)
    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        instagram:formData.instagram
      })
      .eq("id", userData.id);

    setLoading(false);
    refreshSidebar();
    if (error) toast({ description: "❌ Erro ao salvar usuário" });
    else toast({ description: "✅ Alterações salvas com sucesso!" });
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("companies")
      .update({
        name: formData.company_name,
        instagram:formData.instagram,
        logo:formData.logo
      })
      .eq("id", userData.company_id);

    setLoading(false);
    refreshSidebar();
    if (error) toast({ description: "❌ Erro ao salvar empresa" });
    else toast({ description: "✅ Dados da empresa atualizados!" });

  };
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const uploadedUrl = await uploadFileToSupabase(file, "logos");

    if (uploadedUrl) {
      setFormData((prev) => ({
        ...prev,
        logo: uploadedUrl, // salva o link público no form
      }));
    }

    setUploading(false);
  };


  return (
    <>
    
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-6 mx-auto pt-6"
    >

      {/* Sidebar */}
      <Card className="md:w-1/4 h-fit shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={activeTab === "perfil" ? "default" : "ghost"}
            onClick={() => setActiveTab("perfil")}
            className="w-full justify-start gap-2"
          >
            <User size={16} /> Perfil
          </Button>
          <Button
            variant={activeTab === "empresa" ? "default" : "ghost"}
            onClick={() => setActiveTab("empresa")}
            className="w-full justify-start gap-2"
          >
            <Building2 size={16} /> Empresa
          </Button>
          <Button
            variant={activeTab === "endereco" ? "default" : "ghost"}
            onClick={() => setActiveTab("endereco")}
            className="w-full justify-start gap-2"
          >
            <MapPin size={16} /> Endereço
          </Button>
          <Button
            variant={activeTab === "plan" ? "default" : "ghost"}
            onClick={() => setActiveTab("plan")}
            className="w-full justify-start gap-2"
          >
            <ShieldCheck size={16} /> Plano
          </Button>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="flex-1 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {activeTab === "perfil" && "Informações Pessoais"}
            {activeTab === "empresa" && "Dados da Empresa"}
            {activeTab === "endereco" && "Endereço"}
            {activeTab === "permissoes" && "Permissões de Usuário"}
            {activeTab === "plan" && "Meu Plano"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === "perfil" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label>Nome completo</Label>
                <Input
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={formData.email || ""} disabled />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="Ex: 71999999999"
                />
              </div>
              <div>
                <Label>Função</Label>
                <Input value={formData.role || ""} disabled />
              </div>
              <Button
                onClick={handleSaveUser}
                disabled={loading}
                className="w-full mt-2"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Salvar"}
              </Button>
            </motion.div>
          )}

          {activeTab === "empresa" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
                <div>
                    <Label>ID</Label>
                    <Input
                    name="company_name"
                    value={formData.id || ""}
                    onChange={handleChange}
                    disabled
                    />
                </div>
                <div>
                    <Label>Nome da Empresa</Label>
                    <Input
                    name="company_name"
                    value={formData.company_name || ""}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Instagram</Label>
                    <Input
                    name="instagram"
                    value={formData.instagram || ""}
                    onChange={handleChange}
                    />
                </div>
                <div>
                <Label>Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="cursor-pointer"
                />

                {/* Preview */}
                {formData.logo && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain border rounded-lg"
                    />
                    <span className="text-sm text-gray-500 truncate w-40">
                      {formData.logo}
                    </span>
                  </div>
                )}
              </div>
                <Button
                    onClick={handleSaveCompany}
                    disabled={loading}
                    className="w-full mt-2"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Salvar"}
                </Button>
            </motion.div>
          )}

          {activeTab === "endereco" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <Label>Rua</Label>
                <Input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Estado</Label>
                <Input
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>CEP</Label>
                <Input
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleChange}
                />
              </div>
              <Button
                onClick={handleSaveUser}
                disabled={loading}
                className="w-full mt-2"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Salvar"}
              </Button>
            </motion.div>
          )}

          {activeTab === "plan" && (
           <CurrentPlanCard
            user={userData}
          />
          )}
        </CardContent>
      </Card>
    </motion.div>
    </>
  );
}
