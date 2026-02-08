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
        </header>

        <div className="rounded-3xl border border-[#d6b56a]/35 bg-white/5 p-6 sm:p-8 backdrop-blur">
          {/* ✅ عامودين دائمًا + مسافة آمنة + منع التداخل */}
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 text-neutral-300">
            {/* Arabic (Right) */}
            <div
              dir="rtl"
              className="min-w-0 text-right leading-6 text-[11.5px] sm:text-sm break-words"
            >
              <b className="text-[#f3e0b0]">1) طبيعة الخدمة</b>
              <br />
              فزعة منصة توصيات تساعدك على اختيار الإطلالة الأنسب (مناسبة/ألوان/مقاسات)
              وتقديم روابط لمنتجات من متاجر خارجية. فزعة ليست متجرًا ولا تبيع المنتجات مباشرة.
              <br />
              <br />

              <b className="text-[#f3e0b0]">2) إخلاء المسؤولية </b>
              <br />
              تُقدَّم الخدمة “كما هي” و“حسب التوفر” دون أي ضمانات صريحة أو ضمنية. لا تتحمل
              فزعة أي مسؤولية عن أي خسائر أو أضرار مباشرة أو غير مباشرة أو تبعية ناتجة عن
              استخدام الخدمة أو الاعتماد على نتائجها.
              <br />
              <br />

              <b className="text-[#f3e0b0]">3) إخلاء الدقة </b>
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

              <b className="text-[#f3e0b0]">5) مسؤولية المستخدم</b>
              <br />
              أنت مسؤول عن دقة البيانات التي تُدخلها (الطول/المحيطات/تفضيلات الألوان).
              أي نتائج تعتمد على صحة هذه البيانات. يُمنع استخدام الخدمة لأي غرض غير مشروع.
              <br />
              <br />

              <b className="text-[#f3e0b0]">6) الملكية الفكرية</b>
              <br />
              جميع المحتويات، النصوص، التصاميم، الشعارات، والأيقونات والواجهة وتجربة
              الاستخدام هي ملك لفزعة أو مرخّصة لها. يمنع النسخ أو إعادة النشر أو الاستخدام
              التجاري دون إذن مكتوب.
              <br />
              <br />

              <b className="text-[#f3e0b0]">7) الاستخدام المحظور</b>
              <br />
              يُحظر: محاولة اختراق المنصة، استخراج البيانات آليًا، تعطيل الخدمة، التحايل
              على الروابط، إساءة الاستخدام، أو انتهاك أي أنظمة أو حقوق ملكية.
              <br />
              <br />

              <b className="text-[#f3e0b0]">8) التعديلات على الخدمة</b>
              <br />
              يحق لفزعة تعديل أو تحديث أو إيقاف أي جزء من الخدمة أو إضافة مزايا جديدة في
              أي وقت دون إشعار مسبق.
              <br />
              <br />

              <b className="text-[#f3e0b0]">9) حق الإنهاء</b>
              <br />
              يحق لفزعة تقييد أو إيقاف وصولك للخدمة مؤقتًا أو دائمًا عند الاشتباه بسوء
              استخدام أو خرق الشروط.
              <br />
              <br />

              <b className="text-[#f3e0b0]">10) القانون الواجب التطبيق</b>
              <br />
              تخضع هذه الشروط لأنظمة ولوائح المملكة العربية السعودية، ويختص القضاء السعودي
              بالنظر في أي نزاع.
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

              <b className="text-[#f3e0b0]">13) التواصل</b>
              <br />
              للاستفسارات أو البلاغات:{" "}
              <span className="text-[#f3e0b0] whitespace-nowrap overflow-hidden text-ellipsis block">
  contact@fazaa-app.com
</span>
            </div>

            {/* English (Left) */}
            <div
              dir="ltr"
              className="min-w-0 text-left leading-6 text-[11.5px] sm:text-sm break-words"
            >
              <b className="text-[#f3e0b0]">1) Nature of Service</b>
              <br />
              Fazaa is a recommendation platform that helps users choose outfits
              (occasion/colors/measurements) and provides links to external stores.
              Fazaa is not a seller and does not sell products directly.
              <br />
              <br />

              <b className="text-[#f3e0b0]">2) No Liability</b>
              <br />
              The service is provided “as is” and “as available” without warranties
              of any kind. Fazaa shall not be liable for any direct, indirect,
              incidental, consequential, or special damages arising from using the
              service or relying on its output.
              <br />
              <br />

              <b className="text-[#f3e0b0]">3) Accuracy Disclaimer</b>
              <br />
              Recommendations and suggested sizes are indicative only and may vary
              across brands, cuts, materials, and store size charts. You are
              responsible for verifying sizing and product details before purchasing.
              <br />
              <br />

              <b className="text-[#f3e0b0]">4) External Stores Responsibility</b>
              <br />
              Purchases, payments, shipping, returns, and refunds are handled solely
              by external stores under their policies. Fazaa is not responsible for
              pricing, availability, promotions, quality, or delivery services.
              <br />
              <br />

              <b className="text-[#f3e0b0]">5) User Responsibility</b>
              <br />
              You are responsible for the accuracy of information you provide
              (height/measurements/preferences). The output depends on such inputs.
              Illegal or unauthorized use is prohibited.
              <br />
              <br />

              <b className="text-[#f3e0b0]">6) Intellectual Property</b>
              <br />
              All content, designs, logos, icons, UI/UX and materials are owned by or
              licensed to Fazaa. No copying, distribution, or commercial use without
              written permission.
              <br />
              <br />

              <b className="text-[#f3e0b0]">7) Prohibited Use</b>
              <br />
              You must not attempt to hack, scrape, disrupt, bypass links, abuse the
              platform, or violate any applicable laws or third-party rights.
              <br />
              <br />

              <b className="text-[#f3e0b0]">8) Modifications to Service</b>
              <br />
              Fazaa may change, update, suspend, or discontinue any part of the
              service at any time without prior notice.
              <br />
              <br />

              <b className="text-[#f3e0b0]">9) Termination Rights</b>
              <br />
              Fazaa may restrict or terminate access if misuse or breach of these
              terms is suspected.
              <br />
              <br />

              <b className="text-[#f3e0b0]">10) Governing Law</b>
              <br />
              These terms are governed by the laws of the Kingdom of Saudi Arabia.
              Saudi courts shall have jurisdiction over disputes.
              <br />
              <br />

              <b className="text-[#f3e0b0]">11) Affiliate Disclosure</b>
              <br />
              Fazaa may include affiliate/referral links to certain stores. We may
              earn a commission or benefit if you purchase via these links at no
              additional cost to you. This does not change how you use the service
              and does not affect pricing except as determined by the store.
              <br />
              <br />

              <b className="text-[#f3e0b0]">12) Measurements &amp; Fit Disclaimer</b>
              <br />
              Inputs and resulting recommendations are for guidance only and do not
              guarantee fit or outcomes. Fit may vary based on fabric, stretch, cut,
              and tailoring. Please review the store’s size chart before purchasing.
              <br />
              <br />

              <b className="text-[#f3e0b0]">13) Contact</b>
              <br />
              For inquiries or notices:{" "}
              <span className="text-[#f3e0b0] whitespace-nowrap overflow-hidden text-ellipsis block">
  contact@fazaa-app.com
</span>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}