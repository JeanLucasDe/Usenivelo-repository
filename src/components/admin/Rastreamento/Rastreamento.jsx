import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/customSupabaseClient";
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

// Icons
import { ArrowLeft, FormInput as FormInputIcon, Settings } from "lucide-react";
import CardRastreio from "./CardRasteio";


export default function Rastreamento() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("steps");
  const [activeSubmoduleId, setActiveSubmoduleId] = useState(null);
  const [title, setTitle] = useState('')

  const [user, setUser] = useState({})

  const [submodules, setSubmodules] = useState([])
  const [steps, setSteps] = useState([])
  const [cards, setCards] = useState([])
  const [cardsSelected, setCardsSelected] = useState([])
  // Estado para o input de busca
  const [searchID, setSearchID] = useState('');

  // Filtro dinâmico dos cards selecionados
  const filteredCards = cardsSelected.filter(card => {
    if (!searchID) return true; // sem filtro, mostra todos
    return card.id.toLowerCase().includes(searchID.toLowerCase().trim());
  });

  const [activeFilterId, setActiveFilterID] = useState(false)
  
  const fetchData = async () => {
  // ---- User logado ----
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  setUser(user);

  if (!user) return;

  // ---- Buscar steps do Kanban ----
  const { data: stepsData, error: stepsErr } = await supabase
    .from("kanban_steps")
    .select();

  if (stepsErr) {
    console.error("Erro ao carregar steps:", stepsErr);
    return;
  }

  // ---- Buscar cards do usuário ----
  const { data: cardsData, error: cardsErr } = await supabase
    .from("kanban_cards")
    .select()
    .eq("created_by", user.id);

  if (cardsErr) {
    console.error("Erro ao carregar cards:", cardsErr);
    return;
  }

  // ---- Filtrar steps que têm cards ----
  const stepsComCards = stepsData.filter(step =>
    cardsData.some(card => card.step_id === step.id)
  );

  // ---- IDs dos Kanbans desses steps ----
  const stepKanbanIds = [...new Set(stepsComCards.map(step => step.kanban_id))];

  const kanbanIds = stepKanbanIds.length > 0 ? stepKanbanIds : ["-1"];

  // ---- Submodules correspondentes aos Kanbans ----
  const { data: submodulesData, error: subErr } = await supabase
    .from("submodules")
    .select()
    .in("id", kanbanIds);

  if (subErr) {
    console.error("Erro ao carregar submodules:", subErr);
    return;
  }

  // ---- IDs dos usuários donos ----
  const ownerIds = [...new Set(submodulesData.map(sub => sub.user_id))];
  const finalOwnerIds = ownerIds.length > 0 ? ownerIds : ["-1"];

  // ---- Buscar usuários donos ----
  const { data: usersData, error: usersErr } = await supabase
    .from("users")
    .select()
    .in("id", finalOwnerIds);

  if (usersErr) {
    console.error("Erro ao carregar usuários:", usersErr);
    return;
  }

  // ---- IDs das empresas desses usuários ----
  const companyIds = [...new Set(usersData.map(u => u.company_id))];
  const finalCompanyIds = companyIds.length > 0 ? companyIds : ["-1"];

  // ---- Buscar empresas ----
  const { data: companyData, error: compErr } = await supabase
    .from("companies")
    .select()
    .in("id", finalCompanyIds);

  if (compErr) {
    console.error("Erro ao carregar empresas:", compErr);
    return;
  }

  // ---- Montar estrutura final ----
  const submodulesComInfo = submodulesData.map(sub => {
    const creator = usersData.find(u => u.id === sub.user_id);
    const company = companyData.find(c => c.id === creator?.company_id);

    return {
      ...sub,
      creator: {
        ...creator,
        company: company || null
      }
    };
  });

  // ---- SETS ----
  setSubmodules(submodulesComInfo);
  setCards(cardsData);
  setSteps(stepsComCards);
};


  useEffect(()=> {
    fetchData()
  },[])

