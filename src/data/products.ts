import { Category, Product } from "../types";

export const STORE_PHONE = "03034495235";
export const STORE_WHATSAPP = "https://wa.me/923034495235";
export const HERO_BANNER_IMAGE = "/src/assets/images/farnova_hero_model_1790980184996.jpg";

export const CATEGORIES: Category[] = [
  {
    "id": "shoes",
    "name": "Shoes",
    "tagline": "Sneakers, casual shoes, formal oxfords & loafers",
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
    "subcategories": [
      "All",
      "Sneakers",
      "Casual Shoes",
      "Formal Shoes",
      "Loafers"
    ]
  },
  {
    "id": "watches",
    "name": "Watches",
    "tagline": "Classic chronographs, casual pieces & modern daily styles",
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
    "subcategories": [
      "All",
      "Classic Watches",
      "Casual Watches",
      "Modern Everyday"
    ]
  },
  {
    "id": "shirts",
    "name": "Shirts",
    "tagline": "Crisp casual button-downs, formal poplins & essentials",
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
    "subcategories": [
      "All",
      "Casual Shirts",
      "Formal Shirts",
      "Everyday Essentials"
    ]
  },
  {
    "id": "pants",
    "name": "Pants",
    "tagline": "Tailored chinos, raw denim jeans & formal trousers",
    "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
    "subcategories": [
      "All",
      "Jeans",
      "Chinos",
      "Casual Pants",
      "Formal Trousers"
    ]
  },
  {
    "id": "bundles",
    "name": "Bundle Deals",
    "tagline": "Curated multi-item sets & build-your-own custom drip savings",
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
    "subcategories": [
      "All",
      "Executive Sets",
      "Casual Packs",
      "Custom Bundles"
    ]
  }
];

