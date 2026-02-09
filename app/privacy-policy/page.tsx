import SiteFooter from "@/app/components/FazaaFooter";

export default function PrivacyPolicyPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white">سياسة الخصوصية</h1>
          <p className="text-neutral-400 text-sm mt-2">Privacy Policy</p>
        </header>

        <div className="rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-8 backdrop-blur text-sm leading-relaxed">
          <div className="grid grid-cols-2 gap-10 text-neutral-300">
            {/* Arabic */}
            <div>
              <b className="text-[#f3e0b0]">1) عدم جمع بيانات شخصية</b><br />
              فزعة لا تتطلب تسجيل دخول ولا تجمع بيانات تعريف شخصية مثل الاسم، رقم الهوية، أو البيانات البنكية.

              <br /><br />

              <b className="text-[#f3e0b0]">2) التحليلات المجهولة</b><br />
              قد نستخدم تحليلات مجهولة (Anonymous Analytics) لفهم الاستخدام وتحسين التجربة (مثل عدد الزيارات، الصفحات الأكثر استخدامًا) دون ربطها بهوية مستخدم محدد.

              <br /><br />

              <b className="text-[#f3e0b0]">3) عدم بيع البيانات</b><br />
              لا نقوم ببيع أو تأجير أو مشاركة بياناتك لأطراف ثالثة لأغراض تسويقية.

              <br /><br />

              <b className="text-[#f3e0b0]">4) ملفات تعريف الارتباط / التخزين المحلي</b><br />
              قد نستخدم Cookies أو Local Storage لحفظ اختياراتك مؤقتًا (مثل تفضيلاتك) وتحسين الأداء. يمكنك مسحها من إعدادات المتصفح في أي وقت.

              <br /><br />

              <b className="text-[#f3e0b0]">5) أدوات الطرف الثالث</b><br />
              إذا تم تفعيل أدوات مثل Google Analytics أو خدمات مشابهة، فقد تقوم هذه الجهات بمعالجة بيانات استخدام مجهولة وفق سياساتها. فزعة لا تتحكم بسياسات الجهات الخارجية.
              <br />
              وقد تقوم بعض الروابط (مثل روابط المتاجر/الإحالة) باستخدام معرفات تقنية لتتبع مصدر الزيارة أو الطلب — دون أن يعني ذلك بيع بياناتك أو مشاركتها للتسويق المباشر.

              <br /><br />

              <b className="text-[#f3e0b0]">6) إخلاء مسؤولية الأمان</b><br />
              نتخذ إجراءات تقنية معقولة لحماية البيانات، ومع ذلك لا يمكن ضمان أمان الإنترنت بنسبة 100% ولا نتحمل مسؤولية أي اختراق خارج عن السيطرة المعقولة.

              <br /><br />

              <b className="text-[#f3e0b0]">7) التعديلات على السياسة</b><br />
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، ويُعد استمرار استخدامك للخدمة بعد التحديث موافقة عليها.

              <br /><br />

              <b className="text-[#f3e0b0]">8) التواصل</b><br />
              لأي استفسار بخصوص الخصوصية:{" "}
              <a
  href="mailto:contact@fazaa-app.com"
  className="text-[#f3e0b0] break-words"
  style={{
    overflowWrap: "anywhere",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
  contact@fazaa-app.com
</a>
            </div>

            {/* English */}
            <div dir="ltr" className="text-left">
              <b className="text-[#f3e0b0]">1) No Personal Data Collection</b><br />
              Fazaa does not require login and does not collect personally identifying information such as name, national ID, or banking details.

              <br /><br />

              <b className="text-[#f3e0b0]">2) Anonymous Analytics Only</b><br />
              We may use anonymous analytics to understand usage and improve the experience (e.g., visits and feature usage) without linking data to an identifiable person.

              <br /><br />

              <b className="text-[#f3e0b0]">3) No Selling of Data</b><br />
              We do not sell, rent, or share your data for marketing purposes.

              <br /><br />

              <b className="text-[#f3e0b0]">4) Cookies / Local Storage</b><br />
              We may use cookies or local storage to remember selections and improve performance. You can clear them via your browser settings anytime.

              <br /><br />

              <b className="text-[#f3e0b0]">5) Third-Party Tools</b><br />
              If tools like Google Analytics are enabled, such providers may process anonymous usage data under their own policies. Fazaa does not control third-party policies.
              <br />
              Some links (e.g., store/affiliate links) may use technical identifiers to attribute visits or purchases—this does not mean we sell your data or share it for direct marketing.

              <br /><br />

              <b className="text-[#f3e0b0]">6) Security Disclaimer</b><br />
              We use reasonable safeguards, but no online system is 100% secure. We are not liable for breaches beyond reasonable control.

              <br /><br />

              <b className="text-[#f3e0b0]">7) Changes to Policy</b><br />
              We may update this policy from time to time. Continued use after updates constitutes acceptance.

              <br /><br />

              <b className="text-[#f3e0b0]">8) Contact</b><br />
              Privacy inquiries:{" "}
            <a
  href="mailto:contact@fazaa-app.com"
  className="text-[#f3e0b0] break-words"
  style={{
    overflowWrap: "anywhere",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
  contact@fazaa-app.com
</a>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}