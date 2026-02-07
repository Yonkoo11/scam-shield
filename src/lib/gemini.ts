import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScamAnalysis, URLAnalysis } from "@/types/analysis";
import { SCAM_ANALYSIS_SYSTEM_PROMPT, TEXT_ANALYSIS_PROMPT, IMAGE_ANALYSIS_PROMPT } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// Ensures all ScamAnalysis fields have safe defaults so partial API responses don't crash the UI
function withDefaults(partial: Record<string, unknown>): ScamAnalysis {
  const defaults: ScamAnalysis = {
    verdict: "SUSPICIOUS",
    confidence: 50,
    scamType: null,
    tactics: [],
    redFlags: [],
    explanation: "",
    recommendedActions: [],
    similarScamsCount: 0,
    sophisticationLevel: "MEDIUM",
    targetDemographic: "General public",
    psychologicalTactics: [],
    languageAnalysis: {
      registerShifts: null,
      emotionalManipulation: [],
      urgencyIndicators: [],
      aiGeneratedSignals: null,
    },
    riskBreakdown: { financial: 0, identity: 0, emotional: 0, reputational: 0 },
    whatMakesItConvincing: "",
    realWorldExample: "",
    verificationSteps: [],
    urlsFound: [],
  };
  return { ...defaults, ...(partial as Partial<ScamAnalysis>) };
}

