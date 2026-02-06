"use client";

import { useState } from "react";
import { Trophy, X, Check, ArrowRight, RotateCcw, Zap, Brain } from "lucide-react";

interface QuizQuestion {
  id: number;
  real: string;
  scam: string;
  explanation: string;
  scamType: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    real: "Hi, this is Dr. Smith's office. Your appointment is confirmed for Tuesday at 2pm. Reply YES to confirm or call us to reschedule.",
    scam: "Hi Mom, it's me! I dropped my phone and this is my new number. I'm in trouble and need you to send $500 right away. Don't tell Dad!",
    explanation: "The 'Hi Mom' scam exploits parental instincts. Real family would call or video chat to prove identity.",
    scamType: "Family Impersonation",
  },
  {
    id: 2,
    real: "Your Amazon order #112-3847291 has shipped. Track at amazon.com/orders",
    scam: "URGENT: Your Amazon account charged $499.99. Call 1-888-555-0147 immediately to cancel or your card will be charged!",
    explanation: "Amazon never asks you to call about charges. Always check your actual Amazon account directly.",
    scamType: "Fake Invoice Scam",
  },
  {
    id: 3,
    real: "Chase: Did you attempt a $42.50 purchase at TARGET? Reply YES or NO.",
    scam: "Wells Fargo Alert: Suspicious $2,847 transfer detected! Click here to verify: wellsfarg0-secure.com/verify",
    explanation: "Notice the fake domain with a zero instead of 'o'. Banks never send verification links via text.",
    scamType: "Bank Phishing",
  },
  {
    id: 4,
    real: "IRS: Your 2024 tax refund of $1,247 has been direct deposited to your account ending in 4521.",
    scam: "FINAL IRS NOTICE: You owe $4,832. Pay immediately with gift cards to avoid arrest. Call 1-800-555-0199 NOW!",
    explanation: "The IRS NEVER demands payment via gift cards or threatens immediate arrest. They always mail first.",
    scamType: "Government Impersonation",
  },
  {
    id: 5,
    real: "FedEx: Your package is out for delivery today. Driver will arrive between 2-6pm.",
    scam: "Your package cannot be delivered due to unpaid customs fee of $1.99. Pay here to release: fedx-delivery.com/pay",
    explanation: "Fake delivery scams use tiny fees to steal card details. Note the misspelled domain 'fedx'.",
    scamType: "Delivery Scam",
  },
  {
    id: 6,
    real: "Coinbase: You sold 0.25 BTC for $16,432.50. Funds available in your linked bank account in 1-3 business days.",
    scam: "🚀 GUARANTEED 500% returns! Our AI trading bot turns 0.5 ETH into 10 ETH in 30 days. Only 12 spots left! Deposit now: 0x742d35Cc6634C...",
    explanation: "No investment guarantees returns. 'Guaranteed profit' + 'limited spots' + crypto wallet address = textbook scam. Your crypto is gone forever once sent.",
    scamType: "Crypto Scam",
  },
];