export const INITIAL_DEFAULT_BUNDLES = [
  {
    id: "bundle-executive-drip",
    title: "Executive Full Drip",
    productIds: ["sh-02", "pt-01", "st-01", "wt-01"],
    includedProductNames: [
      "Kensington Leather Penny Loafer",
      "Tailored Stretch Cotton Chino",
      "Milano Formal Oxford Dress Shirt",
      "Royal Sovereign Chronograph Watch"
    ],
    originalPrice: 10000,
    offerPrice: 6999,
    discountBadge: "SAVE 30%",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
    description: "The complete luxury executive ensemble: oxford shirt, tailored chinos, penny loafers, and sovereign chronograph.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bundle-weekend-casual",
    title: "Weekend Smart Casual Pack",
    productIds: ["sh-01", "pt-02", "st-03"],
    includedProductNames: [
      "Farnova Verona Minimalist Leather Sneaker",
      "Selvedge Raw Indigo Denim Jeans",
      "Amalfi French-Linen Casual Shirt"
    ],
    originalPrice: 8500,
    offerPrice: 5999,
    discountBadge: "SAVE 29%",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80",
    description: "Effortlessly sharp weekend ensemble featuring minimalist sneakers, selvedge denim, and French linen shirt.",
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_BUNDLE_DISCOUNTS = {
  twoItems: 15,
  threeItems: 25,
  fourItems: 35,
};

export const PRODUCTS: Product[] = [
  {
    "id": "sh-01",
    "name": "Farnova Verona Minimalist Leather Sneaker",
    "sku": "FN-SH-VR01",
    "category": "shoes",
    "subcategory": "Sneakers",
    "price": 6499,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Handcrafted premium full-grain micro-leather sneakers with padded memory soles.",
    "description": "Designed for the modern Pakistani gentleman who demands style without sacrificing all-day comfort. The Verona sneaker combines supple genuine microfiber leather with an anti-slip vulcanized rubber sole and moisture-wicking memory foam cushioning.",
    "features": [
      "Full-grain calfskin texture finish",
      "High-resilience memory foam insole",
      "Reinforced heel counter for arch support",
      "Non-marking anti-skid rubber outsole",
      "Ideal for casual Fridays, evening outings & smart casual events"
    ],
    "sizes": [
      "EU 40",
      "EU 41",
      "EU 42",
      "EU 43",
      "EU 44",
      "EU 45"
    ],
    "colors": [
      {
        "name": "Pure Chalk White",
        "hex": "#FFFFFF"
      },
      {
        "name": "Onyx Midnight",
        "hex": "#1C1C1E"
      },
      {
        "name": "Sand Beige",
        "hex": "#D6C7B2"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": true,
    "material": "Microfiber Vegan Leather & Natural Rubber",
    "rating": 4.9,
    "reviewCount": 42
  },
  {
    "id": "sh-02",
    "name": "Royal Suede Penny Loafers",
    "sku": "FN-SH-RL02",
    "category": "shoes",
    "subcategory": "Loafers",
    "price": 7499,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Classic Italian slip-on silhouette in velvety water-resistant suede.",
    "description": "A timeless staple of masculine tailoring. Pair them effortlessly with cropped chinos or tailored summer trousers. Features hand-stitched saddle detailing and a flexible leather-stacked heel.",
    "features": [
      "Velvety water-repellent suede upper",
      "Hand-stitched apron & saddle strap",
      "Breathable genuine leather lining",
      "Cushioned footbed for extended wear"
    ],
    "sizes": [
      "EU 40",
      "EU 41",
      "EU 42",
      "EU 43",
      "EU 44"
    ],
    "colors": [
      {
        "name": "Navy Blue",
        "hex": "#1B263B"
      },
      {
        "name": "Cognac Tan",
        "hex": "#8B4513"
      },
      {
        "name": "Jet Black",
        "hex": "#18181B"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": false,
    "material": "High-Grade Suede & Leather Sole",
    "rating": 4.8,
    "reviewCount": 31
  },
  {
    "id": "sh-03",
    "name": "Milan Executive Oxford Formal Shoes",
    "sku": "FN-SH-ML03",
    "category": "shoes",
    "subcategory": "Formal Shoes",
    "price": 8499,
    "originalPrice": 9999,
    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Closed-lacing formal dress shoe with mirror burnished toe cap.",
    "description": "Impeccable craftsmanship built for formal business meetings, corporate galas, and wedding events across Pakistan. Features sleek closed lacing, Goodyear welt stitching aesthetic, and a hand-burnished toe cap.",
    "features": [
      "High-grade polished leather finish",
      "Hand-burnished almond toe design",
      "Shock-absorbing inner sole heel pad",
      "Anti-friction waxed dress laces"
    ],
    "sizes": [
      "EU 41",
      "EU 42",
      "EU 43",
      "EU 44",
      "EU 45"
    ],
    "colors": [
      {
        "name": "Deep Black",
        "hex": "#0F0F10"
      },
      {
        "name": "Burgundy Oxblood",
        "hex": "#4A0E17"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": false,
    "isNewArrival": true,
    "material": "Premium Burnished Leatherette",
    "rating": 4.9,
    "reviewCount": 19
  },
  {
    "id": "sh-04",
    "name": "Aero Minimalist Daily Walkers",
    "sku": "FN-SH-AE04",
    "category": "shoes",
    "subcategory": "Casual Shoes",
    "price": 4999,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Ultra-lightweight everyday sneakers for maximum daily comfort.",
    "description": "Engineered for busy days on your feet. The Aero daily walker weighs merely 280 grams yet provides robust impact absorption, knit breathability, and sleek urban minimalism.",
    "features": [
      "Featherlight engineered mesh & nubuck accents",
      "Energy-rebound EVA sole",
      "Slip-on elasticated entry with mock laces",
      "Machine washable insole"
    ],
    "sizes": [
      "EU 40",
      "EU 41",
      "EU 42",
      "EU 43",
      "EU 44"
    ],
    "colors": [
      {
        "name": "Slate Grey",
        "hex": "#4B5563"
      },
      {
        "name": "Off White",
        "hex": "#F3F4F6"
      },
      {
        "name": "All Black",
        "hex": "#111827"
      }
    ],
    "stockStatus": "Limited Quantity",
    "isFeatured": false,
    "isNewArrival": false,
    "material": "Breathable Knit & High-Density Foam",
    "rating": 4.7,
    "reviewCount": 28
  },
  {
    "id": "wt-01",
    "name": "Farnova Sovereign Chronograph 41mm",
    "sku": "FN-WT-SV01",
    "category": "watches",
    "subcategory": "Classic Watches",
    "price": 8999,
    "originalPrice": 10999,
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Sub-dial chronograph with sapphire-coated crystal and Italian top-grain strap.",
    "description": "An commanding statement on the wrist. Built with a precision Japanese quartz movement, functional chronograph sub-dials, date window at 4 o’clock, and a scratch-resistant mineral crystal glass.",
    "features": [
      "Precision Japanese Quartz movement with stopwatch function",
      "Brushed 316L stainless steel case with polished bevels",
      "Scratch-resistant coated mineral glass",
      "Water resistant to 3 ATM (splash & rain resistant)",
      "Interchangeable quick-release top-grain leather strap"
    ],
    "sizes": [
      "Standard 41mm Case (Adjustable Strap)"
    ],
    "colors": [
      {
        "name": "Midnight Dial / Black Leather",
        "hex": "#18181B"
      },
      {
        "name": "Sunburst Silver / Brown Leather",
        "hex": "#8B4513"
      },
      {
        "name": "Deep Emerald / Gold Accent",
        "hex": "#1B4332"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": true,
    "material": "316L Stainless Steel & Top-Grain Leather",
    "rating": 5,
    "reviewCount": 56
  },
  {
    "id": "wt-02",
    "name": "Minimalist Obsidian Matte Watch",
    "sku": "FN-WT-OB02",
    "category": "watches",
    "subcategory": "Modern Everyday",
    "price": 5499,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Ultra-thin 7.2mm profile with Bauhaus dial and matte black mesh band.",
    "description": "Understated elegance at its finest. Strip away all unnecessary distractions: a pure sunray dial, slim baton markers, and a supple Milanese mesh bracelet that contours smoothly to your wrist.",
    "features": [
      "Slim 7.2mm case thickness for effortless dress-shirt fit",
      "Durable PVD matte black ion plating",
      "Breathable magnetic Milanese mesh strap",
      "Luminescent hour & minute hands"
    ],
    "sizes": [
      "40mm Slim Case (Adjustable Mesh)"
    ],
    "colors": [
      {
        "name": "Stealth Matte Black",
        "hex": "#1F2421"
      },
      {
        "name": "Gunmetal Titanium",
        "hex": "#4A4E69"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": false,
    "material": "PVD Coated Alloy & Milanese Steel",
    "rating": 4.8,
    "reviewCount": 39
  },
  {
    "id": "wt-03",
    "name": "Horizon Dual-Time Vintage Leather Watch",
    "sku": "FN-WT-HZ03",
    "category": "watches",
    "subcategory": "Casual Watches",
    "price": 6499,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Field-inspired timepiece with distressed saddle leather strap and date display.",
    "description": "Rugged yet refined. Inspired by military field watches from the 1950s, with high-visibility Arabic numerals, a rotating 24-hour outer bezel, and thick contrast-stitched vintage saddle leather.",
    "features": [
      "Vintage-treated genuine saddle leather strap",
      "Dual-time zone indicator sub-dial",
      "Super-LumiNova markers for night visibility",
      "Solid screw-down caseback with Farnova emblem"
    ],
    "sizes": [
      "42mm Case (Standard Men’s Fit)"
    ],
    "colors": [
      {
        "name": "Vintage Saddle Brown",
        "hex": "#6F4E37"
      },
      {
        "name": "Distressed Tan",
        "hex": "#A0522D"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": false,
    "isNewArrival": true,
    "material": "Brushed Alloy & Distressed Leather",
    "rating": 4.9,
    "reviewCount": 22
  },
  {
    "id": "wt-04",
    "name": "Executive Automatic Exhibition Watch",
    "sku": "FN-WT-EX04",
    "category": "watches",
    "subcategory": "Classic Watches",
    "price": 9999,
    "originalPrice": 12499,
    "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Open-heart skeleton aperture showing automatic self-winding movement.",
    "description": "The pinnacle of luxury horology for Farnova. No batteries needed: the internal rotor winds naturally with every movement of your arm. Features a glass exhibition caseback.",
    "features": [
      "Self-winding mechanical automatic rotor",
      "Open-heart dial revealing the oscillating balance wheel",
      "Dual-sided sapphire crystal lenses",
      "Butterfly deployment clasp buckle"
    ],
    "sizes": [
      "42mm Case Diameter"
    ],
    "colors": [
      {
        "name": "Silver & Rose Accent",
        "hex": "#B76E79"
      },
      {
        "name": "Polished Steel & Royal Blue",
        "hex": "#1E3A8A"
      }
    ],
    "stockStatus": "Limited Quantity",
    "isFeatured": false,
    "isNewArrival": false,
    "material": "Stainless Steel & Mechanical Movement",
    "rating": 4.9,
    "reviewCount": 15
  },
  {
    "id": "sh-t01",
    "name": "Farnova Sovereign Oxford Button-Down Shirt",
    "sku": "FN-SR-OX01",
    "category": "shirts",
    "subcategory": "Everyday Essentials",
    "price": 3799,
    "originalPrice": 4499,
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "100% combed long-staple cotton Oxford cloth with structured button-down collar.",
    "description": "The quintessential wardrobe cornerstone. Woven from durable, breathable 2-ply Oxford weave, pre-washed for zero shrinkage and ultra-soft hand feel. Looks equally sharp under a tailored blazer or worn casually untucked with chinos.",
    "features": [
      "100% premium long-staple Pakistani combed cotton",
      "Durable pinpoint Oxford basketweave",
      "Hidden collar stay buttons to maintain collar roll",
      "Natural mother-of-pearl finish buttons",
      "Tailored modern fit (neither boxy nor restrictive)"
    ],
    "sizes": [
      "S (38)",
      "M (40)",
      "L (42)",
      "XL (44)",
      "XXL (46)"
    ],
    "colors": [
      {
        "name": "Crisp White",
        "hex": "#FFFFFF"
      },
      {
        "name": "Sky Blue Oxford",
        "hex": "#BFDBFE"
      },
      {
        "name": "Soft French Pink",
        "hex": "#FCE7F3"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": true,
    "material": "100% Combed Long-Staple Cotton",
    "rating": 4.9,
    "reviewCount": 64
  },
  {
    "id": "sh-t02",
    "name": "Riviera Pure Washed Linen Shirt",
    "sku": "FN-SR-LN02",
    "category": "shirts",
    "subcategory": "Casual Shirts",
    "price": 4299,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Breathable lightweight Belgian flax linen for Pakistan summer elegance.",
    "description": "Stay completely cool and relaxed in scorching weather. Naturally breathable linen fibers allow maximum airflow, while garment-dye washing delivers an effortless, gently rumpled drape that looks richer with every wash.",
    "features": [
      "100% European flax certified linen",
      "Garment enzyme-washed for instant softness",
      "Relaxed spread collar with convertible styling",
      "Rolled cuff button tab details"
    ],
    "sizes": [
      "S (38)",
      "M (40)",
      "L (42)",
      "XL (44)",
      "XXL (46)"
    ],
    "colors": [
      {
        "name": "Natural Sand",
        "hex": "#E7DEC8"
      },
      {
        "name": "Sage Olive",
        "hex": "#708238"
      },
      {
        "name": "Classic Navy",
        "hex": "#1E293B"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": false,
    "material": "100% Pure Washed Linen",
    "rating": 4.8,
    "reviewCount": 38
  },
  {
    "id": "sh-t03",
    "name": "Windsor Royal Poplin Formal Shirt",
    "sku": "FN-SR-WN03",
    "category": "shirts",
    "subcategory": "Formal Shirts",
    "price": 3999,
    "originalPrice": 4699,
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Wrinkle-resistant 120s two-ply cotton with semi-cutaway English collar.",
    "description": "Engineered specifically for business executives and formal events. Treated with easy-iron technology so you step out of long meetings looking crisp, sharp, and immaculate without annoying crease lines.",
    "features": [
      "High-thread-count 120s Egyptian cotton poplin",
      "Easy-iron micro-coating for crease resistance",
      "Semi-cutaway collar accommodates all tie knots",
      "Convertible mitered cuffs (button or cufflinks)"
    ],
    "sizes": [
      "15.0 (S)",
      "15.5 (M)",
      "16.0 (L)",
      "16.5 (XL)",
      "17.0 (XXL)"
    ],
    "colors": [
      {
        "name": "Pure White",
        "hex": "#FFFFFF"
      },
      {
        "name": "Corporate Sky Blue",
        "hex": "#93C5FD"
      },
      {
        "name": "Fine Bengal Stripe",
        "hex": "#CBD5E1"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": false,
    "isNewArrival": true,
    "material": "120/2 Combed Cotton Poplin",
    "rating": 4.9,
    "reviewCount": 45
  },
  {
    "id": "sh-t04",
    "name": "Minimalist Mandarin Collar Casual Shirt",
    "sku": "FN-SR-MN04",
    "category": "shirts",
    "subcategory": "Casual Shirts",
    "price": 3499,
    "originalPrice": 4199,
    "image": "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Modern band-collar silhouette in textured slub cotton fabric.",
    "description": "A contemporary take on traditional Eastern sophistication. The minimalist band collar pairs naturally with selvedge jeans or trousers for a sharp, confident weekend look.",
    "features": [
      "Textured breathable slub cotton weave",
      "Clean 2.5cm band collar",
      "Curved hem designed to be worn untucked",
      "Subtle tonal stitching"
    ],
    "sizes": [
      "S (38)",
      "M (40)",
      "L (42)",
      "XL (44)"
    ],
    "colors": [
      {
        "name": "Off-White Ivory",
        "hex": "#FDFBF7"
      },
      {
        "name": "Charcoal Slate",
        "hex": "#334155"
      },
      {
        "name": "Desert Khaki",
        "hex": "#D2B48C"
      }
    ],
    "stockStatus": "Fast Selling",
    "isFeatured": false,
    "isNewArrival": false,
    "material": "100% Textured Slub Cotton",
    "rating": 4.7,
    "reviewCount": 29
  },
  {
    "id": "pt-01",
    "name": "Farnova Precision Stretch Tailored Chinos",
    "sku": "FN-PT-CH01",
    "category": "pants",
    "subcategory": "Chinos",
    "price": 4499,
    "originalPrice": 5299,
    "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "98% brushed cotton with 2% elastane flex for 360-degree all-day comfort.",
    "description": "The holy grail of men’s trousers. Tailored with a clean tapered leg that hugs naturally without constricting movement. Features an interior grip waistband to keep your shirt securely tucked in all day long.",
    "features": [
      "Peached soft-touch 280gsm cotton twill",
      "2% high-recovery elastane for sitting and driving ease",
      "Shirt-lock silicone internal waistband lining",
      "Reinforced crotch gusset to prevent blowouts",
      "YKK antique brass zip fly & button closure"
    ],
    "sizes": [
      "30W / 32L",
      "32W / 32L",
      "34W / 32L",
      "36W / 32L",
      "38W / 32L",
      "40W / 32L"
    ],
    "colors": [
      {
        "name": "Khaki Beige",
        "hex": "#C2B280"
      },
      {
        "name": "Deep Charcoal",
        "hex": "#262626"
      },
      {
        "name": "Navy Midnight",
        "hex": "#1E293B"
      },
      {
        "name": "Military Olive",
        "hex": "#556B2F"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": true,
    "material": "98% Combed Cotton, 2% Spandex",
    "rating": 4.9,
    "reviewCount": 88
  },
  {
    "id": "pt-02",
    "name": "Selvedge Raw Indigo Tapered Jeans",
    "sku": "FN-PT-JN02",
    "category": "pants",
    "subcategory": "Jeans",
    "price": 4999,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "13.5oz authentic selvedge denim woven on vintage shuttle looms.",
    "description": "Raw, unwashed indigo denim designed to form unique honeycombs and fades personalized to your body over time. Finished with classic red selvedge id line along the outseam—cuff them to show the pedigree.",
    "features": [
      "13.5 oz heavy-duty ring-spun raw cotton denim",
      "Red-line selvedge outseam tape",
      "Solid copper rivet reinforcements",
      "Heavy-duty leather back patch stamped with Farnova crest"
    ],
    "sizes": [
      "30W",
      "32W",
      "34W",
      "36W",
      "38W"
    ],
    "colors": [
      {
        "name": "Deep Raw Indigo",
        "hex": "#1A237E"
      },
      {
        "name": "Washed Charcoal Slate",
        "hex": "#374151"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": true,
    "isNewArrival": false,
    "material": "100% Ring-Spun Cotton Selvedge Denim",
    "rating": 4.8,
    "reviewCount": 52
  },
  {
    "id": "pt-03",
    "name": "Milan Pleated Formal Dress Trousers",
    "sku": "FN-PT-TR03",
    "category": "pants",
    "subcategory": "Formal Trousers",
    "price": 4799,
    "originalPrice": 5499,
    "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Single-forward pleat with side tab adjusters in premium poly-viscose blend.",
    "description": "Sartorial luxury inspired by Savile Row. Featuring elegant side-tab buckle adjusters (no belt loops required for a sleeker waist profile) and a crisp permanent front crease.",
    "features": [
      "Wrinkle-resistant poly-viscose fabric with soft wool-like hand",
      "Sartorial brass side-buckle waist adjusters",
      "Single reverse pleat for comfortable thigh room",
      "Pre-hemmed with 1.5-inch turn-up cuff"
    ],
    "sizes": [
      "30W",
      "32W",
      "34W",
      "36W",
      "38W"
    ],
    "colors": [
      {
        "name": "Charcoal Melange",
        "hex": "#374151"
      },
      {
        "name": "Midnight Blue",
        "hex": "#0F172A"
      },
      {
        "name": "Stone Grey",
        "hex": "#9CA3AF"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": false,
    "isNewArrival": true,
    "material": "70% Polyester, 28% Viscose, 2% Spandex",
    "rating": 4.9,
    "reviewCount": 34
  },
  {
    "id": "pt-04",
    "name": "Urban Comfort Drawstring Casual Pants",
    "sku": "FN-PT-CS04",
    "category": "pants",
    "subcategory": "Casual Pants",
    "price": 3999,
    "originalPrice": 4799,
    "image": "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80",
    "shortDescription": "Relaxed linen-cotton blend with elasticated waistband and internal drawstring.",
    "description": "The pinnacle of relaxed weekend luxury. Combining the polished look of classic trousers with the effortless lounge ease of sweatpants. Ideal for travel, lounging, or dinner dates.",
    "features": [
      "55% French linen, 45% combed cotton",
      "Elastic waistband with premium metal-tipped drawcord",
      "Concealed zippered security pocket for phone/keys",
      "Clean tapered ankle"
    ],
    "sizes": [
      "S (30-31)",
      "M (32-33)",
      "L (34-35)",
      "XL (36-38)"
    ],
    "colors": [
      {
        "name": "Oatmeal Natural",
        "hex": "#E5DFD3"
      },
      {
        "name": "Washed Black",
        "hex": "#262626"
      },
      {
        "name": "Desert Camel",
        "hex": "#C19A6B"
      }
    ],
    "stockStatus": "In Stock",
    "isFeatured": false,
    "isNewArrival": false,
    "material": "Linen Cotton Blend",
    "rating": 4.8,
    "reviewCount": 26
  }
];
