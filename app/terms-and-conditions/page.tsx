import SiteFooter from "@/app/components/FazaaFooter";

export default function TermsPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black px-6 py-10"
    >
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white">الشروط والأحكام</h1>
          <p className="text-neutral-400 text-sm mt-2">Terms &amp; Conditions</p>
          <p className="text-neutral-500 text-xs mt-2">آخر تحديث: 2026-03-02</p>
        </header>

        <div className="rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 sm:p-8 backdrop-blur">
          {/* ✅ عامودين دائمًا + مسافة آمنة + منع التداخل */}
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 text-neutral-300">
            {/* Arabic (Right) */}
            <div
              dir="rtl"
              className="min-w-0 text-right leading-6 text-[11.5px] sm:text-sm break-words"
            >
              <b className="text-[#f3e0b0]">مقدمة</b>
              <br />
              باستخدامك لمنصة فزعة (“الخدمة”) فإنك توافق/ين على هذه الشروط. إذا لا توافق/ين،
              الرجاء عدم استخدام الخدمة.
              <br />
              كما تُعد سياسة الخصوصية جزءًا من هذه الشروط:
              {" "}
              <a href="/privacy-policy" className="text-[#f3e0b0] underline underline-offset-4">
                سياسة الخصوصية
              </a>
              .
              <br />
              <br />

              <b className="text-[#f3e0b0]">1) طبيعة الخدمة</b>
              <br />
              فزعة منصة توصيات تساعدك على اختيار الإطلالة الأنسب (مناسبة/ألوان/مقاسات)
              وتقديم روابط لمنتجات من متاجر خارجية. فزعة ليست متجرًا ولا تبيع المنتجات مباشرة.
              <br />
              <br />

              <b className="text-[#f3e0b0]">2) إخلاء المسؤولية</b>
              <br />
              تُقدَّم الخدمة “كما هي” و“حسب التوفر” دون أي ضمانات صريحة أو ضمنية.
              <br />
              <br />

              <b className="text-[#f3e0b0]">3) إخلاء الدقة</b>
              <br />
              التوصيات والمقاسات المقترحة إرشادية وقد تختلف بحسب اختلاف القصّات، جداول
              المقاسات، الخامات، وتحديثات المتاجر. أنت المسؤول عن التحقق من المقاسات
              والمواصفات قبل الشراء.
              <br />
              <br />

              <b className="text-[#f3e0b0]">4) مسؤولية المتاجر الخارجية</b>
              <br />
              أي عملية شراء، دفع، شحن، استبدال، أو استرجاع تتم عبر المتجر الخارجي وفق
              سياساته. فزعة غير مسؤولة عن الأسعار، التوفر، العروض، أو جودة المنتجات أو
              خدمات التوصيل.
              <br />
              <br />

              <b className="text-[#f3e0b0]">5) الحساب والتسجيل</b>
              <br />
              قد تتطلب بعض ميزات فزعة إنشاء حساب (مثل حفظ المقاسات وسجل النتائج). أنت مسؤول
              عن الحفاظ على سرية بيانات الدخول، وأي نشاط يتم عبر حسابك.
              <br />
              <br />

              <b className="text-[#f3e0b0]">6) مسؤولية المستخدم</b>
              <br />
              أنت مسؤول عن دقة البيانات التي تُدخلها (الطول/المحيطات/تفضيلات الألوان).
              أي نتائج تعتمد على صحة هذه البيانات. يُمنع استخدام الخدمة لأي غرض غير مشروع.
              <br />
              <br />

              <b className="text-[#f3e0b0]">7) الملكية الفكرية</b>
              <br />
              جميع المحتويات، النصوص، التصاميم، الشعارات، والأيقونات والواجهة وتجربة
              الاستخدام هي ملك لفزعة أو مرخّصة لها. يمنع النسخ أو إعادة النشر أو الاستخدام
              التجاري دون إذن مكتوب.
              <br />
              <br />

              <b className="text-[#f3e0b0]">8) الاستخدام المحظور</b>
              <br />
              يُحظر: محاولة اختراق المنصة، استخراج البيانات آليًا، تعطيل الخدمة، التحايل
              على الروابط، إساءة الاستخدام، أو انتهاك أي أنظمة أو حقوق ملكية.
              <br />
              <br />

              <b className="text-[#f3e0b0]">9) التعديلات على الخدمة</b>
              <br />
              يحق لفزعة تعديل أو تحديث أو إيقاف أي جزء من الخدمة أو إضافة مزايا جديدة في
              أي وقت دون إشعار مسبق.
              <br />
              <br />

              <b className="text-[#f3e0b0]">10) حق الإنهاء</b>
              <br />
              يحق لفزعة تقييد أو إيقاف وصولك للخدمة مؤقتًا أو دائمًا عند الاشتباه بسوء
              استخدام أو خرق الشروط.
              <br />
              <br />

              <b className="text-[#f3e0b0]">11) الإفصاح عن الروابط التسويقية (Affiliate Disclosure)</b>
              <br />
              قد تتضمن فزعة روابط إحالة/روابط تسويقية لبعض المتاجر. قد نحصل على عمولة أو
              منفعة عند قيامك بعملية شراء عبر هذه الروابط دون أي تكلفة إضافية عليك. هذا لا
              يؤثر على طريقة استخدامك للخدمة أو على السعر إلا وفق ما يحدده المتجر.
              <br />
              <br />

              <b className="text-[#f3e0b0]">12) تنبيه القياسات والملاءمة (Measurements Disclaimer)</b>
              <br />
              القياسات المدخلة والتوصيات الناتجة تُستخدم لأغراض إرشادية فقط ولا تُعد ضمانًا
              لملاءمة المقاس أو النتيجة النهائية. قد تختلف الملاءمة حسب نوع القماش،
              المرونة، القصّة، وطريقة التفصيل. ننصح بمراجعة جدول المقاسات الخاص بالمتجر قبل الشراء.
              <br />
              <br />

              <b className="text-[#f3e0b0]">13) حدود المسؤولية (Limitation of Liability)</b>
              <br />
              إلى الحد الأقصى المسموح به نظامًا: لا تتحمل فزعة المسؤولية عن أي أضرار مباشرة
              أو غير مباشرة أو تبعية (مثل خسارة الأرباح أو البيانات أو فرص الشراء) الناتجة عن
              استخدام الخدمة أو الروابط الخارجية أو الاعتماد على التوصيات.
              <br />
              <br />

              <b className="text-[#f3e0b0]">14) الفئة العمرية</b>
              <br />
              الخدمة غير موجهة للأطفال دون سن 13 عامًا.
              <br />
              <br />

              <b className="text-[#f3e0b0]">15) التعديلات على الشروط</b>
              <br />
              قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرار استخدامك للخدمة بعد التحديث
              يعني موافقتك على النسخة المعدلة.
              <br />
              <br />

              <b className="text-[#f3e0b0]">16) حذف الحساب</b>
              <br />
              يمكنك طلب حذف حسابك وبياناتك عبر التواصل على البريد أدناه.
              <br />
              <br />

              <b className="text-[#f3e0b0]">17) القانون الواجب التطبيق</b>
              <br />
              تخضع هذه الشروط لأنظمة ولوائح المملكة العربية السعودية، ويختص القضاء السعودي
              بالنظر في أي نزاع.
              <br />
              <br />

              <b className="text-[#f3e0b0]">18) التواصل</b>
              <br />
              للاستفسارات أو البلاغات:
              {" "}
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

            {/* English (Left) */}
            <div
              dir="ltr"
              className="min-w-0 text-left leading-6 text-[11.5px] sm:text-sm break-words"
            >
              <b className="text-[#f3e0b0]">Introduction</b>
              <br />
              By using Fazaa (the “Service”), you agree to these Terms. If you do not agree,
              please do not use the Service.
              <br />
              Our Privacy Policy forms part of these Terms:
              {" "}
              <a href="/privacy-policy" className="text-[#f3e0b0] underline underline-offset-4">
                Privacy Policy
              </a>
              .
              <br />
              <br />

              <b className="text-[#f3e0b0]">1) Nature of Service</b>
              <br />
              Fazaa is a recommendation platform that helps users choose outfits
              (occasion/colors/measurements) and provides links to external stores.
              Fazaa is not a seller and does not sell products directly.
              <br />
              <br />

              <b className="text-[#f3e0b0]">2) No Warranty</b>
              <br />
              The Service is provided “as is” and “as available” without warranties of any kind.
              <br />
              <br />

              <b className="text-[#f3e0b0]">3) Accuracy Disclaimer</b>
              <br />
              Recommendations and suggested sizes are indicative only and may vary
              across brands, cuts, materials, and store size charts. You are responsible
              for verifying sizing and product details before purchasing.
              <br />
              <br />

              <b className="text-[#f3e0b0]">4) External Stores Responsibility</b>
              <br />
              Purchases, payments, shipping, returns, and refunds are handled solely
              by external stores under their policies. Fazaa is not responsible for
              pricing, availability, promotions, quality, or delivery services.
              <br />
              <br />

              <b className="text-[#f3e0b0]">5) Accounts</b>
              <br />
              Some features may require an account (e.g., saving measurements and history).
              You are responsible for maintaining confidentiality and all activity under your account.
              <br />
              <br />

              <b className="text-[#f3e0b0]">6) User Responsibility</b>
              <br />
              You are responsible for the accuracy of information you provide
              (height/measurements/preferences). Illegal or unauthorized use is prohibited.
              <br />
              <br />

              <b className="text-[#f3e0b0]">7) Intellectual Property</b>
              <br />
              All content, designs, logos, icons, UI/UX and materials are owned by or
              licensed to Fazaa. No copying, distribution, or commercial use without written permission.
              <br />
              <br />

              <b className="text-[#f3e0b0]">8) Prohibited Use</b>
              <br />
              You must not attempt to hack, scrape, disrupt, bypass links, abuse the platform,
              or violate applicable laws or third-party rights.
              <br />
              <br />

              <b className="text-[#f3e0b0]">9) Modifications to Service</b>
              <br />
              Fazaa may change, update, suspend, or discontinue any part of the Service at any time.
              <br />
              <br />

              <b className="text-[#f3e0b0]">10) Termination Rights</b>
              <br />
              Fazaa may restrict or terminate access if misuse or breach of these Terms is suspected.
              <br />
              <br />

              <b className="text-[#f3e0b0]">11) Affiliate Disclosure</b>
              <br />
              Fazaa may include affiliate/referral links to certain stores. We may earn a commission
              or benefit if you purchase via these links at no additional cost to you.
              <br />
              <br />

              <b className="text-[#f3e0b0]">12) Measurements &amp; Fit Disclaimer</b>
              <br />
              Inputs and resulting recommendations are for guidance only and do not guarantee fit or outcomes.
              Fit may vary based on fabric, stretch, cut, and tailoring. Please review the store’s size chart.
              <br />
              <br />

              <b className="text-[#f3e0b0]">13) Limitation of Liability</b>
              <br />
              To the maximum extent permitted by law, Fazaa is not liable for any indirect, incidental,
              consequential, or special damages (including loss of profits, data, or opportunities) arising
              from use of the Service, external links, or reliance on recommendations.
              <br />
              <br />

              <b className="text-[#f3e0b0]">14) Age Restriction</b>
              <br />
              The Service is not intended for children under 13.
              <br />
              <br />

              <b className="text-[#f3e0b0]">15) Changes to Terms</b>
              <br />
              We may update these Terms from time to time. Continued use after updates constitutes acceptance.
              <br />
              <br />

              <b className="text-[#f3e0b0]">16) Account Deletion</b>
              <br />
              Users may request account and data deletion via the email below.
              <br />
              <br />

              <b className="text-[#f3e0b0]">17) Governing Law</b>
              <br />
              These Terms are governed by the laws of the Kingdom of Saudi Arabia. Saudi courts have jurisdiction.
              <br />
              <br />

              <b className="text-[#f3e0b0]">18) Contact</b>
              <br />
              For inquiries or notices:
              {" "}
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