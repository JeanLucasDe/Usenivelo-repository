import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://raqiaakhswnavkcqrtjc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhcWlhYWtoc3duYXZrY3FydGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTk0MjMsImV4cCI6MjA3NDMzNTQyM30.vo-AV_GD_ruaa8phV7QKGCg6ViDPYwdsj3tcJPXV3S4';

export const supabase = createClient(supabaseUrl, supabaseKey);