export function ScamQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [, setSelectedAnswer] = useState<"real" | "scam" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  // Randomly decide which side shows the scam - changes per question
  const [scamPositions] = useState(() =>
    QUIZ_QUESTIONS.map(() => Math.random() > 0.5)
  );
  const scamOnLeft = scamPositions[currentQuestion];
  const leftMessage = scamOnLeft ? question.scam : question.real;
  const rightMessage = scamOnLeft ? question.real : question.scam;
  const correctAnswer = scamOnLeft ? "left" : "right";

  const handleSelect = (side: "left" | "right") => {
    const userPickedScam = side === (scamOnLeft ? "left" : "right");
    const isCorrect = side === correctAnswer;

    setSelectedAnswer(userPickedScam ? "scam" : "real");
    setShowResult(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setGameComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    if (percentage === 100) return { title: "PERFECT!", subtitle: "You're scam-proof!", emoji: "🏆" };
    if (percentage >= 80) return { title: "EXPERT!", subtitle: "Scammers hate you", emoji: "🛡️" };
    if (percentage >= 60) return { title: "GOOD!", subtitle: "Stay vigilant", emoji: "👍" };
    if (percentage >= 40) return { title: "CAREFUL!", subtitle: "Keep learning", emoji: "⚠️" };
    return { title: "AT RISK!", subtitle: "Study these scams", emoji: "🚨" };
  };

  if (gameComplete) {
    const scoreMsg = getScoreMessage();
    return (
      <div className="brutal-card p-8 text-center brutal-shadow-lg animate-scale-in">
        <div className="text-6xl mb-4">{scoreMsg.emoji}</div>
        <h3 className="font-display text-4xl text-[#0a0a0a] dark:text-[#fafafa] mb-2">{scoreMsg.title}</h3>
        <p className="text-[#525252] dark:text-[#a3a3a3] mb-4">{scoreMsg.subtitle}</p>

        <div className="brutal-card brutal-card-dark p-6 mb-6">
          <p className="font-display text-5xl text-[#facc15]">{score}/{QUIZ_QUESTIONS.length}</p>
          <p className="text-xs uppercase tracking-wider text-white/60 mt-2">Scams Identified</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 brutal-btn brutal-btn-secondary py-3 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={() => {
              const shareText = `🎯 I scored ${score}/${QUIZ_QUESTIONS.length} on the Scam Shield Quiz! Can you beat my score? Test your scam-spotting skills!`;
              if (navigator.share) {
                navigator.share({ title: "Scam Shield Quiz", text: shareText });
              } else {
                navigator.clipboard.writeText(shareText);
              }
            }}
            className="flex-1 brutal-btn brutal-btn-primary py-3 flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Share Score
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="brutal-label brutal-label-yellow">
          <Brain className="w-3 h-3" />
          SCAM QUIZ
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-[#525252] dark:text-[#a3a3a3]">
            {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </span>
          <span className="brutal-label brutal-label-black">
            <Zap className="w-3 h-3" />
            {score} PTS
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="brutal-card p-4 brutal-shadow">
        <p className="font-display text-xl text-[#0a0a0a] dark:text-[#fafafa] mb-2">WHICH ONE IS THE SCAM?</p>
        <p className="text-sm text-[#525252] dark:text-[#a3a3a3]">Tap the message you think is a scam attempt</p>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        <button
          onClick={() => !showResult && handleSelect("left")}
          disabled={showResult}
          className={`brutal-card p-4 text-left transition-all duration-200 ${
            showResult
              ? scamOnLeft
                ? "border-[#ef4444] bg-[#fee2e2]"
                : "border-[#22c55e] bg-[#dcfce7]"
              : "hover:brutal-shadow-lg cursor-pointer"
          }`}
        >
          <div className="flex items-start gap-3">
            {showResult && (
              <div className={`p-1 rounded-full ${scamOnLeft ? "bg-[#ef4444]" : "bg-[#22c55e]"}`}>
                {scamOnLeft ? <X className="w-4 h-4 text-white" /> : <Check className="w-4 h-4 text-white" />}
              </div>
            )}
            <p className="text-sm text-[#0a0a0a] dark:text-[#fafafa] whitespace-pre-wrap">{leftMessage}</p>
          </div>
        </button>

        <div className="text-center text-xs font-bold text-[#525252] dark:text-[#a3a3a3] uppercase tracking-wider">or</div>

        <button
          onClick={() => !showResult && handleSelect("right")}
          disabled={showResult}
          className={`brutal-card p-4 text-left transition-all duration-200 ${
            showResult
              ? !scamOnLeft
                ? "border-[#ef4444] bg-[#fee2e2]"
                : "border-[#22c55e] bg-[#dcfce7]"
              : "hover:brutal-shadow-lg cursor-pointer"
          }`}
        >
          <div className="flex items-start gap-3">
            {showResult && (
              <div className={`p-1 rounded-full ${!scamOnLeft ? "bg-[#ef4444]" : "bg-[#22c55e]"}`}>
                {!scamOnLeft ? <X className="w-4 h-4 text-white" /> : <Check className="w-4 h-4 text-white" />}
              </div>
            )}
            <p className="text-sm text-[#0a0a0a] dark:text-[#fafafa] whitespace-pre-wrap">{rightMessage}</p>
          </div>
        </button>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="brutal-card brutal-card-yellow p-4 animate-scale-in">
          <p className="font-bold text-[#0a0a0a] dark:text-[#0a0a0a] mb-1">{question.scamType}</p>
          <p className="text-sm text-[#525252] dark:text-[#0a0a0a]/70">{question.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {showExplanation && (
        <button
          onClick={handleNext}
          className="w-full brutal-btn brutal-btn-dark py-4 flex items-center justify-center gap-2 animate-scale-in"
        >
          {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              See Results
              <Trophy className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
