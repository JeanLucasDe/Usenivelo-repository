import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import {  Plus, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CreateNewField from './CreateNewField';
import RecordCreator from './RecordCreator';
import RecordsViewer from './RecordsViewer';
import Joyride from 'react-joyride';
import { Link} from 'react-router-dom';
import FilterDropdown from './DropDowns/FilterDropdown';
import RecordViewModal from './RecordViewModal';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
      <div className=" bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl w-full max-w-3xl space-y-6 transform transition-all duration-300 scale-100 motion-safe:animate-fadeIn">
        <h2 className="text-2xl font-bold  text-gray-900 dark:text-white">{title}</h2>
        {children}
        <div className="mt-6 text-right">
          <Button variant="outline" className="hover:scale-105 transition transform" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};


const SubmoduleFieldsCRUD = ({ submoduleId, label, data }) => {
  const { toast } = useToast();
  const [fields, setFields] = useState([]);
  const [subFields, setSubFields] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runTutorial, setRunTutorial] = useState(false);
  const [formConfig, setFormConfig] = useState([])

  // Fetch Fields
  const fetchFields = async () => {
    setFields([]);
    setSubFields([]);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('submodule_fields')
        .select('*')
        .eq('submodule_id', submoduleId);
      if (fieldsError) throw fieldsError;

      const { data: subFieldsData, error: subError } = await supabase
        .from('submodule_field_subfields')
        .select('*')
        .in('field_id', fieldsData.map(f => f.id));
      if (subError) throw subError;

      const { data: formsConfigData, error: formsConfigError } = await supabase
        .from('user_submodule_form_config')
        .select('*')
        .eq("user_id", user.id)
        .eq("submodule_id", submoduleId)
        

      if (formsConfigError) throw subError;

      setFields(fieldsData);
      setSubFields(subFieldsData || []);
      setFormConfig(formsConfigData)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao carregar campos:', err.message);
    }
  };
  // Fetch Records
  const fetchRecords = async () => {
    if (!submoduleId) return;
    const { data, error } = await supabase
      .from('submodule_records')
      .select('*')
      .eq('submodule_id', submoduleId)
      .order('id', { ascending: false });
    if (!error) setRecords(data);
  };
  const[isMobile, setIsMobile] = useState(false)

  useEffect(() => {
  setFields([]);
  setSubFields([]);
  setRecords([]);
  }, [submoduleId]);

  useEffect(() => {
    fetchFields();
    fetchRecords();
    const handleResize = () => setIsMobile(window.innerWidth < 640); // < sm breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [submoduleId]);
  useEffect(() => {
    const tutorialKey = "hasSeenSUBMODULECRUDTutorial";

    // se ainda não viu o tutorial
    if (!localStorage.getItem(tutorialKey)) {
      setRunTutorial(true);
      localStorage.setItem(tutorialKey, "true");
    }
  }, []);

  const steps = [
  {
    target: ".config_button",
    content: `Configure os campos de ${label} aqui`,
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: ".new_record",
    content: "Aqui você preenche seu formulário.",
  }
];

//filtros
const [activeFilter, setActiveFilter] = useState(null);
const [filteredRecords, setFilteredRecords] = useState(records);
useEffect(() => {
  if (!activeFilter) {
    setFilteredRecords(records);
    return;
  }

  const { column, operator, value } = activeFilter;

  const filtered = records.filter((rec) => {
    const recordValue = String(rec.data?.[column] ?? "").toLowerCase();
    const filterValue = String(value).toLowerCase();

    switch (operator) {
      case "=":
        return recordValue === filterValue;
      case "!=":
        return recordValue !== filterValue;
      case ">":
        return parseFloat(recordValue) > parseFloat(filterValue);
      case "<":
        return parseFloat(recordValue) < parseFloat(filterValue);
      case "ilike":
        return recordValue.includes(filterValue);
      default:
        return true;
    }
  });

  setFilteredRecords(filtered);
}, [activeFilter, records]);

const handleFilterApply = (filter) => {
  setActiveFilter(filter);
};


  // States para exclusão
const [deleteRecordModal, setDeleteRecordModal] = useState(false);
const [recordToDelete, setRecordToDelete] = useState(null);

// Função para abrir o modal


// Função para deletar
const handleDeleteRecord = async () => {
  if (!recordToDelete) return;
  try {
    await supabase
      .from('submodule_records')
      .delete()
      .eq('id', recordToDelete.id);
    fetchRecords();
    setDeleteRecordModal(false);
    setRecordToDelete(null);
    toast({ title: 'Registro excluído', description: 'O registro foi removido com sucesso.' });
  } catch (err) {
    console.error(err);
    toast({ title: 'Erro', description: err.message || String(err) });
  }
};

const [viewRecordModal, setViewRecordModal] = useState(false);

// Função para abrir o modal



const [openFilterModal, setOpenFilterModal] = useState(false)

function LargeModal({ isOpen, onClose, children, title = 'titulo' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
      <div
        className={`
          bg-white dark:bg-gray-800
          w-[40%] h-[100vh]
          shadow-2xl
          overflow-y-auto
          transform transition-all duration-300
          border border-gray-200 dark:border-gray-700
        `}
      >
        {/* Header com botão fechar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 border-gray-200"></div>
      </div>
    );
  }

  return (
   <div>
        <div className="space-y-6 p-4">
          {/**Modal Filter */}
          <LargeModal
          isOpen={openFilterModal}
          onClose={()=> setOpenFilterModal(false)}
          title="Filtrar"
          >
          </LargeModal>
          {/** Novo Header */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-2 sm:gap-3 md:justify-between">


              <h1 className="mb-3 flex flex-wrap items-center gap-2 ">
                <span
                  className="font-bold md:text-3xl sm:text-2md md:text-xl lg:text-lg "
                  title={label}
                >
                  {label}
                </span>

                <span className="text-gray-600 text-sm flex-shrink-0">
                  {fields.length} campos | {records.length} / {data.limit} registros 
                </span>
              </h1>
              {fields.length > 0 &&
              <Link
                to={`/admin/modules/${data.module_id}/sub/${data.id}/settings`}
                className="px-2 py-2 flex items-center gap-2 bg-white hover:bg-gray-100 text-black rounded-lg transition-transform duration-200 border border-gray-500"
              >
                <Settings className="w-5 h-5" /> Configurações
              </Link>}
            </div>

  {/* Se tiver campos, mostra filtros e busca */}
  {fields.length > 0 ? (
    <div className="mt-2">
      <div className='flex justify-between items-center'>
          <Button
            onClick={() => setViewRecordModal(true)}
            className="px-3 py-2 bg-blue-600 gap-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition rounded-lg shadow-md transform  new_record"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Registro</span>
          </Button>
          <FilterDropdown
            columns={fields.map((f) => f.name)}
            onApply={handleFilterApply}
          />
      </div>
          <RecordsViewer
          records={filteredRecords}
          fields={fields}
          subFields={subFields}
          fetchRecords={fetchRecords}
        />
    </div>
  ) : (
    // 🚀 Estado vazio para quando não há campos
    <div className="flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl py-10 mt-6">
      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
        <Settings className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Nenhum campo configurado
      </h2>
      <p className="text-gray-500 mb-4 text-sm">
        Você ainda não criou nenhum campo neste submódulo.
      </p>
      <Link
        to={`/admin/modules/${data.module_id}/sub/${data.id}/settings`}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition config_button flex"
      >
        <Plus className="w-5 h-5 mr-1" /> Criar primeiro campo
      </Link>
    </div>
    )}

       

     
           </div>
        </div>
      
      

      {/* Modal de visualização: renderizado só uma vez */}
      <Modal
        isOpen={viewRecordModal}
        onClose={() => setViewRecordModal(false)}
        title=""
      >
        <RecordCreator fields={fields} subFields={subFields} submodule_id={submoduleId} onClose={() => setViewRecordModal(false)} isOpen={viewRecordModal} fetchRecords={fetchRecords} creating={true} limit={data.limit}/>
      </Modal>
      {/* Modal de confirmação de exclusão */}
      
      <Modal
        isOpen={deleteRecordModal}
        onClose={() => setDeleteRecordModal(false)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-200">
            Tem certeza que deseja excluir o registro #{recordToDelete?.id.slice(0,8)}?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteRecordModal(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
              onClick={handleDeleteRecord}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
      <Joyride
      steps={steps}
      run={runTutorial}
      continuous
      showProgress
      locale={{
        back: "",           // remove o texto "Back"
        close: "Fechar",
        last: "Concluir",
        next: "Próximo",
        skip: "Pular",
      }}
      styles={{
        options: {
          primaryColor: "#4F46E5",
          textColor: "#333",
          zIndex: 10000,
        },
      }}
    />
   </div>
  );
};

export default SubmoduleFieldsCRUD;
