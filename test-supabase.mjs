import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cebohxzcuooiszruwowq.supabase.co';
const supabaseKey = 'sb_publishable_tuvGmHqfySjQyupGoy7nCw_w8rA7s9u';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing leads table...');
  const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*').limit(1);
  if (leadsError) console.error('Leads Error:', leadsError.message);
  else console.log('Leads OK');

  console.log('Testing website_content table...');
  const { data: contentData, error: contentError } = await supabase.from('website_content').select('*').limit(1);
  if (contentError) console.error('Content Error:', contentError.message);
  else console.log('Content OK');
}

test();
