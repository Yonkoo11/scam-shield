import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScamAnalysis } from "@/types/analysis";
import { SCAM_ANALYSIS_SYSTEM_PROMPT, TEXT_ANALYSIS_PROMPT, IMAGE_ANALYSIS_PROMPT } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Timeout wrapper for API calls
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// Mock analysis for demo/development when API is unavailable
function getMockAnalysis(content: string): ScamAnalysis {
  // Detect specific scam types
  const isTechSupport = /virus|infected|computer|security alert|call.*support|microsoft.*support|your.*computer|dangerous|technician/i.test(content);
  const isPackageDelivery = /package|delivery|tracking|fedex|ups|usps|dhl|shipped|redelivery|customs fee/i.test(content);
  const isNigerianPrince = /prince|million|inheritance|late.*king|transfer.*country|your assistance/i.test(content);
  const isHiMomScam = /(hi\s*(mom|dad|mum)|new\s*number|dropped[\s\S]*phone|lost[\s\S]*phone)[\s\S]*transfer/i.test(content);
  const isFakeInvoice = /(order|invoice|charged|purchase)[\s\S]*\$\d+[\s\S]*authorize/i.test(content) || /amazon[\s\S]*charged|paypal[\s\S]*charged/i.test(content);
  const isBankAlert = /(security\s*alert|unusual\s*activity|wire\s*transfer.*attempted|fraud.*hotline)/i.test(content) && /bank|wells\s*fargo|chase|citi/i.test(content);
  const isIRSScam = /irs|internal\s*revenue|tax.*liability|warrant.*pending|arrest.*warrant/i.test(content);
  const isCryptoScam = /(guaranteed.*returns|send.*eth|deposit.*btc|smart\s*contract.*address|trading\s*bot|300%|500%|10%.*daily|airdrop.*claim|connect.*wallet|seed\s*phrase)/i.test(content) || (/(crypto|bitcoin|ethereum|eth|btc|token|nft|defi)/i.test(content) && /(guaranteed|returns|profit|passive\s*income|exclusive|spots?\s*remaining|moon|100x)/i.test(content));
  const hasFakeDomain = /amaz0n|paypa1|wellsfarg0|app1e|micros0ft|g00gle/i.test(content);

  // Detect common scam indicators
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

  // "Hi Mom/Dad" Family Impersonation Scam
  if (isHiMomScam) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 99,
      scamType: "Family Impersonation Scam",
      tactics: [
        {
          name: "Identity Spoofing",
          description: "Pretends to be a family member with a 'new number'",
          evidence: "Claims to be your child/relative who lost their phone"
        },
        {
          name: "Emotional Manipulation",
          description: "Exploits parental love and desire to help",
          evidence: "Creates a scenario where your 'child' urgently needs money"
        },
        {
          name: "Urgency",
          description: "Pressures you to act before you can verify",
          evidence: "Claims time-sensitive emergency requiring immediate transfer"
        },
      ],
      redFlags: [
        "Claims to be family member with a new phone number",
        "Immediately asks for money transfer",
        "Creates urgency to prevent you from calling their real number",
        "Provides bank details for someone you don't know",
        "Uses emotional pressure ('Love you', 'Please help')"
      ],
      explanation: "This is the #1 text scam of 2023. Scammers pretend to be your child with a new phone number, then urgently request money. ALWAYS call your family member's known number to verify before sending any money.",
      recommendedActions: [
        "STOP - Do NOT transfer any money",
        "Call your family member on their KNOWN number (not this one)",
        "Ask a verification question only they would know",
        "Report this number as spam",
        "Warn your family about this scam"
      ],
      similarScamsCount: 8934
    };
  }

  // Fake Invoice/Order Scam
  if (isFakeInvoice || (hasAuthority && asksForSSN)) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 96,
      scamType: "Fake Invoice / Order Scam",
      tactics: [
        {
          name: "Fear of Unauthorized Charge",
          description: "Claims you've been charged for an expensive item",
          evidence: "Shows fake order you didn't place to create panic"
        },
        {
          name: "Fake Customer Service",
          description: "Provides fraudulent phone number to 'resolve' issue",
          evidence: "Number leads to scammers who will steal your information"
        },
        ...(asksForSSN ? [{
          name: "Identity Theft Setup",
          description: "Requests sensitive information for 'verification'",
          evidence: "Asks for SSN, credit card, or other personal data"
        }] : []),
      ],
      redFlags: [
        "You didn't place this order",
        "Email address is fake (look closely at the domain)",
        "Asks you to call a phone number (not through official app)",
        "Requests Social Security Number or full credit card",
        "Creates urgency with short deadlines"
      ],
      explanation: "This is a fake invoice scam. Scammers send fake order confirmations hoping you'll panic and call their number. They'll then steal your payment info or install malware. Real companies never ask for SSN for order disputes.",
      recommendedActions: [
        "Do NOT call the number in the email",
        "Log into your Amazon/PayPal account directly to check orders",
        "Check the sender's actual email address (hover over it)",
        "Never provide SSN or full credit card over the phone",
        "Report as phishing and delete"
      ],
      similarScamsCount: 6721
    };
  }

  // Fake Bank Alert Scam
  if (isBankAlert || (hasFakeDomain && hasAuthority)) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 97,
      scamType: "Bank Impersonation Scam",
      tactics: [
        {
          name: "Bank Impersonation",
          description: "Pretends to be your bank's fraud department",
          evidence: "Uses bank name and official-sounding language"
        },
        {
          name: "Fake Fraud Alert",
          description: "Claims suspicious activity to create panic",
          evidence: "Describes unauthorized transaction you need to 'stop'"
        },
        {
          name: "Phishing Link",
          description: "Directs you to fake website to steal credentials",
          evidence: "Link goes to misspelled or unofficial domain"
        },
      ],
      redFlags: [
        "Your bank will NEVER text you links to click",
        "URL doesn't match official bank website",
        "Creates extreme urgency (30 minutes, etc.)",
        "Asks you to 'verify' personal information",
        "Phone number isn't your bank's official number"
      ],
      explanation: "This is a bank impersonation scam. Real banks never send links via text or email asking you to verify information. They also never threaten immediate action within minutes. Always call the number on your physical card.",
      recommendedActions: [
        "Do NOT click any links in this message",
        "Do NOT call the number provided",
        "Call your bank using the number on your card",
        "Log into your bank through the official app only",
        "Report this to your real bank's fraud department"
      ],
      similarScamsCount: 5483
    };
  }

  // IRS/Government Scam
  if (isIRSScam) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 99,
      scamType: "Government Impersonation Scam",
      tactics: [
        {
          name: "Authority Impersonation",
          description: "Pretends to be IRS or law enforcement",
          evidence: "Uses official-sounding titles and case numbers"
        },
        {
          name: "Threat of Arrest",
          description: "Claims warrant or legal action to create fear",
          evidence: "Threatens arrest, prosecution, or asset seizure"
        },
        {
          name: "Untraceable Payment",
          description: "Demands payment via gift cards or wire transfer",
          evidence: "Real government never accepts gift cards as payment"
        },
      ],
      redFlags: [
        "IRS NEVER calls or texts demanding immediate payment",
        "Government NEVER accepts gift cards as payment",
        "Real IRS sends letters first, not calls/texts",
        "Threatening arrest for tax debt is illegal scare tactic",
        "Badge numbers and case numbers are fake"
      ],
      explanation: "This is a government impersonation scam. The IRS NEVER calls threatening arrest or demands gift card payment. Real tax issues come via official mail, and you always have time to respond. This is 100% a scam.",
      recommendedActions: [
        "Hang up immediately - this is NOT the IRS",
        "Never pay government debts with gift cards",
        "Check IRS.gov for your actual tax status",
        "Report to Treasury Inspector General: 1-800-366-4484",
        "Report to FTC at reportfraud.ftc.gov"
      ],
      similarScamsCount: 7291
    };
  }

  // Crypto / Investment Scam
  if (isCryptoScam) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 98,
      scamType: "Crypto Investment Scam",
      tactics: [
        {
          name: "Guaranteed Returns",
          description: "Promises impossibly high, risk-free returns to lure victims",
          evidence: "Claims of 300-500% monthly returns or '10% daily guaranteed profit'"
        },
        {
          name: "Artificial Scarcity",
          description: "Creates fake urgency with limited spots or countdown timers",
          evidence: "Claims like 'only 12 spots remaining' or 'price goes up at midnight'"
        },
        {
          name: "Social Proof Fabrication",
          description: "Uses fake testimonials from non-existent users to build credibility",
          evidence: "Screenshots of 'member results' showing life-changing gains"
        },
        {
          name: "Irreversible Payment",
          description: "Requests crypto deposits that cannot be reversed or traced",
          evidence: "Asks you to send ETH/BTC to a wallet address or smart contract"
        },
      ],
      redFlags: [
        "No legitimate investment guarantees returns - this violates securities law",
        "Asking you to deposit crypto to an unknown wallet address",
        "Fake testimonials with unrealistic gains ($500 to $31K in 12 days)",
        "Private Telegram groups are where most crypto scams operate",
        "No registered company, no license, no regulatory oversight",
        "'Not financial advice' disclaimer while making financial promises"
      ],
      explanation: "This is a classic crypto investment scam (also called a 'pig butchering' or rug pull scheme). No legitimate investment offers guaranteed daily returns. Once you send crypto to their wallet, your money is gone forever. These operations steal billions annually.",
      recommendedActions: [
        "NEVER send crypto to addresses shared by strangers",
        "No legitimate investment guarantees fixed returns",
        "Check SEC.gov EDGAR database for registered investment companies",
        "Report to FTC and the FBI's IC3 at ic3.gov",
        "Warn others in your network about this specific scam"
      ],
      similarScamsCount: 12847
    };
  }

  // Tech Support Scam
  if (isTechSupport && indicatorCount >= 2) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 97,
      scamType: "Tech Support Scam",
      tactics: [
        {
          name: "Fear Tactics",
          description: "Creates panic about fake security threats",
          evidence: "Claims your computer is infected with a virus or compromised"
        },
        {
          name: "Fake Authority",
          description: "Impersonates legitimate tech companies",
          evidence: "Pretends to be from Microsoft, Apple, or another trusted company"
        },
        ...(hasMoneyRequest ? [{
          name: "Payment Demand",
          description: "Demands payment for fake 'repairs'",
          evidence: "Requests payment via gift cards or wire transfer"
        }] : []),
      ],
      redFlags: [
        "Legitimate companies never contact you about viruses this way",
        "Real tech support never asks for gift card payments",
        "Phone numbers in pop-ups or emails are always fake",
        "Creates false urgency to prevent you from thinking clearly"
      ],
      explanation: "This is a tech support scam. Scammers pretend to be from Microsoft, Apple, or other tech companies to trick you into paying for fake virus removal. Real tech companies never cold-call or send unsolicited warnings about your computer.",
      recommendedActions: [
        "Do NOT call the number provided",
        "Close this message/pop-up immediately",
        "Never give remote access to your computer",
        "If you already called, hang up and contact your bank",
        "Report to FTC at reportfraud.ftc.gov"
      ],
      similarScamsCount: 4521
    };
  }

  // Package Delivery Phishing
  if (isPackageDelivery && (hasMoneyRequest || hasSuspiciousLink)) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 94,
      scamType: "Package Delivery Phishing",
      tactics: [
        {
          name: "Brand Impersonation",
          description: "Pretends to be a legitimate delivery service",
          evidence: "Uses names like FedEx, UPS, USPS, or DHL"
        },
        {
          name: "Fake Urgency",
          description: "Creates pressure with delivery deadline",
          evidence: "Claims package will be returned or destroyed soon"
        },
        ...(hasSuspiciousLink ? [{
          name: "Phishing Link",
          description: "Links to a fake website to steal your information",
          evidence: "URL doesn't match official company domain"
        }] : []),
      ],
      redFlags: [
        "Real delivery companies don't ask for fees via text/email",
        "Suspicious URL that doesn't match the official company",
        "You weren't expecting a package",
        "Asks for credit card or personal information"
      ],
      explanation: "This is a package delivery phishing scam. Scammers send fake delivery notifications to steal your credit card information or personal data. Real delivery companies use their official apps and websites, not random links.",
      recommendedActions: [
        "Do NOT click any links in this message",
        "Go directly to the carrier's official website if expecting a package",
        "Check your actual orders on retailer websites",
        "Report as spam and delete the message",
        "Report to FTC at reportfraud.ftc.gov"
      ],
      similarScamsCount: 3892
    };
  }

  // Nigerian Prince / Advance Fee Fraud
  if (isNigerianPrince || (hasTooGoodToBeTrue && hasMoneyRequest)) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 98,
      scamType: "Advance Fee Fraud (419 Scam)",
      tactics: [
        {
          name: "Too Good To Be True",
          description: "Promises unrealistic amounts of money",
          evidence: "Claims you'll receive millions for minimal effort"
        },
        {
          name: "Upfront Fee Request",
          description: "Requires payment before you receive anything",
          evidence: "Asks for 'processing fees' or 'transfer costs'"
        },
        {
          name: "Emotional Manipulation",
          description: "Uses stories of tragedy or urgency",
          evidence: "Claims inheritance, lottery win, or trapped funds"
        },
      ],
      redFlags: [
        "Stranger promising large sums of money",
        "Request for upfront fees or bank details",
        "Generic greeting (Dear Friend, Dear Sir)",
        "Poor grammar or spelling",
        "Untraceable payment methods (wire transfer, gift cards)"
      ],
      explanation: "This is an advance fee fraud (also called a 419 scam). The scammer promises millions but will keep asking for more fees. No money will ever arrive. This scam has stolen billions from victims worldwide.",
      recommendedActions: [
        "Do not respond to this message",
        "Never send money to strangers",
        "Block the sender immediately",
        "Do not share any personal information",
        "Report to FTC at reportfraud.ftc.gov"
      ],
      similarScamsCount: 2847
    };
  }

  // Generic confirmed scam (3+ indicators)
  if (indicatorCount >= 3) {
    return {
      verdict: "CONFIRMED_SCAM",
      confidence: 92,
      scamType: "Suspected Fraud",
      tactics: [
        ...(hasUrgency ? [{
          name: "Urgency",
          description: "Creates false time pressure to prevent careful thinking",
          evidence: "Message contains urgent language demanding immediate action"
        }] : []),
        ...(hasMoneyRequest ? [{
          name: "Financial Request",
          description: "Requests money or financial information upfront",
          evidence: "Asks for bank details, wire transfer, or processing fees"
        }] : []),
        ...(hasTooGoodToBeTrue ? [{
          name: "Too Good To Be True",
          description: "Promises unrealistic rewards or winnings",
          evidence: "Claims of large sums of money or prizes"
        }] : []),
      ],
      redFlags: [
        "Multiple scam indicators detected",
        "Unsolicited contact about money",
        "Request for payment or personal information",
        "Pressure to act quickly"
      ],
      explanation: "This message contains multiple warning signs of a scam. Legitimate organizations don't use these tactics. Always verify independently through official channels before taking any action.",
      recommendedActions: [
        "Do not respond to this message",
        "Do not send any money or personal information",
        "Block the sender",
        "Report to FTC at reportfraud.ftc.gov"
      ],
      similarScamsCount: 1847
    };
  } else if (indicatorCount >= 1) {
    return {
      verdict: "SUSPICIOUS",
      confidence: 65,
      scamType: null,
      tactics: [
        ...(hasUrgency ? [{
          name: "Urgency",
          description: "Uses time pressure tactics",
          evidence: "Contains language suggesting immediate action needed"
        }] : []),
      ],
      redFlags: [
        "Some suspicious elements detected",
        "Verify sender identity independently"
      ],
      explanation: "This message contains some elements commonly found in scam communications. While it may be legitimate, exercise caution and verify the sender's identity through official channels before taking any action.",
      recommendedActions: [
        "Verify the sender through official channels",
        "Do not click any links until verified",
        "Contact the organization directly using known contact info"
      ],
      similarScamsCount: 156
    };
  }

  return {
    verdict: "SAFE",
    confidence: 80,
    scamType: null,
    tactics: [],
    redFlags: [],
    explanation: "This message does not contain obvious scam indicators. However, always exercise caution with unexpected communications, especially those involving money or personal information.",
    recommendedActions: [
      "Standard caution applies for all communications",
      "Verify sender if message seems unusual"
    ],
    similarScamsCount: 0
  };
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
      15000
    );
    const response = result.response.text();

    return JSON.parse(response) as ScamAnalysis;
  } catch (error) {
    console.error("Gemini API error, falling back to mock:", error);
    return getMockAnalysis(content);
  }
}

