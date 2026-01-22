import Head from "next/head";
import React, { useMemo, useState } from "react";

function parseMoney(v: string) {
  const cleaned = (v || "").replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function sanitizeNumericInput(value: string) {
  // Allow digits + one dot; strip everything else
  let v = (value || "").replace(/[^0-9.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }
  return v;
}

function formatPct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

export default function Home() {
  // Ad Spend first
  const [adSpend, setAdSpend] = useState("");
  const [adRevenue, setAdRevenue] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Helper text on focus
  const [focusedField, setFocusedField] = useState<
    "spend" | "revenue" | null
  >(null);

  const adSpendNum = useMemo(() => parseMoney(adSpend), [adSpend]);
  const adRevenueNum = useMemo(() => parseMoney(adRevenue), [adRevenue]);

  const canCalculate =
    Number.isFinite(adRevenueNum) &&
    Number.isFinite(adSpendNum) &&
    adRevenueNum > 0;

  const acos = canCalculate ? (adSpendNum / adRevenueNum) * 100 : NaN;

  function onCalculate() {
    setShowResult(true);
  }

  function onClear() {
    setAdSpend("");
    setAdRevenue("");
    setShowResult(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canCalculate) return;
    onCalculate();
  }

  return (
    <>
      <Head>
        <title>Amazon ACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Amazon Advertising Cost of Sales (ACoS) using Ad Spend and Ad Revenue."
        />
      </Head>

      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
          {/* Breadcrumbs */}
          <div className="mb-8 flex justify-center text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <span className="mx-2 text-[#F7C948]">→</span>
            <span className="hover:text-gray-700 cursor-pointer">Tools</span>
            <span className="mx-2 text-[#F7C948]">→</span>
            <span className="font-medium text-gray-900">
              Amazon ACoS Calculator
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Amazon ACoS Calculator
            </h1>

            <div className="mt-4 text-lg text-gray-600 leading-snug">
              <div>
                Calculate your{" "}
                <span className="font-semibold text-gray-900">
                  Advertising Cost of Sales (ACoS)
                </span>{" "}
                instantly.
              </div>
              <div className="mt-1">
                Enter your ad spend and ad revenue, then click calculate.
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              {/* Form enables Enter key submit */}
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Ad Spend FIRST */}
                <div>
                  <div className="mb-2 font-medium text-gray-900">
                    Ad Spend ($)
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={adSpend}
                    onFocus={() => setFocusedField("spend")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setAdSpend(sanitizeNumericInput(e.target.value));
                      setShowResult(false);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      setAdSpend(sanitizeNumericInput(text));
                      setShowResult(false);
                    }}
                    placeholder="e.g. 300"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                  {focusedField === "spend" && (
                    <div className="mt-2 text-sm text-gray-500">
                      Enter your total ad spend (numbers only).
                    </div>
                  )}
                </div>

                {/* Ad Revenue SECOND */}
                <div>
                  <div className="mb-2 font-medium text-gray-900">
                    Ad Revenue ($)
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={adRevenue}
                    onFocus={() => setFocusedField("revenue")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setAdRevenue(sanitizeNumericInput(e.target.value));
                      setShowResult(false);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      setAdRevenue(sanitizeNumericInput(text));
                      setShowResult(false);
                    }}
                    placeholder="e.g. 1500"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                  {focusedField === "revenue" && (
                    <div className="mt-2 text-sm text-gray-500">
                      Enter your ad-attributed revenue (numbers only).
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!canCalculate}
                  className={[
                    "w-full h-12 rounded-full font-semibold transition",
                    canCalculate
                      ? "bg-[#F7C948] text-gray-900 hover:bg-gray-900 hover:text-[#F7C948]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  Calculate ACoS
                </button>

                {/* Result only after submit/click */}
                {showResult ? (
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-[#D0E0C9] p-6 text-center">
                    <div className="text-sm font-semibold text-gray-700">
                      Your ACoS is
                    </div>
                    <div className="mt-2 text-5xl font-bold text-gray-900">
                      {formatPct(acos)}
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Formula:{" "}
                      <span className="font-semibold">
                        (Ad Spend ÷ Ad Revenue) × 100
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onClear}
                      className="mt-4 text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </form>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            Tip: A “good” ACoS depends on your margins and goals (ranking vs
            profit).
          </div>
        </div>
      </div>
    </>
  );
}
