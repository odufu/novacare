export const INITIAL_PRODUCTS_DATA = [
  {
    id: "grazer",
    name: "Grazer Herbal Detox Tea",
    category: "Digestive & Liver Detox",
    tagline: "Flush Belly Fat & Cleanse Your Liver in 14 Days",
    nafdac: "A7-1025L",
    price: 20000,
    image: "assets/products/grazer.png",
    benefits: [
      "Flushes out stubborn abdominal belly fat",
      "Reduces chronic upper abdominal bloating",
      "Restores liver function and filters toxins",
      "Resets digestion and metabolic clearance"
    ],
    description: "Grazer Herbal Detox Tea is an ancient organic remedy formulated specifically to support individuals dealing with an overloaded or fatty liver. It targets visceral abdominal fat accumulation, eases digestive heaviness, and encourages complete metabolic clearance.",
    ingredients: [
      { name: "Annona Muricata (Soursop) (20%)", purpose: "Anti-oxidant, cellular protection" },
      { name: "Garcinia Kola (Bitter Kola) (10%)", purpose: "Liver detoxification, metabolism booster" },
      { name: "Pyrus Communis (Common Pear) (10%)", purpose: "Soluble fibers, kidney support" },
      { name: "Cassia Angustifolia (Senna) (10%)", purpose: "Digestive transit motility support" },
      { name: "Prunus Dulcis (Almond) (10%)", purpose: "Mineral replenishment, healthy lipids" },
      { name: "Aframomum Melegueta (Alligator Pepper) (10%)", purpose: "Thermogenic fat burning" },
      { name: "Allium Sativum (Garlic) (10%)", purpose: "Circulation, arterial plaque defense" },
      { name: "Taraxacum Officinale (Dandelion) (5%)", purpose: "Bile stimulation, diuretic filters" },
      { name: "Zingiber Officinale (Ginger) (5%)", purpose: "Anti-bloating, digestive carrier" },
      { name: "Cynara Cardunculus (Artichoke) (5%)", purpose: "Liver cell protection & regeneration" },
      { name: "Silybum Marianum (Milk Thistle) (5%)", purpose: "Silymarin source, liver filtering shield" }
    ],
    directions: "Steep one teabag into a teacup of hot water and drink it first thing in the morning.",
    warnings: "Limit junk food intake, limit late-night eating, and limit alcohol consumption. Store in a cool, dry place below 30°C, and store out of the reach of children.",
    reviews: [
      { author: "Chijioke A.", location: "Enugu", rating: 5, comment: "Amazing tea. My heavy bloating was gone within a week and my belly looks noticeably flatter.", date: "2026-06-20" },
      { author: "Halima Y.", location: "Kano", rating: 5, comment: "I feel so light in the mornings. This is the real deal for liver detox. Highly recommended!", date: "2026-07-03" }
    ]
  },
  {
    id: "novavital",
    name: "Novavital Booster",
    category: "Immune & Vitality",
    tagline: "Natural Daily Immune Support & Energy Enhancer",
    nafdac: "A7-1002L",
    price: 15000,
    image: "assets/products/novavital.png",
    benefits: [
      "Boosts general immune system defense",
      "Increases daily energy levels & stamina",
      "Rich in natural antioxidants",
      "Promotes mental clarity & focus"
    ],
    description: "Novavital Booster is a premium wellness capsule meticulously blended from pure organic adaptogens and herbal extracts. Designed to support modern busy lifestyles, it strengthens the body's natural defense systems, combats chronic fatigue, and restores natural energy without jitters or crashes.",
    ingredients: [
      { name: "Moringa Oleifera (70%)", purpose: "Nutrient density, immune stimulation" },
      { name: "Panax Ginseng Extract (20%)", purpose: "Energy, stress adaptations, focus" },
      { name: "Zingiber Officinale (10%)", purpose: "Digestive carrier, anti-inflammatory booster" }
    ],
    directions: "Take 1 to 2 capsules daily with water after meals. Do not exceed the recommended dose.",
    warnings: "Keep out of reach of children. Consult your doctor if pregnant, nursing, or on regular medications.",
    reviews: [
      { author: "Chinedu O.", location: "Enugu", rating: 5, comment: "I feel very active throughout the day since I started taking Novavital. Strongly recommended!", date: "2026-06-15" },
      { author: "Funmi A.", location: "Lagos", rating: 4, comment: "Excellent energy levels. No afternoon crashes. Best herbal product I've bought this year.", date: "2026-06-28" }
    ]
  },
  {
    id: "novadigest",
    name: "Novadigest Tea",
    category: "Digestive Health",
    tagline: "Soothes Bloating, Gas, and Enhances Gut Health",
    nafdac: "A7-1005L",
    price: 12500,
    image: "assets/products/novadigest.png",
    benefits: [
      "Relieves abdominal bloating and gas",
      "Supports gentle colon cleansing",
      "Enhances natural nutrient absorption",
      "Soothes stomach acidity & discomfort"
    ],
    description: "Novadigest Tea is a soothing botanical infusion crafted to restore balance in the gastrointestinal system. Combining digestive-stimulating leaves and calming roots, it relieves heaviness after meals, detoxifies the colon gently, and optimizes your gut microbiome for overall wellness.",
    ingredients: [
      { name: "Senna Leaves (40%)", purpose: "Gentle bowel motility support" },
      { name: "Mentha Piperita (30%)", purpose: "Anti-spasmodic, anti-gas, cooling agent" },
      { name: "Cymbopogon Citratus (30%)", purpose: "Anti-inflammatory, rich herbal aroma" }
    ],
    directions: "Infuse one tea bag in a cup of hot water for 5-7 minutes. Drink warm, preferably in the evening before bed.",
    warnings: "Do not use continuously for more than 7 days without break. Avoid if experiencing diarrhea or severe abdominal pain.",
    reviews: [
      { author: "Emeka I.", location: "Port Harcourt", rating: 5, comment: "My bloating issue is completely gone. I take it every other night, very gentle and effective.", date: "2026-05-19" },
      { author: "Amina Y.", location: "Abuja", rating: 5, comment: "The taste is lovely and it works overnight. Woke up feeling very light.", date: "2026-06-10" }
    ]
  },
  {
    id: "novacardio",
    name: "Novacardio Tonic",
    category: "Cardiovascular Support",
    tagline: "Supports Circulation & Healthy Blood Pressure",
    nafdac: "A7-1008L",
    price: 18000,
    image: "assets/products/novacardio.png",
    benefits: [
      "Supports healthy blood circulation",
      "Helps maintain optimal blood pressure levels",
      "Strengthens cardiovascular muscles",
      "Reduces physical fatigue & shortness of breath"
    ],
    description: "Novacardio Tonic is a premium fluid extract containing concentrated active bioflavonoids derived from hawthorn berry and organic garlic. It acts as a powerful cardiotonic that improves arterial elasticity, reduces oxidative stress in the circulatory system, and supports optimal heart longevity.",
    ingredients: [
      { name: "Hawthorn Berry Extract (50%)", purpose: "Myocardial strength, blood vessel health" },
      { name: "Allium Sativum Concentrate (30%)", purpose: "Cholesterol balance, blood fluidity" },
      { name: "Hibiscus Sabdariffa (20%)", purpose: "Mild diuretic, pressure relief support" }
    ],
    directions: "Take 15-20 drops diluted in half a glass of warm water, twice daily, or follow your practitioner's advice.",
    warnings: "Not suitable for children. If you are taking prescription blood thinners, consult your physician before use.",
    reviews: [
      { author: "Baba Tunde", location: "Ibadan", rating: 5, comment: "My doctor noticed my blood pressure is much more stable now. Excellent formulation.", date: "2026-06-02" },
      { author: "Chioma E.", location: "Asaba", rating: 4, comment: "Bought this for my mother. She reports feeling much stronger with fewer palpitations.", date: "2026-07-04" }
    ]
  },
  {
    id: "novaglyco",
    name: "Novaglyco Balance",
    category: "Metabolic Health",
    tagline: "Regulates Blood Sugar & Metabolic Energy Levels",
    nafdac: "A7-1012L",
    price: 16500,
    image: "assets/products/novaglyco.png",
    benefits: [
      "Maintains balanced glucose levels",
      "Reduces sugar cravings and insulin spikes",
      "Improves metabolic energy conversion",
      "Protects organs from oxidative sugar damage"
    ],
    description: "Novaglyco Balance is a scientific formulation of bitter gourd, cinnamon bark, and Gymnema Sylvestre. These herbs work synergistically to support insulin sensitivity, help cellular glucose uptake, and suppress sweet taste receptors, aiding in the natural management of healthy blood sugar.",
    ingredients: [
      { name: "Gymnema Sylvestre (40%)", purpose: "Block sugar absorption, insulin support" },
      { name: "Momordica Charantia (30%)", purpose: "Natural insulin-like action" },
      { name: "Cinnamomum Verum (30%)", purpose: "Glycemic control, cellular sensitivity" }
    ],
    directions: "Take 1 capsule 30 minutes before breakfast and 1 capsule before dinner.",
    warnings: "Monitor blood glucose levels regularly. If experiencing symptoms of low blood sugar, discontinue or consult your doctor.",
    reviews: [
      { author: "Ibrahim K.", location: "Kaduna", rating: 5, comment: "Really controls my sugar levels and stops my constant cravings. Very satisfied.", date: "2026-06-25" },
      { author: "Ezenwa U.", location: "Onitsha", rating: 5, comment: "Exceptional purity. My laboratory readings are the best they have been in two years.", date: "2026-07-05" }
    ]
  },
  {
    id: "novaflex",
    name: "Novaflex Joint Relief",
    category: "Bone & Joint",
    tagline: "Relieves Arthritis, Muscle Soreness & Joint Inflammation",
    nafdac: "A7-1015L",
    price: 14000,
    image: "assets/products/novaflex.png",
    benefits: [
      "Reduces joint inflammation & swelling",
      "Relieves arthritis pain and stiffness",
      "Promotes cartilage repair & flexibility",
      "Fast-acting topical and systemic relief"
    ],
    description: "Novaflex Joint Relief is a targeted treatment formulated from premium botanical concentrates known for anti-arthritic properties. It assists in maintaining joint mobility, soothing cartilage wear, and relieving acute muscular aches, returning ease and range of motion to your limbs.",
    ingredients: [
      { name: "Zingiber Officinale Concentrate (40%)", purpose: "Blocks inflammatory pathways" },
      { name: "Curcuma Longa Extract (40%)", purpose: "Powerful natural pain relief, cell defense" },
      { name: "Boswellia Serrata (20%)", purpose: "Joint integrity, connective tissue support" }
    ],
    directions: "Take 1 capsule twice daily after meals. For topical balm, massage gently over affected joints until absorbed.",
    warnings: "Do not exceed the recommended dose. Not recommended for children under 12 years.",
    reviews: [
      { author: "Mrs. Okon", location: "Calabar", rating: 5, comment: "My knee pain has reduced by 80%. I can walk comfortably again without walking sticks.", date: "2026-05-30" },
      { author: "Sani G.", location: "Zaria", rating: 5, comment: "Very fast relief. I use this after my daily farm work, keeps my joints feeling fresh.", date: "2026-06-18" }
    ]
  },
  {
    id: "novasleep",
    name: "Novasleep Elixir",
    category: "Relaxation & Sleep",
    tagline: "Promotes Deep Restful Sleep & Relieves Anxiety",
    nafdac: "A7-1019L",
    price: 13000,
    image: "assets/products/novasleep.png",
    benefits: [
      "Shortens time to fall asleep naturally",
      "Improves deep, restorative sleep cycles",
      "Calms nervous system and reduces anxiety",
      "Wake up refreshed without morning drowsiness"
    ],
    description: "Novasleep Elixir is a calming, non-habit forming fluid sleep aid. Infused with nervine relaxants, it helps quieten a busy mind at bedtime, reduces muscle tension, and supports optimal sleep stages, allowing you to wake up fully energized and mentally sharp.",
    ingredients: [
      { name: "Passiflora Incarnata Extract (50%)", purpose: "Calms brain activity, induces drowsiness" },
      { name: "Valeriana Officinalis (30%)", purpose: "Sedative effects, muscular relaxation" },
      { name: "Chamomilla Recutita (20%)", purpose: "Soothes digestion, mild sedative carrier" }
    ],
    directions: "Take 1 to 2 tablespoons diluted in a warm glass of water or herbal tea 30 minutes before bedtime.",
    warnings: "Causes drowsiness. Do not drive, operate heavy machinery, or perform tasks requiring alertness after consumption.",
    reviews: [
      { author: "Adebayo S.", location: "Lekki, Lagos", rating: 5, comment: "Incredible sleep quality. I used to wake up 4 times a night, now I sleep through.", date: "2026-06-20" },
      { author: "Victoria P.", location: "Benin City", rating: 4, comment: "Very soothing. Smells natural and really calms my evening anxiety.", date: "2026-07-03" }
    ]
  }
];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

export const REVIEWS_POOL = [
  "Excellent response. Pay on delivery is highly convenient. Best herbal product.",
  "NAFDAC seal is printed clearly on the bottle. Purity is 100%. Highly recommended!",
  "Deliver was extremely fast. Received it in my shop in Kaduna within 48 hours.",
  "The content matches the description perfectly. Truly high-grade medicinal grade."
];
