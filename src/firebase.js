import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oatqibrzrbmpgwcffzih.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdHFpYnJ6cmJtcGd3Y2ZmemloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDAwMTMsImV4cCI6MjA4OTkxNjAxM30.6DvZWwWNmBQqvQ1I5lPPbJBOFBInqDhcdqWJRUd-kUQ'

export const supabase = createClient(supabaseUrl, supabaseKey)