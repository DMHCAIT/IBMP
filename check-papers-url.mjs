import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function checkPapers() {
  try {
    console.log("Checking for 'Arthroscopy and Arthroplasty' paper...");
    
    const { data, error } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, slug, is_active')
      .ilike('name', '%arthroscopy%');
    
    if (error) {
      console.error("Error fetching papers:", error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log("Found papers:");
      data.forEach(p => {
        console.log(`  - Name: ${p.name}`);
        console.log(`    Slug: ${p.slug}`);
        console.log(`    Active: ${p.is_active}`);
        console.log(`    URL: http://localhost:3000/assessment-${p.slug}`);
      });
    } else {
      console.log("No papers found with 'arthroscopy' in name");
      
      // List all papers
      console.log("\nAll papers in database:");
      const { data: allPapers, error: allError } = await supabase
        .from('assessment_exam_papers')
        .select('name, slug, is_active');
      
      if (allError) {
        console.error("Error fetching all papers:", allError);
        return;
      }
      
      if (allPapers && allPapers.length > 0) {
        allPapers.forEach(p => {
          console.log(`  - ${p.name} (slug: ${p.slug}, active: ${p.is_active})`);
        });
      } else {
        console.log("  No papers found. You need to create papers first.");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

checkPapers();
