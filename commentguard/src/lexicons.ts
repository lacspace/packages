// Small STARTER lexicons per category. They are intentionally compact — callers extend
// them via options.lexicons for their own community. Each entry is matched after
// normalization (lowercased, elongations collapsed), against Latin, romanized-Nepali and
// Devanagari text. This is moderation tooling: the goal is to triage, not to be a
// perfect classifier — borderline items are surfaced for human/AI review, not auto-hidden.

export type Category = "spam" | "abuse" | "hate" | "doxxing" | "linkspam";

export const LEXICONS: Record<Category, string[]> = {
  // Promotional / scam spam (en + romanized ne + Devanagari).
  spam: [
    "buy now", "discount", "best price", "loan", "investment", "forex", "crypto",
    "casino", "lottery", "winner", "free money", "earn from home", "work from home",
    "double your money", "guaranteed return", "dm for price", "price kati", "sasto",
    "छुट", "सस्तो", "कमाउनुहोस्", "लगानी", "नि:शुल्क",
    // Finance-scam bait (1.3.0): the phrasing tip-sellers use in trading communities.
    // en
    "guaranteed profit", "guaranteed return", "guaranteed income", "guaranteed call", "profit guaranteed", "sure shot", "sureshot", "sure-shot",
    "100% profit", "100% return", "100% sure", "risk free profit", "risk-free profit", "no loss",
    "paid group", "paid calls", "premium group", "premium calls", "tips group", "vip group", "vip calls",
    "jackpot call", "multibagger", "operator stock", "insider news", "inside news", "dm for calls",
    "dm for tips", "join my group", "monthly income", "daily income", "assured return", "fixed return",
    // romanized ne / hi
    "pakka profit", "pakka munafa", "pakka return", "paisa double", "paise double", "guarantee ho",
    "guaranteed ho", "pakka kamai", "kamai ko mauka", "sure call", "sahi call", "target hit pakka",
    // Devanagari (ne + hi)
    "ग्यारेन्टी", "गारंटी", "गारण्टी", "निश्चित नाफा", "पक्का नाफा", "पक्का मुनाफा", "पक्का मुनाफ़ा",
    "पक्का कमाइ", "पक्की कमाई", "पैसा डबल", "दुगुना पैसा", "दोगुना पैसा", "ज़रूर कमाओ", "जरूर कमाओ",
    "पेड ग्रुप", "प्रिमियम ग्रुप", "टिप्स ग्रुप", "भिआइपी ग्रुप", "वीआईपी ग्रुप", "श्योर शॉट", "सुर सट",
    "मल्टीबैगर", "जैकपॉट कॉल", "बिना जोखिम", "नो लॉस",
  ],
  // Harassment / insults (compact; extend per community).
  abuse: [
    "idiot", "stupid", "shut up", "trash", "loser", "fool", "nonsense",
    "murkha", "bekar", "chor", "मूर्ख", "बेकार", "चोर", "गधा",
    // Hindi + Nepali profanity (1.3.0), Devanagari and romanized. Offensive by nature:
    // this list exists so the words get caught, never shown. Extend per community.
    "chutiya", "chutiye", "bhosdike", "bhosdi", "madarchod", "behenchod", "bhenchod", "gandu", "gaandu",
    "harami", "kamina", "kamine", "kutte", "kutta", "saala", "saale", "bakchod", "randi", "lund", "lauda",
    "muji", "machikne", "machikni", "khate", "bhalu", "jatha", "boka",
    "चूतिया", "चुतिया", "भोसड़ी", "भोसडी", "मादरचोद", "बहनचोद", "भेनचोद", "गांडू", "गान्डु", "हरामी",
    "कमीना", "कमीने", "कुत्ते", "कुत्ता", "साला", "साले", "बकचोद", "रंडी", "रण्डी", "लंड", "लौड़ा",
    "मुजी", "माछिक्ने", "माछिक्नी", "खाते", "भालु", "जाठा", "बोका", "नालायक", "निकम्मा",
  ],
  // Group-targeted hate (compact starter; callers MUST extend responsibly).
  hate: [
    "go back to your country", "subhuman", "vermin",
    "देश छोड", "जात",
  ],
  // Doxxing cue words (combined with the PII regexes below).
  doxxing: ["address is", "lives at", "his number", "her number", "ghar", "ठेगाना", "घर नम्बर"],
  // Link-spam phrasing (combined with URL/shortener detection).
  linkspam: [
    "join whatsapp", "join telegram", "click the link", "link in", "subscribe my",
    "visit my channel", "follow back", "whatsapp group", "telegram group",
    "व्हाट्सएप", "टेलिग्राम", "लिंक",
  ],
};

// PII / link patterns used by the doxxing and linkspam detectors.
export const PATTERNS = {
  phoneNp: /\b9[78]\d{8}\b/g, // Nepali mobile
  // 1.3.0: Indian mobiles (6–9 + 9 digits) and country-code forms (+977 / +91 / 00977 / 0091),
  // with optional spaces, dashes or dots between groups.
  phoneIn: /\b[6-9]\d{9}\b/g,
  phoneIntl: /(?:\+|00)?\s?(?:977|91)[\s.-]?\d{2,5}[\s.-]?\d{2,5}[\s.-]?\d{2,5}\b/g,
  // 1.3.0: scam shapes that need numbers — "earn 50k monthly", "2 lakh per month", "100% profit".
  scamEarn: /\b(?:earn|earning|kamao|kamau|kamaunuhos|kamai|income|profit|return|munafa|nafa)\b[^.\n]{0,24}?\b\d+(?:[.,]\d+)?\s?(?:k|lakh|lac|lakhs|crore|cr|हजार|लाख|करोड|करोड़)\b/giu,
  scamPercent: /\b\d{2,3}\s?%\s?(?:profit|return|returns|sure|guaranteed|accuracy|accurate|munafa|nafa|नाफा|मुनाफा|मुनाफ़ा|रिटर्न|पक्का|श्योर)/giu,
  email: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g,
  url: /\bhttps?:\/\/\S+|\bwww\.\S+|\b[\w-]+\.(?:com|net|org|np|io|co|me|ly|xyz)\b/gi,
  shortener: /\b(?:bit\.ly|tinyurl\.com|t\.me|cutt\.ly|rb\.gy|is\.gd|shorturl)\b/gi,
};
