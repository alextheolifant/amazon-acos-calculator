import Head from "next/head";
import { useMemo, useState } from "react";

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

  const acos = canCalculate
    ? (adSpendNum / adSalesNum) * 100
    : NaN;

  return (
    <>
      <Head>
        <title>Amazon ACoS Calculator</title>
      </Head>

      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm border border-gray-100 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Amazon ACoS Calculator
          </h1>

          <p className="mt-4 text-gray-600 leading-snug">
            Calculate your <strong>Advertising Cost of Sales (ACoS)</strong> instantly.
            <br />
            Enter your ad sales and ad spend, then click calculate.
          </p>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Ad Sales ($)"
              value={adSales}
              onChange={(e) => {
                setAdSales(e.target.value);
                setShowResult(false);
              }}
              className="w-full h-12 rounded-full border px-4"
            />

            <input
              placeholder="Ad Spend ($)"
              value={adSpend}
              onChange={(e) => {
                setAdSpend(e.target.value);
                setShowResult(false);
              }}
              className="w-full h-12 rounded-full border px-4"
            />

            <button
              onClick={() => setShowResult(true)}
              disabled={!canCalculate}
              className="w-full h-12 rounded-full font-semibold bg-yellow-400 hover:bg-gray-900 hover:text-yellow-400 transition disabled:opacity-50"
            >
              Calculate ACoS
            </button>
          </div>

          {showResult && (
            <div className="mt-6 bg-yellow-50 rounded-xl p-4">
              <div className="text-sm text-gray-600">Your ACoS is</div>
              <div className="text-4xl font-bold">{formatPct(acos)}</div>
              <div className="text-sm mt-1 text-gray-500">
                (Ad Spend ÷ Ad Sales) × 100
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
