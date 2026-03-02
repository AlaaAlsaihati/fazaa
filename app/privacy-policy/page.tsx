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
              <b className="text-[#f3e0b0]">1) أنواع البيانات التي نقوم بجمعها</b><br />
              عند إنشاء حساب في فزعة، نقوم بمعالجة البيانات التالية:
              <ul className="list-disc pr-5 mt-2 space-y-1">
                <li>البريد الإلكتروني</li>
                <li>معرف المستخدم (User ID)</li>
                <li>المقاسات التي تدخلينها داخل التطبيق</li>
                <li>سجل النتائج المرتبط بحسابك</li>
                <li>بيانات استخدام تقنية مجهولة (Usage Data)</li>
              </ul>

              <br />

              <b className="text-[#f3e0b0]">2) الغرض من المعالجة</b><br />
              نستخدم البيانات فقط لتشغيل التطبيق، حفظ تفضيلاتك، تحسين دقة الاقتراحات، وتحسين الأداء العام للخدمة.

              <br /><br />

              <b className="text-[#f3e0b0]">3) مزود الخدمة ومعالجة البيانات</b><br />
              يتم تشغيل نظام المصادقة وقاعدة البيانات عبر مزود خدمة سحابي (Supabase). قد تتم معالجة البيانات وفق سياساتهم الأمنية ومعاييرهم المعتمدة.

              <br /><br />

              <b className="text-[#f3e0b0]">4) الاحتفاظ بالبيانات (Data Retention)</b><br />
              نحتفظ ببيانات الحساب والمقاسات طالما أن الحساب نشط. يمكنك طلب حذف الحساب والبيانات في أي وقت.

              <br /><br />

              <b className="text-[#f3e0b0]">5) حقوق المستخدم</b><br />
              يحق لك:
              <ul className="list-disc pr-5 mt-2 space-y-1">
                <li>طلب الوصول إلى بياناتك</li>
                <li>طلب تصحيحها</li>
                <li>طلب حذفها بالكامل</li>
              </ul>

              <br />

              <b className="text-[#f3e0b0]">6) الروابط الخارجية والمتاجر</b><br />
              يحتوي التطبيق على روابط لمتاجر خارجية. عند الانتقال إليها، تخضعين لسياساتهم الخاصة. قد تتضمن بعض الروابط نظام إحالة (Affiliate Tracking) لقياس الأداء دون بيع بياناتك.

              <br /><br />

              <b className="text-[#f3e0b0]">7) الأمان</b><br />
              نطبق تدابير تقنية وتنظيمية معقولة لحماية البيانات، بما في ذلك التشفير أثناء النقل (HTTPS). ومع ذلك، لا يمكن ضمان أمان الإنترنت بنسبة 100%.

              <br /><br />

              <b className="text-[#f3e0b0]">8) الفئة العمرية</b><br />
              التطبيق غير موجه للأطفال دون سن 13 عامًا.

              <br /><br />

              <b className="text-[#f3e0b0]">9) نقل البيانات دوليًا</b><br />
              قد تتم معالجة البيانات عبر خوادم خارج بلد المستخدم وفقًا لمزودي الخدمة السحابية المعتمدين.

              <br /><br />

              <b className="text-[#f3e0b0]">10) التعديلات على السياسة</b><br />
              قد نقوم بتحديث هذه السياسة من وقت لآخر. استمرار استخدامك بعد التحديث يعني الموافقة على النسخة المعدلة.

              <br /><br />

              <b className="text-[#f3e0b0]">11) التواصل وحذف الحساب</b><br />
              لطلب حذف الحساب أو لأي استفسار:
              <br />
              <a
                href="mailto:contact@fazaa-app.com"
                className="text-[#f3e0b0] break-words"
              >
                contact@fazaa-app.com
              </a>
            </div>

            {/* English */}
            <div dir="ltr" className="text-left">
              <b className="text-[#f3e0b0]">1) Data We Collect</b><br />
              When creating an account, we may process:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Email address</li>
                <li>User ID</li>
                <li>Entered measurements</li>
                <li>Saved result history</li>
                <li>Anonymous usage data</li>
              </ul>

              <br />

              <b className="text-[#f3e0b0]">2) Purpose of Processing</b><br />
              Data is used solely to operate the service, store preferences, improve recommendation accuracy, and enhance performance.

              <br /><br />

              <b className="text-[#f3e0b0]">3) Service Providers</b><br />
              Authentication and database services are powered by Supabase. Data may be processed according to their security standards.

              <br /><br />

              <b className="text-[#f3e0b0]">4) Data Retention</b><br />
              Data is retained while the account remains active. Users may request deletion at any time.

              <br /><br />

              <b className="text-[#f3e0b0]">5) User Rights</b><br />
              Users may request:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Access to their data</li>
                <li>Correction</li>
                <li>Deletion</li>
              </ul>

              <br />

              <b className="text-[#f3e0b0]">6) External Store Links</b><br />
              The app includes links to third-party stores. Affiliate tracking may be used for performance measurement without selling user data.

              <br /><br />

              <b className="text-[#f3e0b0]">7) Security</b><br />
              We apply reasonable safeguards including encrypted connections (HTTPS). No system is 100% secure.

              <br /><br />

              <b className="text-[#f3e0b0]">8) Age Restriction</b><br />
              The app is not intended for children under 13.

              <br /><br />

              <b className="text-[#f3e0b0]">9) International Data Transfers</b><br />
              Data may be processed on cloud servers outside the user's country.

              <br /><br />

              <b className="text-[#f3e0b0]">10) Changes to Policy</b><br />
              Continued use after updates constitutes acceptance.

              <br /><br />

              <b className="text-[#f3e0b0]">11) Contact & Account Deletion</b><br />
              For deletion requests:
              <br />
              <a
                href="mailto:contact@fazaa-app.com"
                className="text-[#f3e0b0] break-words"
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