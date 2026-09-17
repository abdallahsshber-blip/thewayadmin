const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// بيانات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = "https://cogyqvqpcddamugirkqd.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const MY_PHONE = "201201955805";

async function generateAndSendPassword() {
  // 1. توليد كود عشوائي من 6 أرقام وتحديد تاريخ اليوم
  const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
  const today = new Date().toISOString().split('T')[0];

  // 2. حفظ كلمة السر اليومية في جدول daily_passwords
  const { error } = await supabase
    .from('daily_passwords')
    .upsert({ date: today, password: randomPassword }, { onConflict: 'date' });

  if (error) {
    console.error('خطأ في حفظ كلمة السر:', error.message);
    process.exit(1);
  }

  // 3. تجهيز نص الرسالة
  const messageText = `🔑 كلمة السر اليومية للوحة مشرف The Way ليوم (${today}):\n\n*${randomPassword}*\n\nيرجى مشاركتها مع السائق فقط.`;

  // 4. إرسال الرسالة إلى رقم الواتساب عبر الـ API
  try {
    await axios.post(process.env.WHATSAPP_API_URL, {
      phone: MY_PHONE,
      message: messageText
    });
    console.log('تم توليد كلمة السر وإرسالها بنجاح.');
  } catch (err) {
    console.error('خطأ في إرسال رسالة الواتساب:', err.message);
  }
}

generateAndSendPassword();
