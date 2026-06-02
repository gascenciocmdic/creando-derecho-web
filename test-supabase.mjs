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
  const { data: contentData, error: contentError } = await supabase.from('website_content').select('*').eq('id', 1).single();
  if (contentError) console.error('Content Error:', contentError.message);
  else console.log('Content OK:', JSON.stringify(contentData, null, 2));

  console.log('Testing storage buckets...');
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload('test-connection.txt', Buffer.from('hello world'), {
      contentType: 'text/plain',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload Error:', uploadError);
  } else {
    console.log('Upload success!', uploadData);
  }
}

test();
