import { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CurrentPlanCard({ user }) {
  const [plan, setPlan] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        setLoading(true);

        // 1️⃣ Busca o ID do plano atual do usuário
        const { data: userData, error: userError } = await supabase
          .from("users") // ou o nome da sua tabela de usuários
          .select("plan")
          .eq("id", user?.id)
          .single();
          console.log(userData)

        if (userError) throw userError;
        if (!userData?.plan) {
          setLoading(false);
          return;
        }

        // 2️⃣ Busca os dados do plano
        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("*")
          .eq("id", userData.plan)
          .single();

        if (planError) throw planError;

        // 3️⃣ Busca as features do plano
        const { data: featuresData, error: featError } = await supabase
          .from("plan_features")
          .select("feature_name")
          .eq("plan_id", planData.id);

        if (featError) throw featError;

        setPlan(planData);
        setFeatures(featuresData.map((f) => f.feature_name));
      } catch (err) {
        console.error("Erro ao buscar plano:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );

  if (!plan)
    return (
      <div className="text-center p-8 border rounded-xl bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          Nenhum plano ativo no momento.
        </p>
        <Button className="mt-4" asChild>
          <a href="/plans">Escolher um plano</a>
        </Button>
      </div>
    );

  return (
    <div
      className={`relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg ${
        plan.popular ? "ring-2 ring-blue-600 scale-105" : ""
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold">
            R$ {Number(plan.price).toFixed(2).replace(".", ",")}
          </span>
          <span className="text-gray-500 ml-1">{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => (window.location.href = "/#plans")}
      >
        Gerenciar Plano
      </Button>
    </div>
  );
}
