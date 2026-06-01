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
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('Storage List Error:', bucketsError.message);
  } else {
    console.log('Buckets list:', buckets);
    const pdfsBucket = buckets.find(b => b.name === 'pdfs');
    if (!pdfsBucket) {
      console.log('Bucket pdfs not found. Attempting to create...');
      const { data: createData, error: createError } = await supabase.storage.createBucket('pdfs', {
        public: true,
        allowedMimeTypes: ['application/pdf']
      });
      if (createError) {
        console.error('Create Bucket Error:', createError.message);
      } else {
        console.log('Bucket pdfs created successfully!', createData);
      }
    } else {
      console.log('Bucket pdfs already exists!');
    }
  }
}

test();
