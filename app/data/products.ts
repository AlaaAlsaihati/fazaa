// app/data/products.ts

export type Occasion =
  | "wedding"
  | "engagement"
  | "work"
  | "abaya"
  | "ramadan"
  | "beach"
  | "chalets";

export type WeddingStyle = "" | "ناعم" | "ثقيل";

export type SkinDepth =
  | "فاتح جدًا"
  | "فاتح"
  | "حنطي فاتح"
  | "حنطي"
  | "حنطي غامق"
  | "أسمر"
  | "داكن";

export type Undertone = "دافئ" | "بارد" | "محايد" | "زيتوني";

// ✅ أشكال الجسم (عربي)
export type BodyShapeArabic = "تفاحة" | "كمثري" | "مستقيم" | "ساعة رملية";

// ✅ مقاسات العبايات (50 → 60)
export type AbayaSize = 50 | 52 | 54 | 56 | 58 | 60;

export type ProductCategory = "dress" | "abaya" | "jalabiya";

export type Product = {
  id: string;
  title: string;
  store: string;
  url: string;
  image: string;
  priceSar: number;

  occasion: Occasion;
  weddingStyle?: WeddingStyle;

  bestFor?: {
    depth: SkinDepth[];
    undertone: Undertone[];
  };

  tags?: string[];

  category?: ProductCategory;

  // ✅ للعبايات فقط
  abayaSizes?: AbayaSize[];
  abayaSizeChart?: {
    size: AbayaSize;
    height: [number, number];
  }[];

  // ✅ شكل الجسم المناسب للعباية (لا نحدده بدون مشاهدة)
  abayaBestForShapes?: BodyShapeArabic[];

  // (اختياري لغير العبايات)
  sizeChart?: {
    label: string;
    bust?: [number, number];
    waist?: [number, number];
    hip?: [number, number];
  }[];
};

// ✅ جدول طولي افتراضي للعبايات (Typing مضبوط)
export const DEFAULT_ABAYA_HEIGHT_CHART: {
  size: AbayaSize;
  height: [number, number];
}[] = [
  { size: 50, height: [145, 152] },
  { size: 52, height: [153, 158] },
  { size: 54, height: [159, 164] },
  { size: 56, height: [165, 170] },
  { size: 58, height: [171, 176] },
  { size: 60, height: [177, 185] },
];

