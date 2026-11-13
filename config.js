/* =====================================================================
   VR ENTERPRISES — WEBSITE SETTINGS & CONTENT
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to update prices, products,
   batch records, certificates, reviews, recipes and announcements.

   How to edit safely:
   • Keep the quotes "..." around text, and the commas between items.
   • Leave a value as "" or null when you don't have it yet — the
     website will show "Price on request" / "Awaiting upload" etc.
     It will never invent anything.
   • After saving, refresh the website to see your change.
   • If the page shows a red "settings file has an error" banner,
     a comma or quote is missing in the line you just edited.
   ===================================================================== */

window.VR_CONFIG = {
  /* ----------------------------------------------------------------
     BUSINESS DETAILS (used for WhatsApp links and structured data)
     ---------------------------------------------------------------- */
  business: {
    name: "VR Enterprises",
    email: "vrenterprises.jammu@gmail.com",
    // Phone numbers: write them any way you like; they are converted
    // to international format (+91…) automatically.
    phones: ["7051052310", "8082840158"],
    // The number that receives WhatsApp enquiries (must have WhatsApp).
    whatsapp: "7051052310",
    // ---- LOCATIONS (shown in Contact with a switchable map) ----
    // Both are on Lane No. 15, opposite Georgian Academy — a short walk apart.
    // • lat / lng: pin position on the map and destination for "Get Directions".
    // • listingName: your Google Maps listing name, searched at that spot so
    //   "View on Google Maps" opens the listing.
    // • googleMapsUrl (optional, exact): Google Maps → your listing → Share → Copy link.
    // • The FIRST location is shown on the map by default.
    // If shop and production unit are the wrong way round, just swap the `label` values.
    locations: [
      {
        id: "shop",
        label: "Shop",
        name: "VR Enterprises – Cold Pressed Oils",
        address: "Lane No. 15, Bantalab Road, opp. Georgian Academy, Thathar, Patoli, Jammu, Jammu and Kashmir 181206",
        plusCode: "QRM5+49 Jammu",
        lat: 32.782813,
        lng: 74.808438,
        listingName: "VR Enterprises – Cold Pressed Oils",
        googleMapsUrl: "",
      },
      {
        id: "production",
        label: "Production Unit",
        name: "VR Enterprises — Manufacturing",
        address: "JMC-BTL-063-109-1022, Lane No. 15, opp. Georgian Academy, Patoli Bantalab, Thathar, Jammu, Jammu and Kashmir 181206",
        plusCode: "",
        lat: 32.782963,
        lng: 74.808105,
        listingName: "VR enterprises",
        googleMapsUrl: "",
      },
    ],
    mapZoom: 17,
    // Google rating as shown on your listing (location id above). Set rating to "" to hide.
    googleReviews: { rating: "5.0", count: 4, asOf: "November 2026", location: "production" },
    // Only fill these when you have the official numbers. Empty = hidden.
    fssaiNumber: "",
    gstin: "",
    // Business hours, e.g. "Mon–Sat, 9:00 AM – 7:00 PM". Empty = hidden.
    hours: "",
    // Real social media profile URLs only. Empty = icon hidden.
    social: {
      instagram: "",
      facebook: "",
      youtube: "",
    },
  },

  /* ----------------------------------------------------------------
     ANNOUNCEMENT BAR (thin strip at the very top of the page)
     ---------------------------------------------------------------- */
  announcement: {
    enabled: false,
    text: "", // e.g. "Now accepting distributor enquiries across J&K and Punjab"
    linkText: "", // e.g. "Enquire now"
    link: "", // e.g. "#distributor"
  },

  /* ----------------------------------------------------------------
     ENQUIRY FORMS — Web3Forms (https://web3forms.com)
     The access key is a PUBLIC form key (safe to be in the page).
     Enquiries are emailed to the address registered with this key.
     ---------------------------------------------------------------- */
  forms: {
    web3formsKey: "325a51db-ba54-4efd-ae73-607efdcd40ae",
    fromName: "VR Enterprises Website",
  },

  /* ----------------------------------------------------------------
     PRODUCTS
     • mrp / price: numbers in rupees, e.g. 120 — or null for
       "Price on request". Do not use the ₹ symbol here.
     • category: "household" | "family" | "bulk"  (used by the filters)
     • image: file name prefix inside assets/img/ (product-<image>-400.webp)
     ---------------------------------------------------------------- */
  products: [
    {
      id: "200ml",
      name: "200 ml Bottle",
      size: "200 ml",
      category: "household",
      image: "200ml",
      tag: "Trial Size",
      mrp: null,
      price: null,
      description:
        "A compact bottle for first-time buyers, small households and travel kitchens.",
      packaging: "Food-grade PET bottle with screw cap",
      idealFor: "Trying VR oil, small households, gifting",
    },
    {
      id: "500ml",
      name: "500 ml Bottle",
      size: "500 ml",
      category: "household",
      image: "500ml",
      tag: "Household Favourite",
      mrp: null,
      price: null,
      description:
        "The everyday kitchen size — for tadka, sabzi, frying and small batches of pickle.",
      packaging: "Food-grade PET bottle with screw cap",
      idealFor: "Everyday home cooking",
    },
    {
      id: "1l",
      name: "1 Litre Bottle",
      size: "1 Litre",
      category: "family",
      image: "1l",
      tag: "Best Seller",
      mrp: null,
      price: null,
      description:
        "Our most practical family size, with a carry handle for easy pouring.",
      packaging: "Food-grade PET bottle with handle",
      idealFor: "Families and regular home cooking",
    },
    {
      id: "2l",
      name: "2 Litre Bottle",
      size: "2 Litre",
      category: "family",
      image: "2l",
      tag: "Family Pack",
      mrp: null,
      price: null,
      description:
        "A larger bottle for joint families and kitchens that cook with mustard oil every day.",
      packaging: "Food-grade PET bottle with handle",
      idealFor: "Joint families, seasonal pickle making",
    },
    {
      id: "5l",
      name: "5 Litre Jar",
      size: "5 Litre",
      category: "bulk",
      image: "5l",
      tag: "Kitchen Pack",
      mrp: null,
      price: null,
      description:
        "A sturdy jar for large households, dhabas, caterers and small restaurants.",
      packaging: "Jar with integrated carry handle",
      idealFor: "Restaurants, caterers, large households",
    },
    {
      id: "pack-5x1l",
      name: "Pack of 5 × 1 Litre Bottles",
      size: "1 Litre × 5 Bottles",
      category: "bulk",
      image: "pack-5x1l",
      tag: "Value Carton",
      mrp: null,
      price: null,
      description:
        "Five 1 Litre bottles in one printed carton — convenient for retailers, monthly stocking and bulk buyers.",
      packaging: "Printed carton containing 5 × 1 Litre PET bottles",
      idealFor: "Retail shelves, monthly household stock, bulk buyers",
    },
  ],

  // Information common to every product (shown in the details popup).
  productInfo: {
    ingredients: "Cold pressed black mustard oil (100%)",
    allergens: "Contains mustard.",
    additives: "No added preservatives, colours or flavours",
    shelfLife: "", // e.g. "9 months from manufacturing" — empty = "As printed on the label"
    storage:
      "Store in a cool, dry place away from direct sunlight. Keep the cap tightly closed after use.",
  },

  /* ----------------------------------------------------------------
     100% MUSTARD OIL COMPOSITION & PURITY LEVEL section
     ----------------------------------------------------------------
     verified: false → every value is shown with a "Sample" tag and the
       banner "Sample Values – Pending Laboratory Verification".
     When you receive your laboratory report:
       1. Replace each `value` with the real result.
       2. Fill in labReport (lab name, report number, date, file).
       3. Set verified: true.
     Parameter types:
       "max"    → result must be at or below `limit`
       "range"  → result must be between `min` and `max`
       "absent" → qualitative test, e.g. "Not detected" / "Negative"
       "info"   → shown without a gauge
     Reference limits below are from the FSSAI Food Products Standards
     for mustard/rapeseed oil. Ask your laboratory to confirm them.
     ---------------------------------------------------------------- */
  purity: {
    verified: false,
    sampleNotice: "Sample Values – Pending Laboratory Verification",
    parameters: [
      { name: "Acid value", unit: "mg KOH/g", type: "max", limit: 6.0, value: 1.8, icon: "flask-vial" },
      { name: "Iodine value", unit: "Wijs", type: "range", min: 96, max: 112, value: 104, icon: "droplet" },
      { name: "Saponification value", unit: "mg KOH/g", type: "range", min: 168, max: 177, value: 173, icon: "flask-vial" },
      { name: "Unsaponifiable matter", unit: "% by weight", type: "max", limit: 1.2, value: 0.8, icon: "filter" },
      { name: "Allyl isothiocyanate (natural pungency)", unit: "% by weight", type: "info", value: 0.42, reference: "Kachi ghani limit to be confirmed by laboratory", icon: "seedling" },
      { name: "Argemone oil", type: "absent", value: "Not detected", reference: "Must be absent", icon: "ban" },
      { name: "Mineral oil", type: "absent", value: "Not detected", reference: "Must be absent", icon: "ban" },
      { name: "Polybromide test", type: "absent", value: "Negative", reference: "Must be negative", icon: "list-check" },
    ],
    // Filled in after testing. file: path to the PDF/image, e.g. "assets/reports/lab-report-2026.pdf"
    labReport: { lab: "", reportNumber: "", date: "", file: "" },
  },

  /* ----------------------------------------------------------------
     BATCH RECORDS — shown by the "Trace your batch" lookup.
     Add one entry per production batch. Only publish genuine data.
     Dates: "YYYY-MM-DD".  report: path to an uploaded PDF/image, or "".

     Example (copy, fill in, and remove the // at the start of lines):
     {
       batch: "VR-2611-01",
       product: "1 Litre Bottle",
       mfgDate: "2026-11-01",
       bestBefore: "2027-08-01",
       status: "Released after inspection",
       lab: "Name of testing laboratory",
       report: "assets/reports/VR-2611-01.pdf",
       tests: [
         { parameter: "Moisture & volatile matter", result: "…", limit: "…" },
         { parameter: "Acid value", result: "…", limit: "…" },
       ],
     },
     ---------------------------------------------------------------- */
  batches: [],

  /* ----------------------------------------------------------------
     CERTIFICATES & DOCUMENTS
     status: "available"  → document file uploaded and checked by you
             "awaiting"   → shown as "Awaiting upload" (no file shown)
     file:   path to the uploaded image or PDF, e.g. "assets/certificates/fssai.pdf"
     Never mark a document "available" unless it is genuine and current.
     ---------------------------------------------------------------- */
  certificates: [
    {
      id: "fssai",
      title: "FSSAI Licence",
      issuer: "Food Safety and Standards Authority of India",
      number: "",
      validUntil: "",
      status: "awaiting",
      file: "",
    },
    {
      id: "manufacturing",
      title: "Manufacturing Licence / Registration",
      issuer: "Issuing authority to be added",
      number: "",
      validUntil: "",
      status: "awaiting",
      file: "",
    },
    {
      id: "lab-report",
      title: "Laboratory Test Report",
      issuer: "Testing laboratory to be added",
      number: "",
      validUntil: "",
      status: "awaiting",
      file: "",
    },
    {
      id: "quality",
      title: "Quality Certification",
      issuer: "Only if officially certified",
      number: "",
      validUntil: "",
      status: "awaiting",
      file: "",
    },
  ],

  /* ----------------------------------------------------------------
     CUSTOMER REVIEWS — genuine reviews only, with the customer's
     permission. Set verified: true ONLY if you confirmed the purchase.
     photo: path to an image the customer allowed you to use, or "".

     Example:
     { name: "Customer name", city: "Jammu", date: "2026-11-01",
       text: "Their own words…", verified: true, photo: "" },
     ---------------------------------------------------------------- */
  testimonials: [],

  /* ----------------------------------------------------------------
     RECIPES & KNOWLEDGE ARTICLES
     category: "recipe" | "pickle" | "regional" | "guide"
     Recipes use ingredients/steps/tips. Guides use sections.
     image: path to an image, or "" for a styled card.
     ---------------------------------------------------------------- */
  recipes: [
    {
      id: "aloo-dum",
      category: "recipe",
      label: "Everyday Classic",
      title: "Aloo Dum in Mustard Oil",
      image: "assets/img/recipe-aloo.webp",
      summary:
        "Baby potatoes simmered in a spiced tomato-onion masala, with mustard oil for frying and tempering.",
      time: "35 minutes",
      serves: "4",
      ingredients: [
        "500 g baby potatoes, boiled and peeled",
        "3 tbsp VR Cold Pressed Black Mustard Oil",
        "1 tsp cumin seeds",
        "1 bay leaf",
        "1 onion, finely chopped",
        "1 tbsp ginger-garlic paste",
        "2 tomatoes, pureed",
        "1 tsp turmeric powder",
        "1 tsp Kashmiri red chilli powder",
        "1 tsp coriander powder",
        "½ tsp garam masala",
        "Salt to taste",
        "Fresh coriander to garnish",
      ],
      steps: [
        "Prick the boiled potatoes with a fork so the masala soaks in.",
        "Heat the mustard oil in a kadhai until it just begins to smoke, then lower the heat and let it cool for a minute.",
        "Fry the potatoes until lightly golden. Remove and keep aside.",
        "In the same oil add cumin seeds and the bay leaf. When they crackle, add the onion and cook until golden.",
        "Add ginger-garlic paste and cook for 1–2 minutes until the raw smell goes.",
        "Add tomato puree, turmeric, chilli and coriander powder and salt. Cook until the oil separates from the masala.",
        "Return the potatoes, add ½ cup water, cover and simmer on low heat for 8–10 minutes.",
        "Finish with garam masala and fresh coriander. Serve with puri, paratha or rice.",
      ],
      tips: [
        "Heating mustard oil to its smoking point and cooling slightly mellows its sharp pungency — a traditional step in North Indian and Bengali kitchens.",
        "Kashmiri chilli gives colour without too much heat.",
      ],
    },
    {
      id: "mango-pickle",
      category: "pickle",
      label: "Pickle",
      title: "Aam ka Achar (Raw Mango Pickle)",
      image: "assets/img/recipe-mango-pickle.webp",
      imageCredit: {
        text: "Photo: Jagisnowjughead, CC BY-SA 4.0, via Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Mango_pickle_from_Bihar.JPG",
      },
      summary:
        "The classic North Indian mango pickle, with mustard oil as its traditional base.",
      time: "45 minutes + 4–5 days curing",
      serves: "One 1 kg jar",
      ingredients: [
        "1 kg firm raw mangoes, cut into pieces (with or without stone)",
        "250–300 ml VR Cold Pressed Black Mustard Oil",
        "4 tbsp salt",
        "2 tbsp red chilli powder",
        "1 tbsp turmeric powder",
        "3 tbsp split mustard seeds (rai kuria)",
        "2 tbsp fennel seeds (saunf), coarsely crushed",
        "1 tbsp fenugreek seeds (methi), coarsely crushed",
        "1 tsp nigella seeds (kalonji)",
        "½ tsp asafoetida (hing)",
      ],
      steps: [
        "Wash the mangoes and dry them completely. Cut into pieces and spread on a clean cloth for 2–3 hours — there must be no moisture.",
        "Toss the pieces with salt and turmeric. Leave covered for a few hours; drain any liquid that collects.",
        "Heat the mustard oil until it smokes lightly, switch off the heat and let it cool completely.",
        "Mix the chilli powder, split mustard, fennel, fenugreek, nigella and asafoetida with the mango pieces.",
        "Pour in about half the cooled oil and mix well. Pack into a clean, completely dry glass or ceramic jar.",
        "Pour the remaining oil on top so the mango pieces are fully covered.",
        "Keep the jar in sunlight for 4–5 days, shaking or stirring with a dry spoon each day.",
        "The pickle is ready when the mango pieces soften and the oil rises to the top.",
      ],
      tips: [
        "Water is the enemy of pickles — keep the jar, spoons and mangoes completely dry.",
        "Always keep a layer of oil above the pickle and use a dry spoon to serve.",
      ],
    },
    {
      id: "hari-mirch-achar",
      category: "pickle",
      label: "Quick Pickle",
      title: "Hari Mirch ka Achar (Green Chilli Pickle)",
      image: "assets/img/recipe-chilli-pickle.webp",
      imageCredit: {
        text: "Photo: Nidhii Rawat, CC BY-SA 4.0, via Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Green_chilly_pickle.jpg",
      },
      summary:
        "A quick, tangy green chilli pickle that is ready to eat in two days.",
      time: "20 minutes + 2 days",
      serves: "One small jar",
      ingredients: [
        "250 g thick green chillies, slit lengthwise",
        "100 ml VR Cold Pressed Black Mustard Oil",
        "2 tbsp split mustard seeds (rai kuria)",
        "1 tbsp fennel seeds, crushed",
        "1 tsp fenugreek seeds, crushed",
        "1 tsp turmeric powder",
        "1½ tbsp salt",
        "¼ tsp asafoetida",
        "2–3 tbsp lemon juice",
      ],
      steps: [
        "Wash the chillies and dry them completely on a cloth.",
        "Heat the mustard oil until it smokes lightly, then cool until just warm.",
        "Mix all the spices, salt and lemon juice into a coarse paste with 2 tbsp of the oil.",
        "Stuff the paste into the slit chillies, or simply toss everything together.",
        "Transfer to a dry glass jar and pour the remaining oil over.",
        "Leave at room temperature for 2 days, stirring once a day with a dry spoon.",
      ],
      tips: [
        "Use thick, less-spicy chillies (achari mirch) for the best texture.",
        "Refrigerate after opening if your kitchen is warm and humid.",
      ],
    },
    {
      id: "kashmiri-haak",
      category: "regional",
      label: "Jammu & Kashmir",
      title: "Kashmiri Haak",
      image: "assets/img/recipe-haak.webp",
      imageCredit: {
        text: "Photo of haak (collard) plants: شارق کشمیری, CC BY-SA 4.0, via Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Collard_Plants.jpg",
      },
      summary:
        "A simple, everyday Kashmiri dish of collard greens cooked in mustard oil with whole red chillies and hing.",
      time: "25 minutes",
      serves: "3–4",
      ingredients: [
        "500 g haak (collard greens), washed",
        "2 tbsp VR Cold Pressed Black Mustard Oil",
        "2–3 whole dried red chillies",
        "2 green chillies, slit",
        "A pinch of asafoetida (hing)",
        "Salt to taste",
        "1½ cups water",
      ],
      steps: [
        "Trim the hard ends of the stems and keep the leaves whole or cut into halves.",
        "Heat the mustard oil in a pot until it smokes lightly, then lower the heat.",
        "Add the dried red chillies and asafoetida and let them sizzle for a few seconds.",
        "Add the water, salt and green chillies and bring to a boil.",
        "Add the greens, cover and cook on medium heat for 10–15 minutes until tender but still green.",
        "Serve hot with steamed rice.",
      ],
      tips: [
        "Traditional haak is lightly spiced so the flavour of the greens and the mustard oil comes through.",
      ],
    },
    {
      id: "sarson-saag",
      category: "regional",
      label: "Punjab",
      title: "Sarson da Saag",
      image: "assets/img/recipe-sarson-saag.webp",
      imageCredit: {
        text: "Photo: Biswarup Ganguly, CC BY 3.0, via Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Sarson_Ka_Saag_-_Mohali_2016-08-06_8227.JPG",
      },
      summary:
        "The winter classic of Punjab — slow-cooked mustard greens finished with a garlic and chilli tadka.",
      time: "1 hour 15 minutes",
      serves: "4–5",
      ingredients: [
        "500 g mustard greens (sarson), chopped",
        "250 g spinach (palak), chopped",
        "100 g bathua or radish greens (optional)",
        "2 green chillies and a 1-inch piece of ginger",
        "2 tbsp maize flour (makki ka atta)",
        "Salt to taste",
        "For the tadka: 3 tbsp VR Cold Pressed Black Mustard Oil, 1 onion, 6–8 garlic cloves, 1 tomato (optional), 1 tsp red chilli powder",
      ],
      steps: [
        "Pressure cook or simmer the greens with ginger, green chillies, salt and 1 cup water until very soft (about 30–40 minutes on the stove).",
        "Cool slightly and mash with a wooden masher (ghotna) or pulse coarsely.",
        "Return to the heat, whisk in the maize flour and simmer on low for 15–20 minutes, stirring often.",
        "For the tadka, heat the mustard oil until it smokes lightly. Add chopped garlic and onion and fry until golden; add tomato and chilli powder if using.",
        "Pour the tadka over the saag, stir and simmer for 5 more minutes.",
        "Serve with makki di roti, a little white butter and jaggery.",
      ],
      tips: [
        "Saag tastes even better the next day once the flavours settle.",
      ],
    },
    {
      id: "shorshe-maach",
      category: "regional",
      label: "Bengal",
      title: "Shorshe Maach (Fish in Mustard Gravy)",
      image: "assets/img/recipe-shorshe-maach.webp",
      imageCredit: {
        text: "Photo: Pkd2512, CC BY-SA 4.0, via Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Catla_fish_in_mustard_curry_-_Kolkata_-_West_Bengal.jpg",
      },
      summary:
        "Bengal's best-loved fish curry, where mustard oil and mustard paste carry the whole dish.",
      time: "40 minutes",
      serves: "4",
      ingredients: [
        "500 g rohu or hilsa steaks",
        "1 tsp turmeric and salt, to marinate",
        "4 tbsp VR Cold Pressed Black Mustard Oil (plus 1 tsp to finish)",
        "3 tbsp black/yellow mustard seeds, soaked 30 minutes",
        "3–4 green chillies",
        "½ tsp nigella seeds (kalonji)",
        "Salt to taste",
      ],
      steps: [
        "Rub the fish with turmeric and salt and rest for 15 minutes.",
        "Grind the soaked mustard seeds with 2 green chillies, a pinch of salt and a little water to a smooth paste.",
        "Heat the mustard oil until it smokes lightly. Fry the fish lightly on both sides and set aside.",
        "In the same oil add nigella seeds and slit green chillies.",
        "Add the mustard paste mixed with ½ cup water and a pinch of turmeric. Simmer gently for 3–4 minutes — do not boil hard.",
        "Add the fish, cover and cook on low heat for 5–6 minutes.",
        "Finish with a teaspoon of raw mustard oil and serve with steamed rice.",
      ],
      tips: [
        "Grinding mustard with a pinch of salt and green chilli helps prevent bitterness.",
      ],
    },
    {
      id: "cooking-with-mustard-oil",
      category: "guide",
      label: "Kitchen Guide",
      title: "Cooking with Mustard Oil: Tadka, Frying & More",
      image: "assets/img/panel-cooking.webp",
      summary:
        "How Indian kitchens traditionally use mustard oil — and a few simple techniques to get the best flavour.",
      time: "4 min read",
      sections: [
        {
          heading: "Heat, then cool slightly",
          text: "Many North Indian and Bengali cooks heat mustard oil until it just starts to smoke, then let it cool for a minute before adding spices. This mellows the oil's sharp, pungent edge while keeping its characteristic aroma.",
        },
        {
          heading: "Tadka (tempering)",
          text: "Mustard oil carries the aroma of whole spices beautifully. Add cumin, mustard seeds, dried red chillies, hing or curry leaves to hot oil and pour over dals, raitas and chutneys.",
        },
        {
          heading: "Sabzi, curries and frying",
          text: "It is the everyday cooking oil across Punjab, Jammu & Kashmir, Uttar Pradesh, Bihar, Bengal and Odisha — for sabzis, meat and fish curries, pakoras and puris.",
        },
        {
          heading: "Pickles (achar)",
          text: "Mustard oil is the traditional base of North Indian pickles. Keep pickles fully covered with oil and always use a dry spoon.",
        },
        {
          heading: "Raw as a finishing oil",
          text: "In Bengali cooking a few drops of raw mustard oil finish dishes like aloo bhorta and shorshe maach. Use it sparingly — its flavour is strong.",
        },
      ],
    },
    {
      id: "why-cold-pressed",
      category: "guide",
      label: "Knowledge",
      title: "Cold Pressed vs Refined: What's the Difference?",
      image: "assets/img/panel-press.webp",
      summary:
        "What 'cold pressed' and 'kachi ghani' actually mean, and how they differ from refined oil.",
      time: "3 min read",
      sections: [
        {
          heading: "Cold pressed / kachi ghani",
          text: "Cold-pressed oil is extracted by mechanically pressing the seeds without applying external heat. In mustard oil, this traditional first pressing is known as kachi ghani. The oil keeps the natural colour, aroma and pungency of the seed.",
        },
        {
          heading: "Refined oil",
          text: "Refined oils are typically extracted at higher temperatures or with solvents and then bleached and deodorised. The result is a neutral-tasting, pale oil — without the character mustard oil is loved for.",
        },
        {
          heading: "Why it matters in the kitchen",
          text: "The strong aroma and sharp taste of cold-pressed mustard oil is what gives pickles, tadkas and regional dishes their authentic flavour.",
        },
        {
          heading: "Natural cloudiness",
          text: "Cold-pressed oil may look slightly cloudy or thicken in very cold weather. This is natural; it clears at room temperature.",
        },
      ],
    },
    {
      id: "storage-guide",
      category: "guide",
      label: "Storage Guide",
      title: "How to Store Mustard Oil and Pickles",
      image: "assets/img/panel-lineup.webp",
      summary:
        "Simple storage habits that keep mustard oil and oil-based pickles fresh for longer.",
      time: "2 min read",
      sections: [
        {
          heading: "Keep it cool and dark",
          text: "Store bottles away from the stove, direct sunlight and heat. A closed kitchen cabinet is ideal.",
        },
        {
          heading: "Close the cap tightly",
          text: "Air and moisture speed up spoilage. Close the cap after every use and keep the bottle dry.",
        },
        {
          heading: "Check the label",
          text: "Every pack carries a batch number, manufacturing date and best-before information. Use the oil within the best-before period.",
        },
        {
          heading: "Don't reuse frying oil repeatedly",
          text: "Oil that has been heated many times darkens and develops off-flavours. Use fresh oil for best taste.",
        },
        {
          heading: "Pickles",
          text: "Use clean, completely dry jars and spoons, and keep a layer of oil above the pickle. Discard any pickle that shows mould or an off smell.",
        },
      ],
    },
  ],
};
