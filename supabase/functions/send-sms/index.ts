// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Declare Deno to prevent IDE "Cannot find name 'Deno'" errors
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, message } = await req.json()
    console.log("Attempting to send WhatsApp to:", phoneNumber);

    const ULTRAMSG_INSTANCE_ID = Deno.env.get('ULTRAMSG_INSTANCE_ID') || '';
    const ULTRAMSG_TOKEN = Deno.env.get('ULTRAMSG_TOKEN') || '';

    // Safety check
    if (!ULTRAMSG_INSTANCE_ID || !ULTRAMSG_TOKEN) {
      throw new Error("Missing UltraMsg Secrets in Supabase!");
    }

    const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`

    const body = new URLSearchParams({
      token: ULTRAMSG_TOKEN,
      to: phoneNumber,
      body: message,
    })

    const ultraRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const data = await ultraRes.json()

    // UltraMsg returns error property if something goes wrong
    if (data.error) {
      console.error("UltraMsg API rejected the request. Details:", data);
      throw new Error(`UltraMsg Error: ${data.error}`)
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Edge Function Exception:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})