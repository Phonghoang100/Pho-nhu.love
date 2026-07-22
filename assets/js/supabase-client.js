/* ============================================================
   Supabase client bootstrap.
   Loads the official ESM client from a CDN and exposes:
     window.sb        -> the Supabase client (or null if unconfigured)
     window.sbReady   -> Promise that resolves once ready
     window.sbConfigured() -> boolean
   ============================================================ */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.WEDDING || {};
const configured =
  cfg.supabaseUrl &&
  cfg.supabaseAnonKey &&
  !cfg.supabaseUrl.includes("YOUR-PROJECT") &&
  !cfg.supabaseAnonKey.includes("YOUR-ANON");

window.sbConfigured = () => !!configured;
window.sb = configured
  ? createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

// Signal readiness so page scripts can proceed.
window.__sbReady = true;
window.dispatchEvent(new Event("sb:ready"));
