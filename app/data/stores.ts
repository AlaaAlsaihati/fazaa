// app/data/stores.ts

export type StoreDeal = {
  /** الاسم اللي يظهر عندك في products.ts داخل p.store */
  name: string;

  /** أسماء ثانية ممكن تجي في p.store */
  aliases?: string[];

  /** دومينات المتجر */
  domains?: string[];

  /** كود الخصم */
  discountCode?: string;

  /** نص يظهر للمستخدم */
  discountLabel?: string;

  /**
   * رابط أفلييت (اختياري)
   * مثال:
   * affiliateBaseUrl: "https://track.example.com/?redirect={url}"
   */
  affiliateBaseUrl?: string;
};

const STORES: StoreDeal[] = [
  {
    name: "Barllina",
    aliases: ["barllina", "بارلينا", "برلينا"],
    domains: ["barllina.com"],
    discountCode: "FAZAA20",
    discountLabel: "خصم 20%",
  },
  {
    name: "Jolina",
    aliases: ["jolina", "jolina fashion", "جولينا"],
    domains: ["jolinafashion.com"],
    discountCode: "FAZAA20",
    discountLabel: "خصم 20%",
  },
];

function norm(s: string) {
  return (s || "").trim().toLowerCase();
}

function hostFromUrl(url?: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    return norm(u.hostname.replace(/^www\./, ""));
  } catch {
    return "";
  }
}

/** ✅ وصول مباشر بالاسم */
export const STORE_MAP: Record<string, StoreDeal> = Object.fromEntries(
  STORES.map((s) => [s.name, s])
);

/**
 * ✅ مطابقة ذكية:
 * - اسم المتجر
 * - أو دومين رابط المنتج
 */
export function findStore(
  storeName?: string,
  productUrl?: string
): StoreDeal | undefined {
  const n = norm(storeName || "");
  const host = hostFromUrl(productUrl);

  return STORES.find((s) => {
    const aliases = (s.aliases || []).map(norm);
    const domains = (s.domains || []).map((d) => norm(d));

    const matchName =
      !!n && (norm(s.name) === n || aliases.includes(n));

    const matchDomain =
      !!host && domains.some((d) => host === d || host.endsWith(`.${d}`));

    return matchName || matchDomain;
  });
}

/** ✅ يبني رابط الأفلييت لو موجود */
export function buildFinalUrl(productUrl: string, deal?: StoreDeal) {
  if (!deal?.affiliateBaseUrl) return productUrl;

  if (deal.affiliateBaseUrl.includes("{url}")) {
    return deal.affiliateBaseUrl.replace(
      "{url}",
      encodeURIComponent(productUrl)
    );
  }

  return deal.affiliateBaseUrl;
}