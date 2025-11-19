import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = "8409518926:AAEDOgwRULgzbo-s2odJpYr6iAWsmMcSaBo";
const TELEGRAM_CHAT_ID = "7522972071";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, amount, userId, serviceType } = await req.json();

    const serviceTypeArabic: Record<string, string> = {
      'members': '👥 أعضاء',
      'engagement': '💬 تفاعل',
      'views': '👁️ مشاهدات',
      'likes': '❤️ إعجابات'
    };

    const message = `
╔══════════════════════╗
   🆕 طلب رشق جديد
╚══════════════════════╝

👤 اسم المستخدم: ${username}
🆔 معرف المستخدم: ${userId}

📦 نوع الخدمة: ${serviceTypeArabic[serviceType] || serviceType}
🔢 الكمية المطلوبة: ${amount.toLocaleString('ar')}

⏰ وقت الطلب: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}

━━━━━━━━━━━━━━━━━━━━
@O_D_E_0
    `;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const result = await telegramResponse.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      throw new Error('Failed to send Telegram message');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
