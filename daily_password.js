const { createClient } = require('@supabase/supabase-js');

// بيانات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = "https://cogyqvqpcddamugirkqd.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('خطأ: مفتاح SUPABASE_SERVICE_KEY غير موجود في المتغيرات البيئية.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generateDailyPassword() {
  // 1. توليد كود عشوائي من 6 أرقام وتحديد تاريخ اليوم
  const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
  const today = new Date().toISOString().split('T')[0];

  // 2. حفظ كلمة السر اليومية في جدول daily_passwords
  const { error } = await supabase
    .from('daily_passwords')
    .upsert({ date: today, password: randomPassword }, { onConflict: 'date' });

  if (error) {
    console.error('خطأ في حفظ كلمة السر في قاعدة البيانات:', error.message);
    process.exit(1);
  }

  console.log(`تم توليد وحفظ كلمة السر بنجاح ليوم (${today}): ${randomPassword}`);
}

generateDailyPassword();
