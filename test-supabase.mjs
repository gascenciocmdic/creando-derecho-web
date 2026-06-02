import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cebohxzcuooiszruwowq.supabase.co';
const supabaseKey = 'sb_publishable_tuvGmHqfySjQyupGoy7nCw_w8rA7s9u';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Syncing content.json to database...');
  try {
    const raw = await fs.readFile('./data/content.json', 'utf-8');
    const json = JSON.parse(raw);
    const { error: upsertError } = await supabase.from('website_content').upsert({ id: 1, data: json });
    if (upsertError) {
      console.error('Upsert Error:', upsertError.message);
    } else {
      console.log('Content synced to Supabase database successfully!');
    }
  } catch (e) {
    console.error('File read/parse error:', e.message);
  }
}

test();