const handleSelectSubmodule = (sub) => {

  try{
    const stepsFilter = steps.filter((st) => st.kanban_id === sub.id);

    // Pega todos os cards de QUALQUER etapa daquele submodule
    const cardsFilter = cards.filter((card) =>
      stepsFilter.some((step) => step.id === card.step_id)
    );

    setCardsSelected(cardsFilter)
    setTitle(sub.name)
    console.log(stepsFilter)
  } catch (err) {
    throw err
  }
  
}

  const formatPhone = (phone)=> {
  if (!phone) return "";
  
  // Remove tudo que não for número
  const digits = phone.replace(/\D/g, "");

  // Formato brasileiro: (XX) XXXXX-XXXX
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  // Formato com 10 dígitos: (XX) XXXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  // Se não bater com os padrões, retorna apenas os números
  return digits;
}

  const CompanyCard = ({ creator }) => {
  if (!creator) return null;

  const company = creator.company;

  return (
   <div className="bg-gray-100 dark:bg-gray-900 shadow-lg rounded-xl p-6 flex flex-col md:flex-row gap-6 border border-gray-200 dark:border-gray-700 font-sans transition-all ">
  
  {/* Logo */}
  <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
    {company?.logo ? (
      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-gray-400 text-2xl font-bold">{company?.name?.[0] ?? "C"}</span>
    )}
  </div>

  {/* Informações principais */}
  <div className="flex-1 flex flex-col justify-between">
    
    {/* Empresa e plano */}
    <div>
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Empresa</h4>
      <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{company?.name}</p>
    </div>

    {/* Contato */}
    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
      {creator.email && (
        <div className="flex items-center gap-2">
          📧 <span>{creator.email}</span>
        </div>
      )}
      {creator.phone && (
        <div className="flex items-center gap-2">
          📞 <span>{formatPhone(creator.phone)}</span>
        </div>
      )}
      {company?.cnpj && (
        <div className="flex items-center gap-2">
          🏢 <span>{company.cnpj}</span>
        </div>
      )}
      {creator.company.instagram && (
        <div className="flex items-center gap-2">
          📸 <a 
                href={`https://instagram.com/${creator.company.instagram.replace('@','')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
            {creator.company.instagram}
          </a>
        </div>
      )}
    </div>

    {/* Endereço */}
    {company?.address && (
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        📍 <span>{company.address}, {company.city} - {company.state}, {company.zipCode}</span>
      </div>
    )}

  </div>
</div>

  );
}


  
  return (
    <div className="p-4">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mb-4"
        title="Voltar"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Nome do Kanban */}
      <div className="mb-5">
        <h2 className="font-bold">Rastreamento</h2>
      </div>

      {/* Layout principal */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-6 mx-auto"
      >
        {/* Sidebar */}
        <Card className="md:w-1/4 h-fit shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Itens</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
         {submodules?.map((sub) => (
  <div key={sub.id} className="space-y-1">
    <Button
      variant={activeSubmoduleId === sub.id ? "default" : "ghost"}
      onClick={() => {
        setActiveSubmoduleId(sub.id);
        handleSelectSubmodule(sub);
      }}
      className="w-full justify-start gap-2"
    >
      {sub.name}
    </Button>
     
    {/* Info do criador */}
    <div className="ml-3 text-xs text-gray-500 flex items-center">
      <img src={sub.creator?.company?.logo} alt="logo" className="w-7 h-7"/>{sub.creator?.company?.name || "Sem empresa"}
    </div>

    <div className="border-b my-2 opacity-100"></div>
    </div>
          ))}


          </CardContent>
        </Card>

        {/* Conteúdo principal */}
        <Card className="flex-1 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {activeSubmoduleId && (
                <CompanyCard 
                  creator={submodules.find(s => s.id === activeSubmoduleId)?.creator} 
                />
              )}


            </CardTitle>
          </CardHeader>

          <CardContent>

            {/* Aba: Submodules */}
            {activeTab === "steps" && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
              {cardsSelected.length > 0 && (
                  <div className="mb-4">
                    <Label>Buscar por ID</Label>
                    <Input
                      type="text"
                      placeholder="Digite o ID do card..."
                      value={searchID}
                      onChange={(e) => setSearchID(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => {
                    const etapa = steps.find((s) => s.id === card.step_id);
                    return (
                      <CardRastreio
                        key={card.id}
                        card={card}
                        etapa={etapa}
                        user={user}
                        onAddComment={async (comment) => {
                          setCardsSelected(prev =>
                            prev.map(c =>
                              c.id === card.id
                                ? { ...c, data: { ...c.data, comments: [comment, ...(c.data.comments || [])] } }
                                : c
                            )
                          );

                          await supabase
                            .from("kanban_cards")
                            .update({
                              data: {
                                ...card.data,
                                comments: [comment, ...(card.data.comments || [])],
                              },
                            })
                            .eq("id", card.id);
                        }}
                      />
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum card encontrado</p>
                )}




              </motion.div>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
