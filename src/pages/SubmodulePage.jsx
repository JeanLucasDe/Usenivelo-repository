import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubmoduleFieldsCRUD from '@/components/admin/SubmoduleFieldsCRUD';
import { supabase } from '@/lib/customSupabaseClient';

const SubmodulePage = () => {
  const { submoduleId } = useParams();
  const [label, setLabel] = useState('');
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmodule = async () => {
      const { data, error } = await supabase
        .from('submodules')
        .select('*')
        .eq('id', submoduleId)
        .single();

        setLoading(false)
      if (error) console.error(error);
      else {
        setLabel(data.name)
        setData(data)
      };
    };

    fetchSubmodule();
  }, [submoduleId]);

  return !loading && <SubmoduleFieldsCRUD submoduleId={submoduleId} label={label} data={data}/>
};

export default SubmodulePage;
