import Head from "next/head";
import React, { useMemo, useState } from "react";

function parseMoney(v: string) {
  const cleaned = (v || "").replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function formatPct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

export default function Home() {
  const [adSales, setAdSales] = useState("");
  const [adSpend, setAdSpend] = useState("");
  const [showResult, setShowResult] = useState(false);

  const adSalesNum = useMemo(() => parseMoney(adSales), [adSales]);
  const adSpendNum = useMemo(() => parseMoney(adSpend), [adSpend]);

  const canCalculate =
    Number.isFinite(adSalesNum) &&
    Number.isFinite(adSpendNum) &&
    adSalesNum > 0;

  const acos = canCalculate ? (adSpendNum / adSalesNum) * 100 : NaN;

  return (
    <>
      <Head>
        <title>Amazon ACoS Calculator</title>
        <meta
          name="description"
          content="Calculate your Amazon Advertising Cost of Sales (ACoS) using Ad Sales and Ad Spend."
        />
      </Head>

      <div className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-16">
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
                Enter your ad sales and ad spend, then click calculate.
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="space-y-5">
                <div>
                  <div className="mb-2 font-medium text-gray-900">Ad Sales ($)</div>
                  <input
                    inputMode="decimal"
                    value={adSales}
                    onChange={(e) => {
                      setAdSales(e.target.value);
                      setShowResult(false);
                    }}
                    placeholder="e.g. 1500"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                </div>

                <div>
                  <div className="mb-2 font-medium text-gray-900">Ad Spend ($)</div>
                  <input
                    inputMode="decimal"
                    value={adSpend}
                    onChange={(e) => {
                      setAdSpend(e.target.value);
                      setShowResult(false);
                    }}
                    placeholder="e.g. 300"
                    className="w-full h-12 rounded-full border border-gray-200 px-5 outline-none focus:border-gray-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowResult(true)}
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

                {showResult ? (
                  <div className="mt-6 rounded-2xl border border-gray-100 bg-[#fbf6e7] p-6 text-center">
                    <div className="text-sm font-semibold text-gray-700">
                      Your ACoS is
                    </div>
                    <div className="mt-2 text-5xl font-bold text-gray-900">
                      {formatPct(acos)}
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Formula:{" "}
                      <span className="font-semibold">
                        (Ad Spend ÷ Ad Sales) × 100
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAdSales("");
                        setAdSpend("");
                        setShowResult(false);
                      }}
                      className="mt-4 text-sm font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Clear
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            Tip: A “good” ACoS depends on your margins and goals (ranking vs profit).
          </div>
        </div>
      </div>
    </>
  );
}