// Extract and analyze URLs from message content
function extractUrls(content: string): URLAnalysis[] {
  // Match both http(s) URLs and bare domain URLs (e.g. pay-cityparking-fine.com/verify)
  const httpMatches = content.match(/https?:\/\/[^\s<>"]+/gi) || [];
  const bareMatches = content.match(/(?<!\w)[a-z0-9][-a-z0-9]*\.(?:com|net|org|io|co|xyz|tk|ml|ga|cf|gq|top|click|link|info|biz|site|online|app)[^\s<>"']*/gi) || [];
  // Deduplicate: skip bare matches already captured in http matches
  const allUrls = [...httpMatches];
  for (const bare of bareMatches) {
    if (!httpMatches.some(h => h.includes(bare))) allUrls.push(bare);
  }
  return allUrls.map(url => {
    const reasons: string[] = [];
    if (/amaz0n|paypa1|wellsfarg0|app1e|micros0ft|g00gle/i.test(url)) reasons.push("Typosquatting: misspelled brand name in domain");
    if (/\.(xyz|tk|ml|ga|cf|gq|top|click|link)/i.test(url)) reasons.push("Suspicious top-level domain commonly used in phishing");
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) reasons.push("IP address used instead of domain name");
    if (/bit\.ly|tinyurl|t\.co|short\.io/i.test(url)) reasons.push("URL shortener hiding the real destination");
    if (/(secure|login|verify|account|update)-/.test(url)) reasons.push("Security-themed subdomain on suspicious domain");
    if (/pay-|fine-|parking-|ticket-/i.test(url) && !/\.gov/i.test(url)) reasons.push("Payment-themed domain not from a government (.gov) source");
    return { url, suspicious: reasons.length > 0, reasons };
  });
}

// Fallback analysis using pattern matching when Gemini API is unavailable.
// All statistics sourced from FTC 2023 Consumer Sentinel Data Book and FBI IC3 2023 Internet Crime Report.
function getMockAnalysis(content: string): ScamAnalysis {
  // Detection patterns
  const isBEC = /(ceo|cfo|executive|wire\s*transfer|vendor.*invoice|updated.*bank.*details|new.*payment.*account)/i.test(content) && /(urgent|immediately|confidential|don't.*tell|between.*us)/i.test(content);
  const isPigButchering = /(wrong\s*number|sorry.*meant|hi.*is\s*this|accidentally.*texted)/i.test(content) && /(invest|crypto|trading|profit|portfolio)/i.test(content);
  const isQuishing = /(qr\s*code|scan.*code|parking.*violation|meter.*expired|scan.*to\s*pay)/i.test(content);
  const isTechSupport = /virus|infected|computer|security alert|call.*support|microsoft.*support|your.*computer|dangerous|technician/i.test(content);
  const isPackageDelivery = /package|delivery|tracking|fedex|ups|usps|dhl|shipped|redelivery|customs fee/i.test(content);
  const isNigerianPrince = /prince|million|inheritance|late.*king|transfer.*country|your assistance/i.test(content);
  const isHiMomScam = /(hi\s*(mom|dad|mum)|new\s*number|dropped[\s\S]*phone|lost[\s\S]*phone)[\s\S]*transfer/i.test(content);
  const isFakeInvoice = /(order|invoice|charged|purchase)[\s\S]*\$\d+[\s\S]*authorize/i.test(content) || /amazon[\s\S]*charged|paypal[\s\S]*charged/i.test(content);
  const isBankAlert = /(security\s*alert|unusual\s*activity|wire\s*transfer.*attempted|fraud.*hotline)/i.test(content) && /bank|wells\s*fargo|chase|citi/i.test(content);
  const isIRSScam = /irs|internal\s*revenue|tax.*liability|warrant.*pending|arrest.*warrant/i.test(content);
  const isCryptoScam = /(guaranteed.*returns|send.*eth|deposit.*btc|smart\s*contract.*address|trading\s*bot|300%|500%|10%.*daily|airdrop.*claim|connect.*wallet|seed\s*phrase)/i.test(content) || (/(crypto|bitcoin|ethereum|eth|btc|token|nft|defi)/i.test(content) && /(guaranteed|returns|profit|passive\s*income|exclusive|spots?\s*remaining|moon|100x)/i.test(content));
  const hasFakeDomain = /amaz0n|paypa1|wellsfarg0|app1e|micros0ft|g00gle/i.test(content);

  const hasUrgency = /urgent|immediately|right away|act now|limited time|expires|deadline|within.*hours|within.*minutes|please\s*hurry/i.test(content);
  const hasMoneyRequest = /send money|wire transfer|western union|gift card|bitcoin|bank details|processing fee|pay.*\$|fee of \$|transfer.*\$/i.test(content);
  const hasTooGoodToBeTrue = /million|inheritance|lottery|winner|prize|congratulations|selected/i.test(content);
  const hasGenericGreeting = /dear friend|dear customer|dear user|dear sir|dear valued/i.test(content);
  const hasAuthority = /bank|government|irs|fbi|microsoft|amazon|apple|official|security team|fraud.*department|collections/i.test(content);
  const hasSuspiciousLink = /http[s]?:\/\/[^\s]*\.(xyz|tk|ml|ga|cf|gq|top|click|link)/i.test(content);
  const asksForSSN = /social\s*security|ssn|social\s*security\s*number/i.test(content);
  const asksForCreditCard = /credit\s*card.*number|card\s*number.*verification/i.test(content);

  const scamIndicators = [hasUrgency, hasMoneyRequest, hasTooGoodToBeTrue, hasGenericGreeting, hasAuthority, hasSuspiciousLink, hasFakeDomain, asksForSSN, asksForCreditCard];
  const indicatorCount = scamIndicators.filter(Boolean).length;
  const urlsFound = extractUrls(content);

  // --- Business Email Compromise (BEC) ---
  // FBI IC3 2023: 21,489 complaints, $2.9 billion in losses
  if (isBEC) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 96,
      scamType: "Business Email Compromise (BEC)",
      tactics: [
        { name: "Executive Impersonation", description: "Poses as a C-suite executive to exploit organizational authority", evidence: "Claims to be CEO/CFO requesting urgent financial action" },
        { name: "Confidentiality Trap", description: "Requests secrecy to prevent the victim from verifying with colleagues", evidence: "Uses phrases like 'keep this confidential' or 'between us'" },
        { name: "Urgency + Authority", description: "Combines time pressure with authority to bypass approval processes", evidence: "Demands immediate wire transfer citing urgent business need" },
      ],
      redFlags: [
        "Executives rarely email urgent wire transfer requests",
        "Request to bypass normal payment approval processes",
        "'Confidential' transactions that skip verification",
        "Change in payment details or bank account for a vendor",
        "Reply-to address may differ from the display name",
      ],
      explanation: "This is a Business Email Compromise (BEC) scam. Attackers impersonate executives or vendors to trick employees into wiring money to fraudulent accounts. The FBI reported BEC caused $2.9 billion in losses across 21,489 complaints in 2023.",
      recommendedActions: [
        "Verify any payment request by calling the executive on a known direct number",
        "Never change vendor payment details based on email alone",
        "Implement dual-approval for wire transfers over a set threshold",
        "Check the sender's full email address for spoofing",
        "Report to FBI IC3 at ic3.gov",
      ],
      similarScamsCount: 21489,
      sophisticationLevel: "HIGH",
      targetDemographic: "Corporate employees in finance, accounting, and executive assistant roles",
      psychologicalTactics: [
        { principle: "Authority Bias (Milgram)", description: "People comply with perceived authority figures without questioning", howUsedHere: "Impersonates CEO/CFO to leverage organizational hierarchy and bypass normal checks" },
        { principle: "Isolation (Cialdini)", description: "Preventing verification by isolating the target from colleagues", howUsedHere: "'Keep this confidential' stops the employee from double-checking with others" },
      ],
      languageAnalysis: {
        registerShifts: "Shifts from casual executive tone to formal financial instructions",
        emotionalManipulation: ["I'm counting on you", "trust", "confidential"],
        urgencyIndicators: ["immediately", "today", "time-sensitive"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 95, identity: 20, emotional: 30, reputational: 60 },
      whatMakesItConvincing: "Uses real executive names, company context, and appropriate business language. Often follows actual deal timelines gleaned from compromised email accounts.",
      realWorldExample: "FBI IC3 2023 Internet Crime Report: BEC accounted for $2.9 billion in losses across 21,489 complaints, making it the costliest cybercrime category.",
      verificationSteps: [
        "Call the executive on their known direct phone number (not from the email)",
        "Check the full email header for the actual sending domain",
        "Verify any payment changes with the vendor through previously established contacts",
        "Report to FBI IC3 at ic3.gov",
      ],
      urlsFound,
    });
  }

  // --- Pig Butchering ---
  // FBI IC3 2023: cryptocurrency investment fraud totaled $3.96 billion
  if (isPigButchering) {
    return withDefaults({
      verdict: "HIGH_RISK",
      confidence: 91,
      scamType: "Pig Butchering (Long-Con Investment Scam)",
      tactics: [
        { name: "Wrong Number Pretext", description: "Initiates contact with a fake accidental message to seem organic", evidence: "Opens with 'wrong number' or 'sorry, meant to text someone else'" },
        { name: "Relationship Building", description: "Builds trust over days or weeks before introducing the investment", evidence: "Friendly conversation designed to establish rapport and emotional connection" },
        { name: "Fake Investment Platform", description: "Steers conversation toward a fraudulent trading platform showing fake profits", evidence: "Mentions crypto trading, investment returns, or a 'special opportunity'" },
      ],
      redFlags: [
        "'Wrong number' texts that lead to continued friendly conversation",
        "New contact who quickly becomes interested in your life and finances",
        "Conversation steered toward investing or crypto trading",
        "Fake trading platform that shows profits but blocks withdrawals",
        "Requests to deposit more money to 'unlock' existing funds",
      ],
      explanation: "This matches the pattern of a 'pig butchering' scam. Scammers build trust over weeks, then lure victims into fake investment platforms. Victims see fabricated profits but lose everything when they try to withdraw. The FBI reported $3.96 billion in cryptocurrency fraud losses in 2023, with pig butchering as the dominant scheme.",
      recommendedActions: [
        "Do not continue conversations with unknown 'wrong number' texters",
        "Never invest on platforms recommended by online strangers",
        "If already invested, do not send more to 'unlock' withdrawals -- it's a trap",
        "Report to FBI IC3 at ic3.gov and the FTC at reportfraud.ftc.gov",
        "Contact your bank immediately if you've sent money",
      ],
      similarScamsCount: 12847,
      sophisticationLevel: "EXPERT",
      targetDemographic: "Adults 30-60 open to investment opportunities, often socially isolated or recently divorced",
      psychologicalTactics: [
        { principle: "Mere Exposure Effect (Zajonc)", description: "Repeated contact builds familiarity and false trust over time", howUsedHere: "Daily messaging over weeks creates a sense of genuine friendship before the ask" },
        { principle: "Sunk Cost Fallacy", description: "People keep investing to try to recover previous losses", howUsedHere: "'Deposit more to unlock your withdrawal' exploits fear of losing what's already invested" },
        { principle: "Commitment/Consistency (Cialdini)", description: "Small initial agreements make larger requests harder to refuse", howUsedHere: "Small first deposit with fake returns builds confidence for larger deposits" },
      ],
      languageAnalysis: {
        registerShifts: "Starts casual and friendly, gradually introduces financial terminology and investment jargon",
        emotionalManipulation: ["I care about you", "I want to help you succeed", "trust me"],
        urgencyIndicators: ["limited time opportunity", "market is moving fast"],
        aiGeneratedSignals: "Unusually polished English from claimed foreign contact; responses are suspiciously prompt and well-structured",
      },
      riskBreakdown: { financial: 95, identity: 40, emotional: 85, reputational: 30 },
      whatMakesItConvincing: "The weeks-long relationship building creates genuine emotional investment. Fake platforms show real-looking profits with professional interfaces. Victims don't realize it's a scam until they try to withdraw.",
      realWorldExample: "FBI IC3 2023: cryptocurrency investment fraud totaled $3.96 billion. A 2023 DOJ case (USA v. Chen et al.) dismantled a pig butchering ring that stole $80 million from hundreds of victims.",
      verificationSteps: [
        "Search the trading platform name + 'scam' on Google",
        "Check if the platform is registered with SEC at sec.gov or FINRA at brokercheck.finra.org",
        "Try to withdraw a small amount before investing more -- legitimate platforms allow this",
        "Reverse image search the person's photos on Google Images or TinEye",
      ],
      urlsFound,
    });
  }

  // --- QR Code Scam (Quishing) ---
  // FTC Consumer Alert December 2023
  if (isQuishing) {
    return withDefaults({
      verdict: "HIGH_RISK",
      confidence: 88,
      scamType: "QR Code Scam (Quishing)",
      tactics: [
        { name: "Physical Trust Exploitation", description: "QR codes on physical objects feel more trustworthy than email links", evidence: "References scanning a QR code for payment or information" },
        { name: "URL Obfuscation", description: "QR codes hide the destination URL, preventing visual inspection before clicking", evidence: "Cannot see where the QR code leads until after scanning" },
        { name: "Urgency via Penalty", description: "Threatens fines or penalties to pressure immediate scanning", evidence: "Claims parking violation, unpaid balance, or account action needed" },
      ],
      redFlags: [
        "QR code sticker placed over an existing legitimate code",
        "Unsolicited mail or flyer with QR code for 'account verification'",
        "QR code leads to a page requesting payment or login credentials",
        "Parking violations or fines payable only via QR code",
      ],
      explanation: "This is a QR code phishing scam (quishing). Scammers place fake QR codes on parking meters, in mail, or on flyers that lead to fake payment pages designed to steal credit card or login credentials. The FTC issued a consumer alert about this growing threat in December 2023.",
      recommendedActions: [
        "Do not scan QR codes from unsolicited mail or suspicious locations",
        "If you scan a QR code, check the URL carefully before entering any information",
        "Pay parking meters through official city apps, not QR codes on the meter",
        "Report fraudulent QR codes to the FTC at reportfraud.ftc.gov",
        "If you entered payment info, contact your bank immediately",
      ],
      similarScamsCount: 7200,
      sophisticationLevel: "MEDIUM",
      targetDemographic: "General public, especially in urban areas using parking meters and public transit",
      psychologicalTactics: [
        { principle: "Authority Bias", description: "Official-looking notices trigger automatic compliance without verification", howUsedHere: "Fake parking violation or city notice looks official enough to scan without questioning" },
        { principle: "Loss Aversion (Kahneman)", description: "Fear of fines outweighs the impulse to verify", howUsedHere: "Threat of additional penalties drives immediate action before checking legitimacy" },
      ],
      languageAnalysis: {
        registerShifts: null,
        emotionalManipulation: ["violation", "penalty", "overdue"],
        urgencyIndicators: ["pay within 24 hours", "avoid additional fines"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 75, identity: 60, emotional: 20, reputational: 5 },
      whatMakesItConvincing: "QR codes on physical objects feel inherently trustworthy. People assume a sticker on a parking meter must be official. The URL is hidden until scanned, bypassing normal link-inspection habits.",
      realWorldExample: "FTC Consumer Alert December 2023 warned about scammers covering legitimate QR codes with their own on parking meters. Austin TX and San Antonio police documented widespread parking meter QR scams in 2022-2023.",
      verificationSteps: [
        "Check if the QR code is a sticker placed over another code",
        "Preview the URL after scanning before entering any data",
        "Contact the city or business directly using their official website",
        "Use official parking payment apps (ParkMobile, PayByPhone) instead of QR codes",
      ],
      urlsFound,
    });
  }

  // --- Family Impersonation ("Hi Mom") Scam ---
  // FTC Consumer Alert October 2023: most reported text message scam
  if (isHiMomScam) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 99,
      scamType: "Family Impersonation Scam",
      tactics: [
        { name: "Identity Spoofing", description: "Pretends to be a family member with a 'new number'", evidence: "Claims to be your child/relative who lost their phone" },
        { name: "Emotional Manipulation", description: "Exploits parental love and desire to help", evidence: "Creates a scenario where your 'child' urgently needs money" },
        { name: "Urgency", description: "Pressures you to act before you can verify their identity", evidence: "Claims time-sensitive emergency requiring immediate transfer" },
      ],
      redFlags: [
        "Claims to be family member with a new phone number",
        "Immediately asks for money transfer",
        "Creates urgency to prevent you from calling their real number",
        "Provides bank details for someone you don't know",
        "Uses emotional pressure ('Love you', 'Please help')",
      ],
      explanation: "This is a family impersonation scam, the most reported text message scam according to the FTC. Scammers pretend to be your child texting from a new number, then urgently request a money transfer. Always verify by calling your family member's known number.",
      recommendedActions: [
        "STOP -- Do NOT transfer any money",
        "Call your family member on their KNOWN number (not this new one)",
        "Ask a verification question only they would know the answer to",
        "Report this number as spam to your carrier (forward to 7726)",
        "Report to FTC at reportfraud.ftc.gov",
      ],
      similarScamsCount: 66000,
      sophisticationLevel: "MEDIUM",
      targetDemographic: "Parents and grandparents, especially those aged 50+",
      psychologicalTactics: [
        { principle: "Loss Aversion (Kahneman)", description: "Fear of a loved one suffering outweighs caution", howUsedHere: "Creates a scenario where your child is in trouble and needs immediate help" },
        { principle: "Authority of Relationship", description: "Family bonds override skepticism and critical thinking", howUsedHere: "Claiming to be your child triggers protective parental instincts" },
      ],
      languageAnalysis: {
        registerShifts: "Starts warm and familiar ('Hi Mom') then shifts to urgent financial request",
        emotionalManipulation: ["love you", "please help", "I'm in trouble"],
        urgencyIndicators: ["need help urgently", "due in 2 hours", "please hurry"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 90, identity: 10, emotional: 80, reputational: 5 },
      whatMakesItConvincing: "Exploits the most trusted relationship (parent-child) with a plausible scenario (lost phone). The emotional urgency makes parents act on instinct before verifying.",
      realWorldExample: "FTC Consumer Alert October 2023: 'Is that really your kid texting?' documented this as the #1 text message scam. In Australia, Scamwatch reported $7.2 million lost to this variant in 2023.",
      verificationSteps: [
        "Call your child's original phone number -- it may still ring even if they 'lost' it",
        "Ask a question only your real child would know the answer to",
        "Contact other family members to verify the story",
        "Check the new number on a reverse phone lookup site",
      ],
      urlsFound,
    });
  }

  // --- Fake Invoice / Order Scam ---
  // FTC 2023: Amazon was the #1 most impersonated company
  if (isFakeInvoice || (hasAuthority && asksForSSN)) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 96,
      scamType: "Fake Invoice / Order Scam",
      tactics: [
        { name: "Fear of Unauthorized Charge", description: "Claims you've been charged for an expensive item to create panic", evidence: "Shows fake order you didn't place" },
        { name: "Fake Customer Service", description: "Provides fraudulent phone number to 'resolve' the issue", evidence: "Number leads to scammers who will steal your information" },
        ...(asksForSSN ? [{ name: "Identity Theft Setup", description: "Requests sensitive information under the guise of 'verification'", evidence: "Asks for SSN, credit card, or other personal data" }] : []),
      ],
      redFlags: [
        "You didn't place this order",
        "Email address uses a misspelled domain (look closely at the sender)",
        "Asks you to call a phone number instead of using the official app",
        "Requests Social Security Number or full credit card details",
        "Creates urgency with short deadlines",
      ],
      explanation: "This is a fake invoice scam. Scammers send fake order confirmations for expensive items, hoping you'll panic and call their number. They then steal payment info or install remote access malware. The FTC reported Amazon as the #1 most impersonated company in phishing scams in 2023.",
      recommendedActions: [
        "Do NOT call the number in the email",
        "Log into your Amazon/PayPal account directly to check your orders",
        "Check the sender's actual email address carefully",
        "Never provide SSN or full credit card over the phone",
        "Forward suspicious Amazon emails to stop-spoofing@amazon.com",
      ],
      similarScamsCount: 96000,
      sophisticationLevel: "MEDIUM",
      targetDemographic: "Online shoppers, particularly Amazon Prime members aged 30-65",
      psychologicalTactics: [
        { principle: "Loss Aversion (Kahneman)", description: "Fear of losing money to unauthorized charges triggers panic", howUsedHere: "A $499.99 charge you didn't make creates immediate anxiety to act" },
        { principle: "Authority Bias", description: "Official branding and reference numbers create false credibility", howUsedHere: "Amazon logos, case numbers, and 'Fraud Department' title trigger automatic trust" },
      ],
      languageAnalysis: {
        registerShifts: "Overly formal corporate tone that doesn't match how real companies communicate",
        emotionalManipulation: ["unauthorized", "immediately", "fraud department"],
        urgencyIndicators: ["24 hours to dispute", "will be processed", "action required"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 80, identity: 85, emotional: 40, reputational: 5 },
      whatMakesItConvincing: "Mimics real Amazon/PayPal order confirmation formatting. The fear of a $499+ unauthorized charge overrides careful examination of the sender's email.",
      realWorldExample: "FTC 2023: Amazon was the most impersonated company in phishing scams, with over 96,000 reports of business impersonation involving fake invoices and order confirmations.",
      verificationSteps: [
        "Log into Amazon at amazon.com (not from email links) and check Your Orders",
        "Check the sender email -- real Amazon emails come from @amazon.com only",
        "Call Amazon customer service at 1-888-280-4331 (official number)",
        "Forward suspicious emails to stop-spoofing@amazon.com",
      ],
      urlsFound,
    });
  }

  // --- Bank Impersonation Scam ---
  // FTC 2023: #2 most common text message scam
  if (isBankAlert || (hasFakeDomain && hasAuthority)) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 97,
      scamType: "Bank Impersonation Scam",
      tactics: [
        { name: "Bank Impersonation", description: "Pretends to be your bank's fraud department", evidence: "Uses bank name and official-sounding language" },
        { name: "Fake Fraud Alert", description: "Claims suspicious activity to create panic", evidence: "Describes unauthorized transaction you need to 'stop'" },
        { name: "Phishing Link", description: "Directs you to a fake website to steal credentials", evidence: "Link goes to misspelled or unofficial domain" },
      ],
      redFlags: [
        "Your bank will NEVER text you links to click",
        "URL doesn't match official bank website",
        "Creates extreme urgency (30 minutes, etc.)",
        "Asks you to 'verify' personal information",
        "Phone number isn't your bank's official number",
      ],
      explanation: "This is a bank impersonation scam. Real banks never send links via text or email asking you to verify information. They never threaten immediate action within minutes. The FTC reports bank impersonation as the #2 most common text message scam.",
      recommendedActions: [
        "Do NOT click any links in this message",
        "Do NOT call the number provided",
        "Call your bank using the number on your physical debit/credit card",
        "Log into your bank through the official app only",
        "Report this to your real bank's fraud department",
      ],
      similarScamsCount: 169000,
      sophisticationLevel: "MEDIUM",
      targetDemographic: "Bank customers of all ages, especially those less familiar with digital banking",
      psychologicalTactics: [
        { principle: "Loss Aversion (Kahneman)", description: "Fear of losing money in your bank account triggers panic", howUsedHere: "The threat of a large unauthorized wire transfer creates immediate fear" },
        { principle: "Authority Bias", description: "Bank fraud departments are perceived as trusted authority", howUsedHere: "'Security Alert' and the bank name trigger automatic trust and compliance" },
      ],
      languageAnalysis: {
        registerShifts: "Formal banking language mixed with alarming urgency atypical of real bank communications",
        emotionalManipulation: ["unusual activity", "unauthorized transaction", "secure your account"],
        urgencyIndicators: ["within 30 minutes", "immediately", "transfer will complete"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 90, identity: 85, emotional: 50, reputational: 5 },
      whatMakesItConvincing: "Uses real bank names and mimics legitimate fraud alert formatting. The threat of losing money creates panic that overrides the impulse to verify.",
      realWorldExample: "FTC 2023: consumers lost $330 million to bank impersonation scams. Wells Fargo, Chase, and Bank of America were the most frequently impersonated banks.",
      verificationSteps: [
        "Call your bank at the number on the back of your debit/credit card",
        "Wells Fargo: 1-800-869-3557 | Chase: 1-800-935-9935 | Bank of America: 1-800-432-1000",
        "Log into your bank account through the official app to check for real alerts",
        "Forward suspicious texts to 7726 (SPAM) to report to your carrier",
      ],
      urlsFound,
    });
  }

  // --- IRS / Government Impersonation Scam ---
  // IRS "Dirty Dozen" 2023; TIGTA reports 3M+ contacts from impersonators since 2013
  if (isIRSScam) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 99,
      scamType: "Government Impersonation Scam",
      tactics: [
        { name: "Authority Impersonation", description: "Pretends to be IRS or law enforcement", evidence: "Uses official-sounding titles, badge numbers, and case numbers" },
        { name: "Threat of Arrest", description: "Claims warrant or legal action to create fear", evidence: "Threatens arrest, prosecution, or asset seizure" },
        { name: "Untraceable Payment", description: "Demands payment via gift cards or wire transfer", evidence: "Real government agencies never accept gift cards as payment" },
      ],
      redFlags: [
        "IRS NEVER calls or texts demanding immediate payment",
        "Government NEVER accepts gift cards as payment",
        "Real IRS always sends written letters first",
        "Threatening arrest for tax debt is an illegal scare tactic",
        "Badge numbers and case numbers are fabricated",
      ],
      explanation: "This is a government impersonation scam. The IRS never initiates contact by phone, text, or email to demand immediate payment. Real tax issues always begin with an official mailed letter. The IRS will never threaten arrest or demand gift cards.",
      recommendedActions: [
        "Hang up immediately -- this is NOT the IRS",
        "Never pay government debts with gift cards or wire transfers",
        "Check your real IRS account at irs.gov/your-account",
        "Report to Treasury Inspector General: 1-800-366-4484",
        "Report to FTC at reportfraud.ftc.gov",
      ],
      similarScamsCount: 160000,
      sophisticationLevel: "LOW",
      targetDemographic: "Taxpayers of all ages, especially recent immigrants and elderly individuals",
      psychologicalTactics: [
        { principle: "Authority Bias (Milgram)", description: "People comply with perceived government authority without questioning", howUsedHere: "IRS badge numbers and case IDs create illusion of legitimate government action" },
        { principle: "Loss Aversion (Kahneman)", description: "Fear of arrest and asset seizure overwhelms rational thought", howUsedHere: "Threats of warrant, prosecution, and wage garnishment trigger fight-or-flight" },
      ],
      languageAnalysis: {
        registerShifts: "Aggressive legal language not used in real IRS communications",
        emotionalManipulation: ["arrest warrant", "criminal prosecution", "asset seizure"],
        urgencyIndicators: ["FINAL NOTICE", "IMMEDIATELY", "law enforcement notified"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 85, identity: 30, emotional: 70, reputational: 5 },
      whatMakesItConvincing: "Uses official IRS terminology, fake case numbers, and badge IDs. The threat of arrest is terrifying enough that many victims pay before thinking critically.",
      realWorldExample: "IRS 'Dirty Dozen' tax scams list 2023: IRS impersonation remains the #1 tax scam. The Treasury Inspector General (TIGTA) has received reports of over 3 million contacts from IRS impersonators since 2013.",
      verificationSteps: [
        "Check your IRS account at irs.gov/your-account",
        "Call the IRS directly at 1-800-829-1040 (official number)",
        "Report IRS impersonation to TIGTA at 1-800-366-4484",
        "The IRS always mails written notices first (Letter CP2000 or similar)",
      ],
      urlsFound,
    });
  }

  // --- Crypto Investment Scam ---
  // FBI IC3 2023: $3.96 billion in cryptocurrency fraud losses
  if (isCryptoScam) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 98,
      scamType: "Crypto Investment Scam",
      tactics: [
        { name: "Guaranteed Returns", description: "Promises impossibly high, risk-free returns", evidence: "Claims of 300-500% monthly returns or '10% daily guaranteed profit'" },
        { name: "Artificial Scarcity", description: "Creates fake urgency with limited spots or countdown timers", evidence: "'Only 12 spots remaining' or 'price goes up at midnight'" },
        { name: "Social Proof Fabrication", description: "Uses fake testimonials to build credibility", evidence: "Screenshots of 'member results' showing unrealistic gains" },
        { name: "Irreversible Payment", description: "Requests crypto deposits that cannot be reversed", evidence: "Asks you to send ETH/BTC to a wallet address or smart contract" },
      ],
      redFlags: [
        "No legitimate investment guarantees returns -- this violates SEC regulations",
        "Asking you to deposit crypto to an unknown wallet address",
        "Fake testimonials with unrealistic gains",
        "Private Telegram/Discord groups are where most crypto scams operate",
        "No registered company, license, or regulatory oversight",
      ],
      explanation: "This is a cryptocurrency investment scam. No legitimate investment offers guaranteed daily returns -- the SEC explicitly states this violates securities law. Once you send crypto to a scammer's wallet, the transaction is permanent and irreversible.",
      recommendedActions: [
        "NEVER send crypto to addresses shared by strangers",
        "Check SEC.gov for registered investment companies",
        "Verify any platform on FINRA BrokerCheck at brokercheck.finra.org",
        "Report to FBI IC3 at ic3.gov and FTC at reportfraud.ftc.gov",
        "Report the wallet address to the blockchain's abuse team",
      ],
      similarScamsCount: 69468,
      sophisticationLevel: "HIGH",
      targetDemographic: "Adults 25-55 interested in cryptocurrency and alternative investments",
      psychologicalTactics: [
        { principle: "Social Proof (Cialdini)", description: "Fake testimonials create the illusion that others are profiting", howUsedHere: "Screenshots showing 'members' making thousands trigger FOMO" },
        { principle: "Scarcity/FOMO (Cialdini)", description: "Limited availability creates fear of missing out", howUsedHere: "'Only 12 spots remaining' and 'price goes up at midnight' pressure immediate action" },
        { principle: "Anchoring (Tversky & Kahneman)", description: "Large numbers set expectations that make the ask seem small", howUsedHere: "Showing $31K returns makes a 0.5 ETH deposit feel like a small bet" },
      ],
      languageAnalysis: {
        registerShifts: "Shifts between casual crypto jargon and professional financial terminology",
        emotionalManipulation: ["exclusive", "life-changing", "quit his job", "you'd be crazy to miss this"],
        urgencyIndicators: ["this week only", "spots remaining", "price goes up at midnight"],
        aiGeneratedSignals: "Formulaic testimonial structure and even paragraph lengths suggest AI-generated content",
      },
      riskBreakdown: { financial: 95, identity: 30, emotional: 50, reputational: 15 },
      whatMakesItConvincing: "Combines crypto jargon with real-sounding technical details (smart contract addresses, Telegram groups). Fake testimonials with specific dollar amounts create believable social proof.",
      realWorldExample: "FBI IC3 2023: cryptocurrency investment fraud totaled $3.96 billion in losses across 69,468 complaints, the highest of any investment fraud category.",
      verificationSteps: [
        "Search the platform name + 'scam' or 'review' on Google",
        "Check if the company is registered with SEC at sec.gov",
        "Verify on FINRA BrokerCheck at brokercheck.finra.org",
        "Look up the wallet address on etherscan.io for scam labels",
      ],
      urlsFound,
    });
  }

  // --- Tech Support Scam ---
  // FBI IC3 2023: 37,560 complaints, $924.5 million in losses
  if (isTechSupport && indicatorCount >= 2) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 97,
      scamType: "Tech Support Scam",
      tactics: [
        { name: "Fear Tactics", description: "Creates panic about fake security threats", evidence: "Claims your computer is infected or compromised" },
        { name: "Fake Authority", description: "Impersonates legitimate tech companies", evidence: "Pretends to be from Microsoft, Apple, or another trusted company" },
        ...(hasMoneyRequest ? [{ name: "Payment Demand", description: "Demands payment for fake repairs", evidence: "Requests payment via gift cards or wire transfer" }] : []),
      ],
      redFlags: [
        "Legitimate companies never contact you about viruses unsolicited",
        "Real tech support never asks for gift card payments",
        "Phone numbers in pop-ups or emails are always fake",
        "Creates false urgency to prevent clear thinking",
      ],
      explanation: "This is a tech support scam. Microsoft, Apple, and other tech companies never cold-call or send unsolicited warnings about your computer. The FBI reported 37,560 tech support fraud complaints with $924.5 million in losses in 2023.",
      recommendedActions: [
        "Do NOT call the number provided",
        "Close any pop-ups immediately (use Task Manager if needed: Ctrl+Alt+Delete)",
        "Never give remote access to your computer to unsolicited callers",
        "If you already called, disconnect and contact your bank immediately",
        "Report to FTC at reportfraud.ftc.gov",
      ],
      similarScamsCount: 37560,
      sophisticationLevel: "LOW",
      targetDemographic: "Adults 60+ and less tech-savvy users. FBI IC3: victims over 60 accounted for 58% of losses.",
      psychologicalTactics: [
        { principle: "Authority Bias", description: "Microsoft/Apple logos create false legitimacy", howUsedHere: "Brand impersonation triggers trust -- people believe 'Microsoft' detected a real virus" },
        { principle: "Loss Aversion (Kahneman)", description: "Fear of losing data or having identity stolen drives compliance", howUsedHere: "'Your computer is compromised' creates fear that overrides skepticism" },
      ],
      languageAnalysis: {
        registerShifts: "Aggressive, alarming language not used by real tech companies",
        emotionalManipulation: ["infected", "compromised", "dangerous", "hackers"],
        urgencyIndicators: ["call immediately", "do not turn off", "act now"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 70, identity: 60, emotional: 50, reputational: 5 },
      whatMakesItConvincing: "Pop-up warnings look like real system alerts. Using Microsoft or Apple branding creates instant credibility with less tech-savvy users.",
      realWorldExample: "FBI IC3 2023: tech support fraud resulted in 37,560 complaints with $924.5 million in losses. Victims over 60 accounted for 58% of all tech support fraud losses.",
      verificationSteps: [
        "Microsoft support: support.microsoft.com (Microsoft never calls unsolicited)",
        "Apple support: getsupport.apple.com or 1-800-275-2273",
        "Run a real antivirus scan (Windows Defender is built-in and free)",
        "Report tech support scams at microsoft.com/reportascam",
      ],
      urlsFound,
    });
  }

  // --- Package Delivery Phishing ---
  // FTC 2023: most common type of scam text message, 333,000+ reports
  if (isPackageDelivery && (hasMoneyRequest || hasSuspiciousLink)) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 94,
      scamType: "Package Delivery Phishing",
      tactics: [
        { name: "Brand Impersonation", description: "Pretends to be FedEx, UPS, USPS, or DHL", evidence: "Uses legitimate carrier names and branding" },
        { name: "Fake Urgency", description: "Creates pressure with a delivery deadline", evidence: "Claims package will be returned or destroyed if you don't act" },
        ...(hasSuspiciousLink ? [{ name: "Phishing Link", description: "Links to a fake website to steal credentials", evidence: "URL doesn't match official company domain" }] : []),
      ],
      redFlags: [
        "Real delivery companies don't ask for fees via text or email",
        "Suspicious URL that doesn't match the official carrier website",
        "You may not even be expecting a package",
        "Asks for credit card or personal information",
      ],
      explanation: "This is a package delivery phishing scam. The FTC reports fake delivery notifications as the #1 most common scam text message, with over 333,000 reports in 2023. Real carriers use their official apps and tracking pages, never random text links.",
      recommendedActions: [
        "Do NOT click any links in this message",
        "Track packages only at official sites: usps.com, ups.com, fedex.com",
        "Check your actual orders on retailer websites",
        "Forward spam texts to 7726 (SPAM) to report to your carrier",
        "Report to FTC at reportfraud.ftc.gov",
      ],
      similarScamsCount: 333000,
      sophisticationLevel: "LOW",
      targetDemographic: "Online shoppers, especially frequent Amazon and online retail buyers",
      psychologicalTactics: [
        { principle: "Authority Bias", description: "Trusted carrier brands create automatic credibility", howUsedHere: "Using official carrier names like USPS or FedEx makes the message seem legitimate" },
        { principle: "Loss Aversion (Kahneman)", description: "Fear of losing a package you might be expecting", howUsedHere: "With the volume of online shopping, there's a good chance you ARE expecting something" },
      ],
      languageAnalysis: {
        registerShifts: null,
        emotionalManipulation: ["unable to deliver", "action required", "will be returned"],
        urgencyIndicators: ["schedule redelivery", "within 24 hours"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 60, identity: 70, emotional: 15, reputational: 5 },
      whatMakesItConvincing: "Most people ARE expecting a package at any given time. The message exploits this probability to seem plausible and relevant.",
      realWorldExample: "FTC 2023: fake delivery notification texts were the #1 most reported text scam with over 333,000 reports. USPS was the most impersonated carrier.",
      verificationSteps: [
        "Track at official sites: usps.com, ups.com, fedex.com, dhl.com",
        "USPS: 1-800-275-8777 | UPS: 1-800-742-5877 | FedEx: 1-800-463-3339",
        "Check your email for real shipping confirmations from retailers",
        "Forward suspicious texts to 7726 (SPAM)",
      ],
      urlsFound,
    });
  }

  // --- Advance Fee Fraud (419 Scam) ---
  // FBI IC3 2023: $68.4 million in advance fee fraud losses
  if (isNigerianPrince || (hasTooGoodToBeTrue && hasMoneyRequest)) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 98,
      scamType: "Advance Fee Fraud (419 Scam)",
      tactics: [
        { name: "Too Good To Be True", description: "Promises unrealistic amounts of money for minimal effort", evidence: "Claims you'll receive millions from an inheritance or lottery" },
        { name: "Upfront Fee Request", description: "Requires payment before you receive anything", evidence: "Asks for 'processing fees,' 'transfer costs,' or 'legal fees'" },
        { name: "Emotional Manipulation", description: "Uses stories of tragedy or urgency to elicit sympathy", evidence: "Claims inheritance, trapped funds, or political crisis" },
      ],
      redFlags: [
        "Stranger promising large sums of money",
        "Request for upfront fees or bank details",
        "Generic greeting (Dear Friend, Dear Sir)",
        "Poor grammar or unusual spelling",
        "Untraceable payment methods (wire transfer, gift cards)",
      ],
      explanation: "This is advance fee fraud (419 scam), named after Section 419 of the Nigerian Criminal Code. The scammer promises millions but will keep requesting escalating fees. No payout ever arrives. The FBI reported $68.4 million in advance fee fraud losses in 2023.",
      recommendedActions: [
        "Do not respond to this message",
        "Never send money to strangers, regardless of their story",
        "Block the sender immediately",
        "Do not share any personal or financial information",
        "Report to FBI IC3 at ic3.gov and FTC at reportfraud.ftc.gov",
      ],
      similarScamsCount: 25000,
      sophisticationLevel: "LOW",
      targetDemographic: "General public, especially elderly individuals and those experiencing financial hardship",
      psychologicalTactics: [
        { principle: "Reciprocity (Cialdini)", description: "The promise of helping you creates a sense of obligation to help in return", howUsedHere: "'I'll share millions with you if you just help me with a small fee'" },
        { principle: "Commitment/Consistency (Cialdini)", description: "Once you send the first fee, you feel committed to continue", howUsedHere: "Each escalating fee is harder to refuse because you've already 'invested'" },
      ],
      languageAnalysis: {
        registerShifts: "Overly formal language mixed with emotional pleas",
        emotionalManipulation: ["your assistance", "God bless", "my late father"],
        urgencyIndicators: ["time is running out", "must be completed soon"],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 80, identity: 50, emotional: 40, reputational: 10 },
      whatMakesItConvincing: "Appeals to both greed and altruism simultaneously. The promise of millions makes small fees seem trivial, and the sunk cost fallacy keeps victims paying.",
      realWorldExample: "FBI IC3 2023: advance fee fraud resulted in $68.4 million in reported losses. This scam format dates back to fax-based schemes in the 1980s and continues through email and social media.",
      verificationSteps: [
        "Search the exact email text on Google -- it will match known scam templates",
        "No legitimate stranger will ever offer you millions via email",
        "Never wire money internationally to people you haven't met in person",
        "Report to your country's fraud center (US: ic3.gov, UK: actionfraud.police.uk)",
      ],
      urlsFound,
    });
  }

  // --- Generic (3+ indicators) ---
  if (indicatorCount >= 3) {
    return withDefaults({
      verdict: "CONFIRMED_SCAM",
      confidence: 92,
      scamType: "Suspected Fraud",
      tactics: [
        ...(hasUrgency ? [{ name: "Urgency", description: "Creates false time pressure to prevent careful thinking", evidence: "Message contains urgent language demanding immediate action" }] : []),
        ...(hasMoneyRequest ? [{ name: "Financial Request", description: "Requests money or financial information upfront", evidence: "Asks for bank details, wire transfer, or processing fees" }] : []),
        ...(hasTooGoodToBeTrue ? [{ name: "Too Good To Be True", description: "Promises unrealistic rewards or winnings", evidence: "Claims of large sums of money or prizes" }] : []),
      ],
      redFlags: [
        "Multiple scam indicators detected in this message",
        "Unsolicited contact involving money or personal information",
        "Request for payment via untraceable methods",
        "Pressure to act quickly without time to verify",
      ],
      explanation: "This message contains multiple warning signs commonly found in fraudulent communications. Legitimate organizations don't combine urgency, payment requests, and unrealistic promises. Always verify independently through official channels.",
      recommendedActions: [
        "Do not respond to this message",
        "Do not send any money or personal information",
        "Block the sender",
        "Report to FTC at reportfraud.ftc.gov",
      ],
      similarScamsCount: 0,
      sophisticationLevel: "MEDIUM",
      targetDemographic: "General public",
      psychologicalTactics: [
        { principle: "Loss Aversion (Kahneman)", description: "Fear of missing out or losing money drives hasty decisions", howUsedHere: "Combined pressure tactics overwhelm critical thinking" },
      ],
      languageAnalysis: {
        registerShifts: null,
        emotionalManipulation: [],
        urgencyIndicators: hasUrgency ? ["urgent", "immediately", "act now"] : [],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 70, identity: 50, emotional: 30, reputational: 10 },
      whatMakesItConvincing: "Combines multiple psychological pressure tactics that work together to overwhelm critical thinking.",
      realWorldExample: "FTC 2023 Consumer Sentinel: consumers filed 2.6 million fraud reports with total losses exceeding $10 billion.",
      verificationSteps: [
        "Search key phrases from the message on Google to check for known scam patterns",
        "Contact the claimed organization directly using their official website or phone number",
        "Never click links or call numbers provided in suspicious messages",
      ],
      urlsFound,
    });
  }

  // --- Suspicious (1-2 indicators) ---
  if (indicatorCount >= 1) {
    return withDefaults({
      verdict: "SUSPICIOUS",
      confidence: 65,
      scamType: null,
      tactics: [
        ...(hasUrgency ? [{ name: "Urgency", description: "Uses time pressure tactics", evidence: "Contains language suggesting immediate action needed" }] : []),
      ],
      redFlags: [
        "Some suspicious elements detected",
        "Verify sender identity independently before acting",
      ],
      explanation: "This message contains some elements commonly found in scam communications. While it may be legitimate, exercise caution and verify the sender's identity through official channels before taking any action.",
      recommendedActions: [
        "Verify the sender through official channels",
        "Do not click any links until verified",
        "Contact the organization directly using known, verified contact info",
      ],
      similarScamsCount: 0,
      sophisticationLevel: "LOW",
      targetDemographic: "General public",
      psychologicalTactics: [],
      languageAnalysis: {
        registerShifts: null,
        emotionalManipulation: [],
        urgencyIndicators: hasUrgency ? ["urgent language detected"] : [],
        aiGeneratedSignals: null,
      },
      riskBreakdown: { financial: 20, identity: 15, emotional: 10, reputational: 5 },
      whatMakesItConvincing: "",
      realWorldExample: "",
      verificationSteps: [
        "Contact the sender through a known, verified method (not one provided in this message)",
        "Search for the sender's claims independently online",
      ],
      urlsFound,
    });
  }

  // --- Safe ---
  return withDefaults({
    verdict: "SAFE",
    confidence: 80,
    scamType: null,
    tactics: [],
    redFlags: [],
    explanation: "This message does not contain obvious scam indicators. However, always exercise caution with unexpected communications, especially those involving money or personal information.",
    recommendedActions: [
      "Standard caution applies for all communications",
      "Verify sender if anything seems unusual",
    ],
    similarScamsCount: 0,
    sophisticationLevel: "LOW",
    targetDemographic: "N/A",
    psychologicalTactics: [],
    languageAnalysis: {
      registerShifts: null,
      emotionalManipulation: [],
      urgencyIndicators: [],
      aiGeneratedSignals: null,
    },
    riskBreakdown: { financial: 0, identity: 0, emotional: 0, reputational: 0 },
    whatMakesItConvincing: "",
    realWorldExample: "",
    verificationSteps: [],
    urlsFound: [],
  });
}

