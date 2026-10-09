import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Manually parse .env file
const envPath = path.resolve(process.cwd(), ".env");
const envConfig = fs.existsSync(envPath)
  ? fs
      .readFileSync(envPath, "utf-8")
      .split("\n")
      .reduce(
        (acc, line) => {
          const [key, ...value] = line.split("=");
          if (key && value) {
            acc[key.trim()] = value.join("=").trim().replace(/"/g, ""); // basic parsing
          }
          return acc;
        },
        {} as Record<string, string>,
      )
  : {};

// Fallback to process.env if available
const supabaseUrl =
  envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

// const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log("Testing connection to:", supabaseUrl);

  const url = supabaseUrl as string;
  const serviceKey = (envConfig.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY) as string;
  const anonKey = (envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;

  // Test 1: Service Role (Admin)
  const adminClient = createClient(url, serviceKey);
  const { data: adminData, error: adminError } = await adminClient
    .from("Project")
    .select("*");

  if (adminError) {
    console.error("Admin Client Error:", adminError.message);
  } else {
    console.log(`[Admin] Total Projects found: ${adminData?.length || 0}`);
    adminData?.forEach((p) =>
      console.log(
        ` - ID: ${p.id}, Title: ${p.title}, Featured: ${p.isFeatured}`,
      ),
    );
  }

  // Test 2: Anon Client (Public)
  const anonClient = createClient(url, anonKey);
  const { data: anonData, error: anonError } = await anonClient
    .from("Project")
    .select("*");

  if (anonError) {
    console.error("Anon Client Error:", anonError.message);
  } else {
    console.log(`[Anon] Total Projects found: ${anonData?.length || 0}`);

    if (
      (!anonData || anonData.length === 0) &&
      adminData &&
      adminData.length > 0
    ) {
      console.error(
        "CRITICAL: Admin can see projects but Anon cannot. This is likely an RLS Policy issue. You need a policy for SELECT on 'Project' table for 'anon' role.",
      );
    } else if (anonData && anonData.length > 0) {
      const featuredCount = anonData.filter((p) => p.isFeatured).length;
      console.log(`[Anon] Featured Projects: ${featuredCount}`);
      if (featuredCount === 0) {
        console.warn(
          "WARNING: Projects exist but none are 'isFeatured'. The homepage filters for 'isFeatured: true'.",
        );
      }
    }
  }

  // Test 3: Check Inquiries
  console.log("\n[Checking Inquiries...]");
  const { data: inquiries, error: inquiryError } = await adminClient
    .from("Inquiry")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(3);

  if (inquiryError) {
    console.error("Inquiry Error:", inquiryError.message);
  } else {
    console.log(`Total Inquiries found: ${inquiries?.length || 0}`);
    inquiries?.forEach((i) =>
      console.log(
        ` - From: ${i.name} (${i.email})\n   Message: ${i.message?.substring(0, 50)}...`,
      ),
    );
  }
}

checkConnection();