export const products: Product[] = [
  // =========================
  // Barllina
  // =========================
  {
    id: "bar-001",
    title: "Off Shoulder Lace Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Off-the-shoulder-lace-dress194280",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/10d517cb-f682-4495-a00b-c7fd56dfb700.jpg",
    priceSar: 189,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي"], undertone: ["محايد", "بارد"] },
    tags: ["دانتيل", "أوف شولدر", "ناعم"],
  },
  {
    id: "bar-002",
    title: "Tiffany Midi Dress with Crystal Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/Tiffany-midi-dress-with-crystal-embroidery194257",
    image:"https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/072134b5-a4ab-4b3b-821f-146d9fa06a65.jpg",
    priceSar: 275,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي"], undertone: ["بارد", "محايد"] },
    tags: ["تيفاني", "كريستال", "ميدي"],
  },
  {
    id: "bar-003",
    title: "Beige Off Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Beige-off-shoulder-dress-with-delicate-embroidery193972",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/f385ca23-1171-4718-bcf1-4878dee62cb4.jpg",
    priceSar: 286,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي"], undertone: ["دافئ", "محايد"] },
    tags: ["بيج", "أوف شولدر", "ناعم"],
  },
  {
    id: "bar-004",
    title: "Black Velvet Off Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Black-Velvet-Off-Shoulder-Dress19748",
    image:"https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/23c7caee-1e33-4903-aaf0-bb43891a9e60.jpg",
    priceSar: 289,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي", "أسمر", "داكن"], undertone: ["محايد", "بارد"] },
    tags: ["مخمل", "أسود", "فخم"],
  },
  {
    id: "bar-005",
    title: "Off White Beaded Midi Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Off-White-midi-dress-with-corset-design18774",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/adcf6eb6-cad1-4ca9-a75d-d8aeafa86e23.jpg",
    priceSar: 299,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: {
      depth: ["فاتح", "حنطي فاتح", "حنطي"],
      undertone: ["محايد", "بارد"],
    },
    tags: ["أوف وايت", "خرز", "ميدي"],
  },
  {
    id: "bar-006",
    title: "Dark Royal Navy Dress with Beaded Shoulders",
    store: "Barllina",
    url: "https://barllina.com/products/Dark-royal-navy-dress-with-beaded-shoulders193307",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/c863b4db-68fd-4e1c-a52d-ff25a3fc3343.jpg",
    priceSar: 379,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["بارد", "محايد"] },
    tags: ["كحلي", "قصير", "مخمل"],
  },
  {
    id: "bar-007",
    title: "Burgundy Off Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Burgundy-off-shoulder-dress-with-tiered-layers193697",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/cf017b0c-2718-4eb1-ad25-8ab19d252bd6.jpg",
    priceSar: 199,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["دافئ", "محايد"] },
    tags: ["عنابي", "أوف شولدر", "ستايل"],
  },
  {
    id: "bar-008",
    title: "Navy Embroidered Evening Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Navy-blue-embroidered-dress-with-shiny-touches-and-a-side-slit191806",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/3780c868-78f9-44d7-b6be-182c38fd809c.jpg",
    priceSar: 389,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي", "أسمر", "داكن"], undertone: ["بارد", "محايد"] },
    tags: ["كحلي", "ترتر", "سهرة"],
  },
  {
    id: "bar-009",
    title: "Brown Lace Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Brown-lace-dress-with-wide-sleeved-cuffs192825",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/6be7c010-7ed1-4845-a8c9-611900f27c67.jpg",
    priceSar: 310,
    occasion: "engagement",
    category: "dress",
    bestFor: {
      depth: ["حنطي", "أسمر", "داكن"],
      undertone: ["دافئ", "محايد", "زيتوني"],
    },
    tags: ["بني", "دانتيل", "أوف شولدر"],
  },
  {
    id: "bar-010",
    title: "Dark Purple Embroidered Maxi Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Elegant-long-dark-purple-dress-with-embroidery-and-sequins193348",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/d99bbc96-250a-4273-9105-4164cd205274.jpg",
    priceSar: 375,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["بارد", "محايد"] },
    tags: ["موف", "ماكسي", "ناعم"],
  },

  // ===== Barllina - Remaining batch (unique) =====
  {
    id: "bar-108",
    title: "Soft Pink Lace Mermaid Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Soft-pink-lace-mermaid-dress193174",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/3bf49d48-5946-4ae2-9ad3-0f8cc960459f.jpg",
    priceSar: 360,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: {
      depth: ["فاتح جدًا", "فاتح", "حنطي فاتح"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["وردي", "دانتيل", "ميرميد", "ناعم"],
  },
  {
    id: "bar-109",
    title: "Burgundy Formal Suit with Long Jacket",
    store: "Barllina",
    url: "https://barllina.com/products/Burgundy-formal-suit-with-long-jacket60059",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/90bfc062-e105-4b3d-88e0-69901ac9ed66.jpg",
    priceSar: 249,
    occasion: "work",
    category: "dress",
    bestFor: {
      depth: ["حنطي فاتح", "حنطي", "أسمر", "داكن"],
      undertone: ["دافئ", "محايد"],
    },
    tags: ["بدلة", "خمري", "رسمي", "عمل"],
  },
  {
    id: "bar-110",
    title: "Lime Green Off-Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Lime-green-off-shoulder-dress192736",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/bb6fd792-33b1-4a6c-9fd0-9472b4d5ccc9.jpg",
    priceSar: 112,
    occasion: "engagement",
    category: "dress",
    bestFor: {
      depth: ["فاتح", "حنطي فاتح", "حنطي"],
      undertone: ["دافئ", "زيتوني"],
    },
    tags: ["لايم", "كتف مكشوف", "جرأة", "ستايل"],
  },
  {
    id: "bar-111",
    title: "Soft Long Dress with Watercolor Patterns",
    store: "Barllina",
    url: "https://barllina.com/products/Soft-long-dress-with-watercolor-patterns192738",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/c483db6f-2e4c-4bd7-990b-04f3bf5213b7.jpg",
    priceSar: 111,
    occasion: "chalets",
    category: "dress",
    bestFor: {
      depth: ["فاتح", "حنطي فاتح", "حنطي", "أسمر"],
      undertone: ["محايد", "دافئ"],
    },
    tags: ["ألوان مائية", "ناعم", "كاجوال شيك", "شاليهات"],
  },

  // ===== Abayas (Occasion: abaya فقط) =====
{
  id: "bar-112",
  title: "Elegant Black Abaya with Purple Details",
  store: "Barllina",
  url: "https://barllina.com/products/Elegant-black-abaya-with-purple-details50193",
  image:
    "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/bccdb5db-700e-4ef2-a193-85edc64f2fc7.jpg",
  priceSar: 149,
  occasion: "abaya",
  category: "abaya",
  abayaSizes: [50, 52, 54, 56, 58, 60],
  abayaSizeChart: DEFAULT_ABAYA_HEIGHT_CHART,

  // ✅ Body Shape Labels
  abayaBestForShapes: ["كمثري", "ساعة رملية"],

  bestFor: {
    depth: ["فاتح جدًا", "فاتح", "حنطي فاتح", "حنطي", "أسمر", "داكن"],
    undertone: ["بارد", "دافئ", "محايد", "زيتوني"],
  },
  tags: ["عباية", "أسود", "تفاصيل بنفسجي", "فخم"],
},
{
  id: "bar-113",
  title: "Black Abaya with Pink Embroidery Sleeves",
  store: "Barllina",
  url: "https://barllina.com/products/Black-abaya-with-sleeves-decorated-with-pink-embroidery50186",
  image:
    "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/8c8d51ce-6fff-4681-8aa9-9cf7afac932e.jpg",
  priceSar: 189,
  occasion: "abaya",
  category: "abaya",
  abayaSizes: [50, 52, 54, 56, 58, 60],
  abayaSizeChart: DEFAULT_ABAYA_HEIGHT_CHART,

  // ✅ Body Shape Labels
  abayaBestForShapes: ["تفاحة", "مستقيم"],

  bestFor: {
    depth: ["فاتح جدًا", "فاتح", "حنطي فاتح", "حنطي", "أسمر", "داكن"],
    undertone: ["بارد", "محايد"],
  },
  tags: ["عباية", "أسود", "تطريز وردي", "أكمام"],
},
{
  id: "bar-114",
  title: "Black Abaya Fully Embroidered from the Back",
  store: "Barllina",
  url: "https://barllina.com/products/Black-abaya-fully-embroidered-from-the-back50177",
  image:
    "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/9df8f427-78f9-4adc-8594-ae9766ec7f8d.jpg",
  priceSar: 179,
  occasion: "abaya",
  category: "abaya",
  abayaSizes: [50, 52, 54, 56, 58, 60],
  abayaSizeChart: DEFAULT_ABAYA_HEIGHT_CHART,

  // ✅ Body Shape Labels
  abayaBestForShapes: ["ساعة رملية", "كمثري"],

  bestFor: {
    depth: ["فاتح جدًا", "فاتح", "حنطي فاتح", "حنطي", "أسمر", "داكن"],
    undertone: ["بارد", "دافئ", "محايد", "زيتوني"],
  },
  tags: ["عباية", "تطريز خلفي", "أسود", "فخم"],
},
{
  id: "bar-115",
  title: "Black Abaya with Delicate Lace Embroidery",
  store: "Barllina",
  url: "https://barllina.com/products/Black-abaya-decorated-with-delicate-lace-embroidery50032",
  image:
    "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/013c3518-383b-4b4c-a5c2-2bde8cf86af5.jpg",
  priceSar: 199,
  occasion: "abaya",
  category: "abaya",
  abayaSizes: [50, 52, 54, 56, 58, 60],
  abayaSizeChart: DEFAULT_ABAYA_HEIGHT_CHART,

  // ✅ Body Shape Labels
  abayaBestForShapes: ["مستقيم", "ساعة رملية"],

  bestFor: {
    depth: ["فاتح جدًا", "فاتح", "حنطي فاتح", "حنطي", "أسمر", "داكن"],
    undertone: ["بارد", "دافئ", "محايد", "زيتوني"],
  },
  tags: ["عباية", "دانتيلا", "أسود", "ناعمة"],
},
{
  id: "bar-116",
  title: "Black Abaya with Sequin Embroidery",
  store: "Barllina",
  url: "https://barllina.com/products/Black-abaya-decorated-with-sequin-embroidery50155",
  image:
    "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/92a0f216-3945-41f1-b61b-8885cd2954de.jpg",
  priceSar: 169,
  occasion: "abaya",
  category: "abaya",
  abayaSizes: [50, 52, 54, 56, 58, 60],
  abayaSizeChart: DEFAULT_ABAYA_HEIGHT_CHART,

  // ✅ Body Shape Labels
  abayaBestForShapes: ["تفاحة", "كمثري"],

  bestFor: {
    depth: ["فاتح جدًا", "فاتح", "حنطي فاتح", "حنطي", "أسمر", "داكن"],
    undertone: ["بارد", "دافئ", "محايد", "زيتوني"],
  },
  tags: ["عباية", "ترتر", "أسود", "فخم"],
},
  // ===== Sets (Work/Chalets) =====
  {
    id: "bar-117",
    title: "Elegant Set with Rose Detail",
    store: "Barllina",
    url: "https://barllina.com/products/An-elegant-set-adorned-with-a-rose-and-delicate-details60064",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/d7505a53-e966-47e7-89f9-245c66471d72.jpg",
    priceSar: 229,
    occasion: "work",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي فاتح", "حنطي"], undertone: ["محايد", "دافئ"] },
    tags: ["طقم", "أنيق", "ورد", "عمل"],
  },
  {
    id: "bar-118",
    title: "Wrap Top & Wide Leg Pants Set",
    store: "Barllina",
    url: "https://barllina.com/products/Womens-set-with-a-wrap-top-and-wide-leg-pants60063",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/4052e821-2f76-437a-a871-b3bd98c481d3.jpg",
    priceSar: 215,
    occasion: "work",
    category: "dress",
    bestFor: {
      depth: ["فاتح", "حنطي فاتح", "حنطي", "أسمر"],
      undertone: ["محايد", "دافئ"],
    },
    tags: ["طقم", "لف", "بنطلون واسع", "رسمي"],
  },
  {
    id: "bar-119",
    title: "Casual Set in Light Fabric with Black Top",
    store: "Barllina",
    url: "https://barllina.com/products/Casual-set-in-light-fabric-with-a-black-top60046",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/1b83502e-89ab-4198-b71a-5782ee972f1c.jpg",
    priceSar: 219,
    occasion: "chalets",
    category: "dress",
    bestFor: {
      depth: ["فاتح", "حنطي فاتح", "حنطي", "أسمر"],
      undertone: ["محايد", "دافئ", "زيتوني"],
    },
    tags: ["طقم", "كاجوال", "خفيف", "شاليهات"],
  },

  // ===== Dresses (mostly wedding/engagement) =====
  {
    id: "bar-120",
    title: "Elegant Beige Dress with Crystal Details",
    store: "Barllina",
    url: "https://barllina.com/products/Elegant-beige-dress-with-crystal-details191832",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/caebb712-a298-4c9d-a329-3d00136dedd9.jpg",
    priceSar: 389,
    occasion: "engagement",
    category: "dress",
    bestFor: {
      depth: ["فاتح جدًا", "فاتح", "حنطي فاتح"],
      undertone: ["دافئ", "محايد"],
    },
    tags: ["بيج", "كريستال", "أنيق", "خطوبة"],
  },
  {
    id: "bar-121",
    title: "Light Green Evening Dress with Wavy Tail",
    store: "Barllina",
    url: "https://barllina.com/products/Light-green-evening-dress-with-wavy-tail191811",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/9d6cd205-24a0-4fcf-95b1-10d6a04922e7.jpg",
    priceSar: 495,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي فاتح", "حنطي", "أسمر"], undertone: ["دافئ", "زيتوني"] },
    tags: ["أخضر فاتح", "ذيل", "سهرة", "فخم"],
  },
  {
    id: "bar-122",
    title: "Burgundy Cloche Dress with Luxurious Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/Burgundy-cloche-dress-with-luxurious-embroidery191810",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/a48c30e5-c055-4a18-870d-2c8e2ef9480b.jpg",
    priceSar: 495,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي", "أسمر", "داكن"], undertone: ["دافئ", "محايد"] },
    tags: ["خمري", "تطريز", "فخم", "سهرة"],
  },
  {
    id: "bar-123",
    title: "Soft Gradient Dress with Shiny Branch Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/Soft-gradient-dress-with-shiny-branch-embroidery191803",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/da22a0ce-7789-44c5-86c2-a512418e7855.jpg",
    priceSar: 950,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي فاتح", "حنطي"], undertone: ["محايد", "بارد"] },
    tags: ["تدرج", "لمعة", "ناعم", "سهرة"],
  },
  {
    id: "bar-124",
    title: "Navy Blue Dress with Fluffy Cut and Rose Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/Navy-blue-dress-with-a-fluffy-cut-and-elegant-rose-embroidery191798",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/db62c4e9-3057-415f-b854-969919712ad9.jpg",
    priceSar: 479,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: {
      depth: ["حنطي فاتح", "حنطي", "أسمر", "داكن"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["كحلي", "ورود", "قصة منفوشة", "فخم"],
  },
  {
    id: "bar-125",
    title: "White Dress with Prominent Rose Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/White-dress-with-prominent-rose-embroidery191763",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/f3d3b896-5ee0-49fd-8889-bb13890686bf.jpg",
    priceSar: 950,
    occasion: "wedding",
    weddingStyle:"ثقيل" ,
    category: "dress",
    bestFor: {
      depth: ["فاتح جدًا", "فاتح", "حنطي فاتح"],
      undertone: ["محايد", "بارد"],
    },
    tags: ["أبيض", "ورود", "ناعم", "ميدي"],
  },
  {
    id: "bar-126",
    title: "Luxurious Black Evening Dress with Shiny Stones",
    store: "Barllina",
    url: "https://barllina.com/products/Luxurious-black-evening-dress-with-shiny-stones191756",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/9a262fb5-0e36-4c04-be8f-c900e0f017d0.jpg",
    priceSar: 1100,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: {
      depth: ["فاتح جدًا", "فاتح", "حنطي فاتح", "حنطي", "أسمر", "داكن"],
      undertone: ["بارد", "دافئ", "محايد", "زيتوني"],
    },
    tags: ["أسود", "أحجار", "فخم", "سهرة"],
  },
  {
    id: "bar-127",
    title: "Tiffany Dress with Pearl Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/Tiffany-dress-with-delicate-pearl-embroidery191805",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/bfd1cfc1-b49b-46bc-97ce-f499d863b398.jpg",
    priceSar: 799,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي فاتح", "حنطي"], undertone: ["بارد", "محايد"] },
    tags: ["تيفاني", "لؤلؤ", "ناعم", "خطوبة"],
  },
  {
    id: "bar-128",
    title: "Green Dress with Wide Skirt Design",
    store: "Barllina",
    url: "https://barllina.com/products/Green-dress-with-a-wide-skirt-design190092",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/b85354aa-2e72-4178-ab01-952ba2357495.jpg",
    priceSar: 529,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي فاتح", "حنطي", "أسمر"], undertone: ["دافئ", "زيتوني"] },
    tags: ["أخضر", "تنورة واسعة", "ملكي", "فخم"],
  },
  {
    id: "bar-129",
    title: "Emerald Green Dress with Pleats at the Waist",
    store: "Barllina",
    url: "https://barllina.com/products/Emerald-green-dress-with-pleats-at-the-waist19680",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/23a3d93d-89fb-477b-ac75-4214ebed1b50.jpg",
    priceSar: 249,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["حنطي فاتح", "حنطي", "أسمر", "داكن"], undertone: ["دافئ", "زيتوني"] },
    tags: ["زمردي", "ثنيات", "أنيق", "سهرة"],
  },
  {
    id: "bar-130",
    title: "Soft Light Beige Dress with Elegant Off-Shoulders",
    store: "Barllina",
    url: "https://barllina.com/products/Soft-light-beige-dress-with-elegant-off-shoulders19037",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/f731291a-93fd-484e-820d-032d86de9bc6.jpg",
    priceSar: 325,
    occasion: "engagement",
    category: "dress",
    bestFor: {
      depth: ["فاتح جدًا", "فاتح", "حنطي فاتح"],
      undertone: ["دافئ", "محايد"],
    },
    tags: ["بيج فاتح", "كتف مكشوف", "ناعم", "خطوبة"],
  },
  {
    id: "bar-131",
    title: "Layered Burgundy Dress with Shawl",
    store: "Barllina",
    url: "https://barllina.com/products/Layered-burgundy-dress-with-shawl18196",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/1ccc3b94-de14-4c10-abb7-0953e74b83f1.jpg",
    priceSar: 290,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["حنطي", "أسمر", "داكن"], undertone: ["دافئ", "محايد"] },
    tags: ["خمري", "شال", "طبقات", "فخم"],
  },
  {
    id: "bar-132",
    title: "Shanton Blue Midi Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Shanton-blue-midi-dress17104",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/8672c388-dbfe-4c65-8bbd-b133aaf5c534.jpg",
    priceSar: 299,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي فاتح", "حنطي"], undertone: ["بارد", "محايد"] },
    tags: ["أزرق", "ميدي", "رسمي", "عمل"],
  },
  {
    id: "bar-133",
    title: "Shanton Short Dress in Raspberry Color",
    store: "Barllina",
    url: "https://barllina.com/products/Shanton-short-dress-in-raspberry-color17542",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/332d52c0-05b5-4de1-923e-1d1b5463f22e.jpg",
    priceSar: 285,
    occasion: "engagement",
    category: "dress",
    bestFor: {
      depth: ["فاتح", "حنطي فاتح", "حنطي", "أسمر"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["توتي", "قصير", "ستايل", "خطوبة"],
  },

  // ===== Jalabiyas (Ramadan) =====
  {
    id: "bar-134",
    title: "Soft Beige Jalabiya with Gold Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/A-soft-beige-jalabiya-decorated-with-gold-embroidery193578",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/0a0b1444-4e90-4dab-bbb2-37ad2959284f.jpg",
    priceSar: 269,
    occasion: "ramadan",
    category: "jalabiya",
    bestFor: {
      depth: ["فاتح جدًا", "فاتح", "حنطي فاتح"],
      undertone: ["دافئ", "محايد"],
    },
    tags: ["جلابية", "بيج", "تطريز ذهبي", "غبقة"],
  },
  {
    id: "bar-135",
    title: "Luxurious Beige Jalabiya with Long Flowing Sleeves",
    store: "Barllina",
    url: "https://barllina.com/products/Luxurious-beige-jalabiya-with-long-flowing-sleeves193436",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/424eb8aa-bcb3-4950-8a8e-3e0dc2d05e93.jpg",
    priceSar: 465,
    occasion: "ramadan",
    category: "jalabiya",
    bestFor: { depth: ["فاتح", "حنطي فاتح", "حنطي"], undertone: ["دافئ", "محايد"] },
    tags: ["جلابية", "أكمام طويلة", "فخم", "غبقة"],
  },
  {
    id: "bar-136",
    title: "Embroidered Lace Overlay Jalabiya with Veil",
    store: "Barllina",
    url: "https://barllina.com/products/Embroidered-lace-overlay-jalabiya-with-veil193390",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/976a013a-36c0-40a7-85b2-c83105b75e82.jpg",
    priceSar: 390,
    occasion: "ramadan",
    category: "jalabiya",
    bestFor: { depth: ["فاتح جدًا", "فاتح", "حنطي فاتح"], undertone: ["بارد", "محايد"] },
    tags: ["جلابية", "طبقة دانتيل", "طرحة", "غبقة"],
  },

  // ===== Wedding Heavy / Statement =====
  {
    id: "bar-137",
    title: "Royal Purple Lace Dress with Velvet Sleeves",
    store: "Barllina",
    url: "https://barllina.com/products/Royal-purple-lace-dress-with-velvet-sleeves192884",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/99d99b3d-8f81-4d68-b788-41f48d31d5be.jpg",
    priceSar: 380,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي", "أسمر", "داكن"], undertone: ["بارد", "محايد"] },
    tags: ["بنفسجي", "دانتيل", "مخمل", "ملكي"],
  },
  {
    id: "bar-138",
    title: "Shimmering Sky Blue Dress with Tulle Train",
    store: "Barllina",
    url: "https://barllina.com/products/A-shimmering-sky-blue-dress-with-a-tulle-train192791",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/ef03c887-ebb4-41ab-8c8b-ab7bf19f28a2.jpg",
    priceSar: 1100,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي فاتح", "حنطي"], undertone: ["بارد", "محايد"] },
    tags: ["سماوي", "تول", "ذيل", "لمعة"],
  },
  {
    id: "bar-139",
    title: "Woven Dress with Embroidery and Shimmering Gradients",
    store: "Barllina",
    url: "https://barllina.com/products/A-woven-dress-with-embroidery-and-shimmering-gradients192830",
    image: "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/06588bce-0afa-4cba-a944-3dc7a8a14634.jpg",
    priceSar: 555,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: {
      depth: ["حنطي فاتح", "حنطي", "أسمر"],
      undertone: ["دافئ", "محايد", "زيتوني"],
    },
    tags: ["تدرج", "تطريز", "لمعة", "فخم"],
  },

  // =========================
  // Jolina
  // =========================
  {
    id: "jol-001",
    title: "فستان بنفسجي مع كاب لامع طويل",
    store: "Jolina",
    url: "https://jolinafashion.com/mZDAXrq",
    image: "https://cdn.salla.sa/GgXea/W26H3oZOnGyzuixu3iAzmQDWqdGaW4eh4Z53pln5.jpg",
    priceSar: 410,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["بارد", "محايد"] },
    tags: ["بنفسجي", "كاب", "سهرة"],
  },
  {
    id: "jol-002",
    title: "Jolina Product (KRNxbgb)",
    store: "Jolina",
    url: "https://jolinafashion.com/KRNxbgb",
    image: "https://cdn.salla.sa/GgXea/xWWioi6MyjKbsXWX7kppHdOT4wDzvYPGnGB6Eb67.jpg",
    priceSar: 420,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان", "سهرة"],
  },
  {
    id: "jol-003",
    title: "Jolina Product (RvyKxEw)",
    store: "Jolina",
    url: "https://jolinafashion.com/RvyKxEw",
    image: "https://cdn.salla.sa/GgXea/U8gds6SC2EDzvyqJH4kvSB5Yui8I3zo7UOJqodhL.jpg",
    priceSar: 480,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان", "سهرة"],
  },
  {
    id: "jol-004",
    title: "فستان وهج luxe",
    store: "Jolina",
    url: "https://jolinafashion.com/ABxRvND",
    image: "https://cdn.salla.sa/GgXea/SG6TRzI1p4ZMuWGoEZuS8i6qQDAyDw1zQcYOHp5E.jpg",
    priceSar: 775,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    category: "dress",
    bestFor: { depth: ["حنطي", "أسمر", "داكن"], undertone: ["دافئ", "محايد"] },
    tags: ["فستان", "سهرة", "ثقيل"],
  },
  {
    id: "jol-005",
    title: "فستان وهج Treasure",
    store: "Jolina",
    url: "https://jolinafashion.com/VDPeAlQ",
    image: "https://cdn.salla.sa/GgXea/LYGo2W6ElK7er1FMnczmX9czH0Yd0347zQJwjzDD.jpg",
    priceSar: 480,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان"],
  },
  {
    id: "jol-006",
    title: "فستان زيتي",
    store: "Jolina",
    url: "https://jolinafashion.com/ABPOpmn",
    image: "https://cdn.salla.sa/GgXea/qyzL09tQDjDlytUSAWjlLZXBo9sjMjYjbnHmxli5.jpg",
    priceSar: 409,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان"],
  },
  {
    id: "jol-007",
    title: "فستان سهره (WzgzpZr)",
    store: "Jolina",
    url: "https://jolinafashion.com/WzgzpZr",
    image: "https://cdn.salla.sa/GgXea/BRHvm41tWssXkV1wGCito9LodVgshXaHKWa8mCRj.jpg",
    priceSar: 485,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان"],
  },
  {
    id: "jol-008",
    title: "فستان سماوي قطعتين",
    store: "Jolina",
    url: "https://jolinafashion.com/lGQOmrV",
    image: "https://cdn.salla.sa/GgXea/mCjeWhTB4FcHh0mB4PaPMS4dcAzv4Jkaor1uRg3m.jpg",
    priceSar: 565,
    occasion: "engagement",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان", "عملي"],
  },
  {
    id: "jol-009",
    title: "فستان سهرة سكري",
    store: "Jolina",
    url: "https://jolinafashion.com/ePBPgXO",
    image: "https://cdn.salla.sa/GgXea/DPB0HcOAfHxK7xpScjiGM0skVipP0n2sZO3iYCPN.jpg",
    priceSar: 490,
    occasion: "wedding",
    weddingStyle:"ناعم" ,
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["جلابية", "رمضان"],
  },
  {
    id: "jol-010",
    title: "فستان زيتي توب",
    store: "Jolina",
    url: "https://jolinafashion.com/RAVybxo?from=search-bar",
    image: "https://cdn.salla.sa/GgXea/U8gds6SC2EDzvyqJH4kvSB5Yui8I3zo7UOJqodhL.jpg",
    priceSar: 330,
    occasion: "wedding",
    weddingStyle: "ناعم",
    category: "dress",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان"],
  },
];