import React, { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import Header from "./componentsPages/Header";
import { useToast } from '@/components/ui/use-toast';
import { Menu } from "lucide-react";


// Estrutura do menu lateral
const menuItems = [
    { id: "overview", label: "Visão Geral" },
    { id: "modules", label: "Módulos" },
    { id: "submodules", label: "Submódulos" },
    { id: "fields", label: "Campos" },
    { id: "records", label: "Registros" },
];




const Documentation = () => {
    const { user, signOut, userRole } = useAuth();
    const {toast} = useToast();

    const [activeSection, setActiveSection] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleLogout = async () => {
        await signOut();
        navigate('/');
        toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso" });
    };
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
  <h2 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">🌐 Visão Geral do Sistema de Registros</h2>
  <p className="text-gray-700 dark:text-gray-300">
    Este sistema permite criar, editar e gerenciar registros dentro de submódulos de forma flexível e automatizada. 
    Ele combina campos simples, fórmulas, etapas e relações, garantindo que os dados sejam consistentes, integrados e fáceis de consultar.
  </p>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-pink-600 dark:text-pink-400">🛠️ Estrutura do sistema</h3>
  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
    <li>
      <strong>Módulos:</strong> Blocos principais que organizam as áreas de informações da plataforma.
    </li>
    <li>
      <strong>Submódulos:</strong> Divisões dentro de cada módulo que agrupam registros relacionados a um tema específico.
    </li>
    <li>
      <strong>Campos (Fields):</strong> Unidades de informação dentro de cada submódulo, podendo ser texto, número, data, booleano, select, fórmula, etapas ou relação.
    </li>
    <li>
      <strong>Subcampos:</strong> Campos auxiliares usados em fórmulas ou etapas, permitindo cálculos e acompanhamento detalhado.
    </li>
    <li>
      <strong>Registros:</strong> Cada entrada de dados preenchida pelo usuário, armazenando informações de acordo com os campos do submódulo.
    </li>
  </ul>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-400">📌 Como os registros funcionam</h3>
  <p className="text-gray-700 dark:text-gray-300">
    Cada registro combina os dados dos campos preenchidos pelo usuário, realiza cálculos automáticos de fórmulas, gerencia etapas e integra relações com outros submódulos. 
    Ele pode ser <strong>criado</strong> ou <strong>atualizado</strong> e mantém o histórico e integridade das informações.
  </p>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-green-600 dark:text-green-400">💡 Principais funcionalidades</h3>
  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
    <li>Campos de diferentes tipos: texto, número, data, booleano, select, fórmula, etapas e relação.</li>
    <li>Fórmulas recalculadas automaticamente com base em outros campos ou subcampos.</li>
    <li>Campos de etapas para acompanhamento de progresso ou fases.</li>
    <li>Campos de relação que conectam registros entre submódulos diferentes, com cálculo de subtotais.</li>
    <li>Cache local para fórmulas e subcampos, garantindo que dados temporários não sejam perdidos.</li>
    <li>Decisão automática entre criar ou atualizar registros no banco de dados.</li>
    <li>Notificações para informar sucesso ou falha no salvamento.</li>
  </ul>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-orange-600 dark:text-orange-400">📚 Fluxo de um registro</h3>
  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
    <li>Usuário preenche os campos do formulário.</li>
    <li>Fórmulas são recalculadas automaticamente.</li>
    <li>Campos de relação podem ser adicionados com quantidade e subtotal.</li>
    <li>Os dados são mapeados para o formato correto da tabela do banco de dados.</li>
    <li>O sistema decide entre criar um novo registro ou atualizar um existente.</li>
    <li>Valores de fórmulas podem ser salvos no cache local.</li>
    <li>O usuário recebe uma notificação confirmando o sucesso do salvamento.</li>
  </ol>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-purple-600 dark:text-purple-400">🎯 Resumo simples</h3>
  <p className="text-gray-700 dark:text-gray-300">
    O sistema de registros é projetado para ser flexível, integrado e confiável.  
    Ele combina campos simples e avançados, automatiza cálculos e relações, e garante que todos os dados fiquem consistentes e facilmente consultáveis.
  </p>
</div>

        );
        case "modules":
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">
        📦 Módulos e Submódulos
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Os <strong className="text-indigo-600 dark:text-indigo-400">módulos</strong> são como caixas principais onde você organiza seus dados. 
        Dentro de cada módulo, você pode criar <strong className="text-pink-600 dark:text-pink-400">submódulos</strong>, que funcionam como divisórias para separar informações diferentes.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-400">🚀 Como funciona passo a passo</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li><strong>Primeiro acesso:</strong> Tela de boas-vindas com botão para criar seu primeiro módulo. Um guia interativo mostra onde clicar.</li>
        <li><strong>Criar módulo:</strong> Clique no botão, escolha nome e ícone. Um submódulo padrão “Geral” é criado automaticamente.</li>
        <li><strong>Adicionar submódulos:</strong> Cada módulo pode ter várias divisórias. Clique em “Adicionar Submódulo” para criar uma nova divisória.</li>
        <li><strong>Editar ou excluir:</strong> Botões dentro de cada módulo/submódulo permitem mudar o nome ou apagar. Confirmação de exclusão garante segurança.</li>
        <li><strong>Organizar módulos:</strong> Arraste os módulos para mudar a ordem, como mover pastas na sua mesa de trabalho.</li>
      </ol>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-green-600 dark:text-green-400">💡 Modais e mensagens</h3>
      <p className="text-gray-700 dark:text-gray-300">
        Ao criar, editar ou excluir algo, aparece uma <strong>janela modal</strong> para você digitar informações ou confirmar ações.
        Depois, uma mensagem rápida (<strong>toast</strong>) aparece para avisar se deu certo ou se houve algum problema.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-orange-600 dark:text-orange-400">📚 Tutorial integrado</h3>
      <p className="text-gray-700 dark:text-gray-300">
        Um tutorial interativo mostra:
      </p>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
        <li>Como criar o primeiro módulo</li>
        <li>Como visualizar módulos existentes</li>
        <li>Como adicionar submódulos</li>
      </ul>
      <p>Mostrado apenas na primeira vez</p>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-pink-600 dark:text-pink-400">📝 Resumo simples</h3>
      <p className="text-gray-700 dark:text-gray-300">
        Imagine sua empresa organizada em caixas e divisórias:
      </p>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
        <li><strong>Módulo = Caixa principal:</strong> Pode ser “Loja”, “Liga” ou “Frota”.</li>
        <li><strong>Submódulo = Divisória:</strong> Dentro de “Frota” você pode ter “Motoristas” e “Viagens”.</li>
        <li><strong>Toasts = Mensagens rápidas:</strong> Avisam se a ação deu certo ou se houve algum problema.</li>
      </ul>
    </div>
  );
        case "submodules":
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">🗂️ Submódulos</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Os <strong className="text-purple-600 dark:text-purple-400">submódulos</strong> são como divisórias dentro de cada módulo. 
        Eles ajudam a organizar ainda melhor as informações, separando os dados em categorias menores e mais fáceis de entender.
      </p>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-400">🚀 Como usar os submódulos</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Criar submódulo:</strong> Dentro de um módulo, clique em “Adicionar Submódulo”, dê um nome à divisória e clique em criar. 
          É como colocar uma nova aba dentro de uma pasta.
        </li>
        <li>
          <strong>Editar submódulo:</strong> Clique no botão de lápis 🖉 ao lado do submódulo para alterar o nome.
        </li>
        <li>
          <strong>Excluir submódulo:</strong> Clique no botão de lixeira 🗑️ para remover. O sistema pedirá confirmação para evitar erros.
        </li>
        <li>
          <strong>Visualizar submódulos:</strong> Cada submódulo é uma página separada onde você poderá adicionar registros, campos ou informações específicas.
        </li>
      </ol>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-green-600 dark:text-green-400">💡 Dicas importantes</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
        <li>Use submódulos para separar tipos de dados diferentes dentro de um módulo.</li>
        <li>Mantenha nomes curtos e claros para facilitar a navegação.</li>
        <li>Não se preocupe em criar muitos submódulos, você sempre pode reorganizar ou excluir.</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-orange-600 dark:text-orange-400">📚 Exemplos práticos</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
        <li>Módulo <strong>Clientes</strong> → Submódulos: “VIP”, “Regular”, “Inativos”.</li>
        <li>Módulo <strong>Produtos</strong> → Submódulos: “Eletrônicos”, “Roupas”, “Alimentos”.</li>
        <li>Módulo <strong>Vendas</strong> → Submódulos: “Orçamentos”, “Pedidos”, “Faturas”.</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-6 mb-2 text-purple-600 dark:text-purple-400">🎯 Resumo simples</h3>
      <p className="text-gray-700 dark:text-gray-300">
        Pense assim: <strong>Módulo</strong> = pasta grande, <strong>Submódulo</strong> = divisórias dentro da pasta. 
        Cada divisória organiza melhor as informações, deixando tudo fácil de encontrar.
      </p>
    </div>
  );

        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Submódulos</h2>
            <p>
              Submódulos são divisões dentro dos módulos. Eles permitem organizar os campos e registros de forma mais granular.
              É possível criar, editar e remover submódulos diretamente na interface do módulo pai.
            </p>
          </div>
        );
        case "fields":
        return (
            <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h2 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">✏️ Campos (Fields)</h2>
            <p className="text-gray-700 dark:text-gray-300">
                Campos são os blocos de informação dentro de cada submódulo. 
                Eles determinam **que tipo de dado você pode registrar**, como texto, número, datas, seleções e muito mais.
            </p>

            <h3 className="text-2xl font-semibold mt-6 mb-2 text-pink-600 dark:text-pink-400">🛠️ Como criar um campo</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Clique em “Novo Campo” dentro do submódulo.</li>
                <li>Escolha um nome claro para o campo, para que todos entendam o que ele representa.</li>
                <li>Selecione o tipo do campo (ex.: texto, número, data, etc.).</li>
                <li>Se necessário, adicione subcampos ou configure fórmulas.</li>
                <li>Clique em “Salvar” para registrar o campo no sistema.</li>
            </ol>

            <h3 className="text-2xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-400">📌 Tipos de Campos</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li>
                <strong>Text (Texto):</strong> Para informações simples, como nomes ou descrições.
                </li>
                <li>
                <strong>Number (Número):</strong> Para valores numéricos, como quantidade, preço ou pontuação.
                </li>
                <li>
                <strong>Date (Data):</strong> Para datas, como aniversários, vencimentos ou registros de eventos.
                </li>
                <li>
                <strong>Booleano (Sim/Não):</strong> Para campos de decisão, verdadeiro ou falso.
                </li>
                <li>
                <strong>Email:</strong> Para capturar endereços de e-mail.
                </li>
                <li>
                <strong>Phone (Telefone):</strong> Para registrar números de telefone.
                </li>
                <li>
                <strong>Textarea (Área de Texto):</strong> Para textos longos ou observações detalhadas.
                </li>
                <li>
                <strong>Link:</strong> Para adicionar URLs ou links externos.
                </li>
                <li>
                <strong>Select (Seleção):</strong> Permite escolher entre várias opções pré-definidas. 
                É ótimo para categorias ou status.
                </li>
                <li>
                <strong>Etapas:</strong> Campos com várias fases ou passos. Cada subcampo representa uma etapa.
                </li>
                <li>
                <strong>Fórmula:</strong> Campos que calculam valores automaticamente com base em outros campos. Ex.: (Altura * Largura) / 2.
                </li>
                <li>
                <strong>Relation (Relação):</strong> Campos que se conectam a outros módulos ou submódulos, trazendo dados de registros relacionados.
                </li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6 mb-2 text-green-600 dark:text-green-400">💡 Dicas importantes</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Mantenha os nomes dos campos curtos e claros.</li>
                <li>Use tipos diferentes conforme o dado que será armazenado.</li>
                <li>Campos de fórmula e etapas podem ter subcampos, então planeje antes de criar.</li>
                <li>Campos de relação ajudam a conectar informações entre módulos, criando um sistema mais integrado.</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6 mb-2 text-orange-600 dark:text-orange-400">📚 Exemplos práticos</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Campo “Nome do Cliente” → tipo Text.</li>
                <li>Campo “Data de Nascimento” → tipo Date.</li>
                <li>Campo “Status do Pedido” → tipo Select (Opções: Pendente, Enviado, Concluído).</li>
                <li>Campo “Total da Venda” → tipo Fórmula (Ex.: Quantidade * Preço Unitário).</li>
                <li>Campo “Etapas do Projeto” → tipo Etapas (Ex.: Planejamento, Execução, Finalização).</li>
                <li>Campo “Cliente Relacionado” → tipo Relation (ligado ao módulo Clientes).</li>
            </ul>

            <h3 className="text-2xl font-semibold mt-6 mb-2 text-purple-600 dark:text-purple-400">🎯 Resumo simples</h3>
            <p className="text-gray-700 dark:text-gray-300">
                Cada campo define **que tipo de informação será registrada** em um submódulo.  
                Eles podem ser simples (texto, número) ou avançados (fórmula, etapas, relação), tornando seu sistema flexível e personalizado.
            </p>
            </div>
        );
        case "records":
        return (
          <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
  <h2 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">💾 Como funciona o salvamento de registros</h2>
  <p className="text-gray-700 dark:text-gray-300">
    O salvamento de registros é o processo que leva os dados preenchidos nos campos de um submódulo e os armazena no banco de dados. 
    Ele considera campos simples, fórmulas, etapas e relações, garantindo que os valores estejam sempre corretos e atualizados.
  </p>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-pink-600 dark:text-pink-400">🛠️ Etapas do salvamento</h3>
  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
    <li>
      O usuário preenche os campos do formulário, incluindo texto, número, datas, booleanos, select, etapas e relações.
    </li>
    <li>
      Campos de <strong>fórmula</strong> são recalculados automaticamente com base nos valores atuais de outros campos ou subcampos.
    </li>
    <li>
      Valores de fórmulas e subcampos podem ser armazenados no <strong>cache local</strong>, para que o usuário não perca dados durante a edição.
    </li>
    <li>
      Campos de <strong>relação</strong> permitem selecionar registros de outros submódulos, definindo a quantidade e calculando subtotais quando necessário.
    </li>
    <li>
      Antes de salvar, os dados do formulário são mapeados para o formato da tabela de destino, como a tabela <strong>transactions</strong> ou <strong>submodule_records</strong>.
    </li>
    <li>
      Campos especiais são identificados automaticamente pelo nome:
      <ul className="list-disc list-inside ml-5 text-gray-700 dark:text-gray-300">
        <li><strong>tipo:</strong> define se é entrada ou saída</li>
        <li><strong>descricao/nome/obs/nota:</strong> preenchimento do campo de descrição</li>
        <li><strong>total/valor:</strong> total do registro</li>
        <li><strong>data:</strong> data do registro</li>
      </ul>
    </li>
    <li>
      Se o registro contém campos de relação, o sistema soma automaticamente os subtotais para preencher o campo <strong>total</strong> se ele estiver vazio.
    </li>
    <li>
      O sistema decide se o registro será <strong>criado</strong> ou <strong>atualizado</strong>:
      <ul className="list-disc list-inside ml-5 text-gray-700 dark:text-gray-300">
        <li>Se o registro já existe, ele é atualizado no banco.</li>
        <li>Se for um novo registro, ele é inserido na tabela correspondente.</li>
      </ul>
    </li>
    <li>
      Após o salvamento, dados como fórmulas e valores temporários podem ser limpos ou mantidos conforme a configuração de cache.
    </li>
    <li>
      O sistema exibe uma notificação para o usuário confirmando o sucesso do salvamento.
    </li>
  </ol>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-400">📌 Observações importantes</h3>
  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
    <li>Campos de fórmula e subcampos são recalculados dinamicamente sempre que algum valor muda.</li>
    <li>O cache local garante que fórmulas e subcampos não sejam perdidos se o modal for fechado sem salvar.</li>
    <li>Campos de relação permitem adicionar múltiplos registros relacionados, com quantidade e cálculo de subtotal.</li>
    <li>O salvamento é seguro e verifica se o usuário está autenticado antes de inserir ou atualizar os dados.</li>
    <li>Erros de conexão ou validação são exibidos no console, garantindo rastreabilidade de problemas.</li>
  </ul>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-green-600 dark:text-green-400">💡 Dicas para registros confiáveis</h3>
  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
    <li>Preencha todos os campos obrigatórios antes de salvar.</li>
    <li>Confira os valores calculados das fórmulas antes de confirmar o registro.</li>
    <li>Use os campos de relação para manter registros conectados corretamente.</li>
    <li>Habilite ou desabilite o cache local de fórmulas conforme sua preferência.</li>
  </ul>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-orange-600 dark:text-orange-400">📚 Exemplos práticos</h3>
  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
    <li>Registro de venda → campos: Cliente (relation), Produto (relation), Quantidade, Preço Unitário, Total (fórmula).</li>
    <li>Registro de projeto → campos: Etapas (checkboxes), Data de Início, Data de Término, Status (select).</li>
    <li>Registro financeiro → campos: Tipo (entrada/saída), Descrição, Valor, Data, Categoria (submoduleName).</li>
  </ul>

  <h3 className="text-2xl font-semibold mt-6 mb-2 text-purple-600 dark:text-purple-400">🎯 Resumo simples</h3>
  <p className="text-gray-700 dark:text-gray-300">
    O salvamento de registros é um processo inteligente que garante consistência e integridade dos dados.  
    Ele considera fórmulas, etapas e relações, decide entre criar ou atualizar registros e mantém o usuário informado sobre o sucesso ou erro do processo.
  </p>
        </div>


        );
      default:
        return null;
    }
  };

  return (
      <div className="font-sans">
      {/* Header */}
      <Header user={user} handleLogout={handleLogout} />

      {/* Botão para abrir Sidebar no mobile */}
      <button
        className="md:hidden fixed top-16 left-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex pt-24">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-3 left-0 h-full w-64 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-300 dark:border-gray-700
            transform transition-transform duration-300 z-50 mt-16
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          `}
        >
          <h1 className="text-xl font-bold mb-6">Docs</h1>
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false); // fecha menu mobile ao clicar
                }}
                className={`text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 ${
                  activeSection === item.id ? "bg-gray-300 dark:bg-gray-700 font-semibold" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-8 ml-0 md:ml-64 overflow-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          {renderContent(activeSection)}
        </main>
      </div>
    </div>
  );
};

export default Documentation;