export async function analyzeText(content: string): Promise<ScamAnalysis> {
  const useMock = process.env.MOCK_API === "true" || !process.env.GEMINI_API_KEY;

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockAnalysis(content);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: SCAM_ANALYSIS_SYSTEM_PROMPT,
    });

    const result = await withTimeout(
      model.generateContent(TEXT_ANALYSIS_PROMPT(content)),
      20000
    );
    const response = result.response.text();
    const analysis = withDefaults(JSON.parse(response));

    // Supplement with client-side URL extraction if API didn't return URLs
    if (!analysis.urlsFound || analysis.urlsFound.length === 0) {
      analysis.urlsFound = extractUrls(content);
    }

    return analysis;
  } catch (error) {
    console.error("Gemini API error, falling back to pattern analysis:", error);
    return getMockAnalysis(content);
  }
}

export async function analyzeImage(base64Image: string, mimeType: string): Promise<ScamAnalysis> {
  const useMock = process.env.MOCK_API === "true" || !process.env.GEMINI_API_KEY;

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return withDefaults({
      verdict: "HIGH_RISK",
      confidence: 85,
      scamType: "Phishing / Fake Document",
      tactics: [
        { name: "Visual Spoofing", description: "Uses fake logos or branding to appear legitimate", evidence: "Image contains elements mimicking official branding" },
      ],
      redFlags: [
        "Suspicious visual elements detected",
        "May be attempting to impersonate a legitimate organization",
      ],
      explanation: "This image contains visual elements commonly used in phishing attempts or fake documents. Scammers use convincing-looking images to trick victims into trusting fraudulent communications.",
      recommendedActions: [
        "Do not trust information displayed in this image",
        "Verify with official sources directly",
        "Do not enter any information on linked websites",
      ],
      similarScamsCount: 0,
      sophisticationLevel: "MEDIUM",
      targetDemographic: "General public",
      riskBreakdown: { financial: 60, identity: 70, emotional: 20, reputational: 5 },
      whatMakesItConvincing: "Visual elements like logos and formatting create an appearance of legitimacy that text alone cannot achieve.",
      realWorldExample: "FTC 2023: phishing was the #1 reported fraud contact method, with images and fake websites playing a central role.",
      verificationSteps: [
        "Verify any URLs visible in the image by typing them directly (don't click or scan)",
        "Contact the organization shown in the image using their official website",
        "Check the FTC's scam alerts at consumer.ftc.gov/scam-alerts",
      ],
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: SCAM_ANALYSIS_SYSTEM_PROMPT,
    });

    const result = await withTimeout(
      model.generateContent([
        IMAGE_ANALYSIS_PROMPT,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
      ]),
      20000
    );

    const response = result.response.text();
    return withDefaults(JSON.parse(response));
  } catch (error) {
    console.error("Gemini API error for image, falling back to pattern analysis:", error);
    return withDefaults({
      verdict: "SUSPICIOUS",
      confidence: 60,
      scamType: null,
      tactics: [],
      redFlags: ["Unable to complete full analysis -- exercise caution"],
      explanation: "We couldn't complete a full analysis of this image. If this appears to be from an official source, verify independently before taking any action.",
      recommendedActions: [
        "Verify the source independently through official channels",
        "Do not act on information in this image until verified",
      ],
      riskBreakdown: { financial: 30, identity: 30, emotional: 10, reputational: 5 },
      verificationSteps: [
        "Contact the organization directly using their official website",
        "Check consumer.ftc.gov/scam-alerts for known scam patterns",
      ],
    });
  }
}