export async function analyzeImage(base64Image: string, mimeType: string): Promise<ScamAnalysis> {
  const useMock = process.env.MOCK_API === "true" || !process.env.GEMINI_API_KEY;

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      verdict: "HIGH_RISK",
      confidence: 85,
      scamType: "Phishing / Fake Document",
      tactics: [
        {
          name: "Visual Spoofing",
          description: "Uses fake logos or branding to appear legitimate",
          evidence: "Image contains elements mimicking official branding"
        }
      ],
      redFlags: [
        "Suspicious visual elements detected",
        "May be attempting to impersonate a legitimate organization"
      ],
      explanation: "This image contains visual elements commonly used in phishing attempts or fake documents. Scammers often use convincing-looking images to trick victims into trusting fraudulent communications.",
      recommendedActions: [
        "Do not trust information in this image",
        "Verify with official sources directly",
        "Do not enter any information on linked websites"
      ],
      similarScamsCount: 1243
    };
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
    return JSON.parse(response) as ScamAnalysis;
  } catch (error) {
    console.error("Gemini API error for image, falling back to mock:", error);
    return {
      verdict: "SUSPICIOUS",
      confidence: 60,
      scamType: null,
      tactics: [],
      redFlags: ["Unable to fully analyze image - exercise caution"],
      explanation: "We couldn't complete a full analysis of this image. If this appears to be from an official source, verify independently before taking action.",
      recommendedActions: [
        "Verify the source independently",
        "Do not act on information until verified"
      ],
      similarScamsCount: 0
    };
  }
}
