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
  | "داكن جدًا";

export type Undertone = "دافئ" | "بارد" | "محايد" | "زيتوني";

export type Product = {
  id: string;
  title: string;
  store: string;
  url: string;
  image: string; // رابط صورة مباشر (يفضل ينتهي jpg/png/webp)
  priceSar: number;

  occasion: Occasion;
  weddingStyle?: WeddingStyle; // فقط لو occasion === "wedding"

  bestFor: {
    depth: SkinDepth[];
    undertone: Undertone[];
  };

  tags?: string[];

  // لاحقًا لو تبين نضبط المقاسات بدقة لكل متجر:
  // sizeChart?: {
  //   XS?: { bust: [number, number]; waist: [number, number]; hip: [number, number] };
  //   S?:  { bust: [number, number]; waist: [number, number]; hip: [number, number] };
  //   M?:  { bust: [number, number]; waist: [number, number]; hip: [number, number] };
  //   L?:  { bust: [number, number]; waist: [number, number]; hip: [number, number] };
  //   XL?: { bust: [number, number]; waist: [number, number]; hip: [number, number] };
  // };
};

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
    priceSar: 210,
    occasion: "wedding",
    weddingStyle: "ناعم",
    bestFor: {
      depth: ["فاتح", "حنطي"],
      undertone: ["محايد", "بارد"],
    },
    tags: ["دانتيل", "أوف شولدر", "ناعم"],
  },
  {
    id: "bar-002",
    title: "Tiffany Midi Dress with Crystal Embroidery",
    store: "Barllina",
    url: "https://barllina.com/products/Tiffany-midi-dress-with-crystal-embroidery194257",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/072134b5-a4ab-4b3b-821f-146d9fa06a65.jpg",
    priceSar: 310,
    occasion: "engagement",
    bestFor: {
      depth: ["فاتح", "حنطي"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["تيفاني", "كريستال", "ميدي"],
  },
  {
    id: "bar-003",
    title: "Beige Off Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Beige-off-shoulder-dress-with-delicate-embroidery193972",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/f385ca23-1171-4718-bcf1-4878dee62cb4.jpg",
    priceSar: 350,
    occasion: "wedding",
    weddingStyle: "ناعم",
    bestFor: {
      depth: ["فاتح", "حنطي"],
      undertone: ["دافئ", "محايد"],
    },
    tags: ["بيج", "أوف شولدر", "ناعم"],
  },
  {
    id: "bar-004",
    title: "Black Velvet Off Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Black-Velvet-Off-Shoulder-Dress19748",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/23c7caee-1e33-4903-aaf0-bb43891a9e60.jpg",
    priceSar: 289,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    bestFor: {
      depth: ["حنطي", "أسمر", "داكن جدًا"],
      undertone: ["محايد", "بارد"],
    },
    tags: ["مخمل", "أسود", "فخم"],
  },
  {
    id: "bar-005",
    title: "Off White Beaded Midi Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Off-White-midi-dress-with-corset-design18774",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/adcf6eb6-cad1-4ca9-a75d-d8aeafa86e23.jpg",
    priceSar: 490,
    occasion: "wedding",
    weddingStyle: "ناعم",
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
    priceSar: 269,
    occasion: "engagement",
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["كحلي", "قصير", "مخمل"],
  },
  {
    id: "bar-007",
    title: "Burgundy Off Shoulder Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Burgundy-off-shoulder-dress-with-tiered-layers193697",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/cf017b0c-2718-4eb1-ad25-8ab19d252bd6.jpg",
    priceSar: 239,
    occasion: "engagement",
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["دافئ", "محايد"],
    },
    tags: ["عنابي", "أوف شولدر", "ستايل"],
  },
  {
    id: "bar-008",
    title: "Navy Embroidered Evening Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Navy-blue-embroidered-dress-with-shiny-touches-and-a-side-slit191806",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/3780c868-78f9-44d7-b6be-182c38fd809c.jpg",
    priceSar: 510,
    occasion: "wedding",
    weddingStyle: "ثقيل",
    bestFor: {
      depth: ["حنطي", "أسمر", "داكن جدًا"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["كحلي", "ترتر", "سهرة"],
  },
  {
    id: "bar-009",
    title: "Brown Lace Dress",
    store: "Barllina",
    url: "https://barllina.com/products/Brown-lace-dress-with-wide-sleeved-cuffs192825",
    image:
      "https://media.zid.store/08f98a85-90b1-40ac-a003-41cc95f39914/6be7c010-7ed1-4845-a8c9-611900f27c67.jpg",
    priceSar: 295,
    occasion: "engagement",
    bestFor: {
      depth: ["حنطي", "أسمر", "داكن جدًا"],
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
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["بارد", "محايد"],
    },
    tags: ["موف", "ماكسي", "ناعم"],
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
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["بارد", "محايد"],
    },
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
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["محايد"],
    },
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
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["محايد"],
    },
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
    bestFor: {
      depth: ["حنطي", "أسمر", "داكن جدًا"],
      undertone: ["دافئ", "محايد"],
    },
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
    bestFor: {
      depth: ["فاتح", "حنطي", "أسمر"],
      undertone: ["محايد"],
    },
    tags: ["فستان"],
  },

  // (باقي الروابط — خليتها جاهزة بس ناقصة صورة/سعر عندك)
  {
    id: "jol-006",
    title: "فستان زيتي ",
    store: "Jolina",
    url: "https://jolinafashion.com/ABPOpmn",
    image: "https://cdn.salla.sa/GgXea/qyzL09tQDjDlytUSAWjlLZXBo9sjMjYjbnHmxli5.jpg",
    priceSar: 409,
    occasion: "engagement",
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
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان"],
  },
  {
    id: "jol-008",
    title: "فستان سماوي قطعتين ",
    store: "Jolina",
    url: "https://jolinafashion.com/lGQOmrV",
    image: "https://cdn.salla.sa/GgXea/mCjeWhTB4FcHh0mB4PaPMS4dcAzv4Jkaor1uRg3m.jpg",
    priceSar: 565,
    occasion: "work",
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
    occasion: "ramadan",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["جلابية", "رمضان"],
  },
  {
    id: "jol-010",
    title: "فستان زيتي توب)",
    store: "Jolina",
    url: "https://cdn.salla.sa/GgXea/U8gds6SC2EDzvyqJH4kvSB5Yui8I3zo7UOJqodhL.jpg",
    image: "",
    priceSar: 330,
    occasion: "wedding",
    weddingStyle: "ناعم",
    bestFor: { depth: ["فاتح", "حنطي", "أسمر"], undertone: ["محايد"] },
    tags: ["فستان"],
  },
];