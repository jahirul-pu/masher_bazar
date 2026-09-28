'use client';

import React, { useState } from 'react';
import {
  Layers,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Truck,
  Users,
  Building,
  RefreshCw,
  Barcode,
  ShoppingBag,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'wms' | 'inventory' | 'procurement' | 'subscriptions'>('wms');
  const [waveGenerated, setWaveGenerated] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">Masik Bazar</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ops & WMS Center
              </span>
            </div>
            <span className="text-xs text-slate-400">Hub: Dhaka Central (Mirpur 12) | Role: Super Admin</span>
          </div>
        </div>

        {/* Quick Hub Status */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Fulfillment Pipeline Active</span>
          </div>
          <div className="text-slate-400">
            Current Date: <span className="text-white font-bold">{new Date().toDateString()}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Executive Overview KPI Strip (Section 50 PRD) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Today’s Orders</span>
            <span className="text-2xl font-black text-white mt-1 block">142</span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">↑ 18% vs yesterday</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Monthly Orders</span>
            <span className="text-2xl font-black text-white mt-1 block">1,250</span>
            <span className="text-[10px] text-slate-400 block mt-1">Forecast: 1,400</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Monthly GMV</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">৳৭৪.২ লাখ</span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">৳5,936 Avg Basket</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Gross Margin</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">14.2%</span>
            <span className="text-[10px] text-slate-400 block mt-1">Target: &gt; 12.0%</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Active Subscribers</span>
            <span className="text-2xl font-black text-teal-400 mt-1 block">890</span>
            <span className="text-[10px] text-teal-400 font-bold block mt-1">71.2% Repeat Rate</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Savings Given</span>
            <span className="text-2xl font-black text-white mt-1 block">৳৬.৪ লাখ</span>
            <span className="text-[10px] text-slate-400 block mt-1">8.6% Customer Avg</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('wms')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'wms'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>WMS Wave Picking (সেকশন ৪১)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory & Batches (সেকশন ৩৮)</span>
          </button>

          <button
            onClick={() => setActiveTab('procurement')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'procurement'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Bulk Procurement & PO (সেকশন ৩৪)</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'subscriptions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Subscription & Salary Cycle (সেকশন ২৫)</span>
          </button>
        </div>

        {/* Tab 1: WMS Wave Picking Console */}
        {activeTab === 'wms' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <span>Morning Slot Wave Generator (9 AM – 12 PM)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Groups slot-bound orders into single warehouse picking runs rather than picking individual orders.
                  </p>
                </div>

                <button
                  onClick={() => setWaveGenerated(true)}
                  disabled={waveGenerated}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    waveGenerated
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${waveGenerated ? '' : 'animate-spin'}`} />
                  <span>{waveGenerated ? '✓ Wave #WAVE-10042 Generated' : 'Generate Wave Batch (100 Orders)'}</span>
                </button>
              </div>

              {/* Aggregated Bulk Demand Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">SKU & Item Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Aggregated Qty</th>
                      <th className="p-3">Bin Location</th>
                      <th className="p-3">QC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">Chashi Miniket Rice 25kg</td>
                      <td className="p-3 text-slate-400">Staples</td>
                      <td className="p-3 font-bold text-emerald-400">1,850 kg (74 sacks)</td>
                      <td className="p-3 text-amber-400">AISLE-A1-BIN-04</td>
                      <td className="p-3 text-emerald-400">✓ Picked & Staged</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Rupchanda Soybean Oil 5L</td>
                      <td className="p-3 text-slate-400">Cooking</td>
                      <td className="p-3 font-bold text-emerald-400">420 Liters (84 cans)</td>
                      <td className="p-3 text-amber-400">AISLE-B2-BIN-11</td>
                      <td className="p-3 text-emerald-400">✓ Picked & Staged</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">ACI Pure Masoor Dal 2kg</td>
                      <td className="p-3 text-slate-400">Staples</td>
                      <td className="p-3 font-bold text-emerald-400">280 kg (140 packs)</td>
                      <td className="p-3 text-amber-400">AISLE-A3-BIN-02</td>
                      <td className="p-3 text-slate-400">In Picking (80/140)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Munshiganj Potato 5kg Bag</td>
                      <td className="p-3 text-slate-400">Produce</td>
                      <td className="p-3 font-bold text-emerald-400">450 kg (90 bags)</td>
                      <td className="p-3 text-amber-400">COLD-BAY-01</td>
                      <td className="p-3 text-emerald-400">✓ Picked & Staged</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory & Batch Alerts */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-400" />
                  <span>Inventory Control & Batch Tracking</span>
                </h3>
                <span className="text-xs text-slate-400">Warehouse: Dhaka Central Hub</span>
              </div>

              {!alertDismissed && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-200">
                      <strong>Reorder Alert:</strong> Teer Pure Soybean Oil 5L inventory has fallen below the 7-day safety buffer (85 units remaining vs 150 expected demand).
                    </p>
                  </div>
                  <button
                    onClick={() => setAlertDismissed(true)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    Draft PO
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Batch #</th>
                      <th className="p-3">Physical Stock</th>
                      <th className="p-3">Reserved</th>
                      <th className="p-3">Available</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="p-3 font-mono text-slate-400">RICE-MINI-MB-25K</td>
                      <td className="p-3 font-semibold">Masik Essentials Miniket 25kg</td>
                      <td className="p-3 font-mono text-xs">BAT-260901</td>
                      <td className="p-3">500 units</td>
                      <td className="p-3 text-amber-400">142 units</td>
                      <td className="p-3 font-bold text-emerald-400">358 units</td>
                      <td className="p-3 text-emerald-400">Healthy</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-slate-400">OIL-SOYA-RUP-5L</td>
                      <td className="p-3 font-semibold">Rupchanda Soybean Oil 5L</td>
                      <td className="p-3 font-mono text-xs">BAT-260814</td>
                      <td className="p-3">450 units</td>
                      <td className="p-3 text-amber-400">110 units</td>
                      <td className="p-3 font-bold text-emerald-400">340 units</td>
                      <td className="p-3 text-emerald-400">Healthy</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-slate-400">OIL-SOYA-TEER-5L</td>
                      <td className="p-3 font-semibold">Teer Soybean Oil 5L</td>
                      <td className="p-3 font-mono text-xs">BAT-260720</td>
                      <td className="p-3 text-amber-400">85 units</td>
                      <td className="p-3 text-amber-400">55 units</td>
                      <td className="p-3 font-bold text-amber-400">30 units</td>
                      <td className="p-3 text-amber-400">⚠️ Low Stock</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Procurement & PO */}
        {activeTab === 'procurement' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-400" />
                    <span>Demand Forecasting & Supplier PO Generator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Aggregates next 14 days recurring subscription orders into distributor purchase orders.
                  </p>
                </div>
              </div>

              {/* Supplier PO Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">City Group (Teer)</h4>
                      <p className="text-xs text-slate-400">Contract: Net 15 | Reliability Score: 98%</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      PO Ready
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Projected Demand (14-day):</span>
                      <span className="font-bold text-white">4,200 Liters Oil</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Purchase Value:</span>
                      <span className="font-bold text-emerald-400">৳৬,২১,৬০০</span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all">
                    Issue Purchase Order #PO-2609-01
                  </button>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">Square Consumer Products (Chashi)</h4>
                      <p className="text-xs text-slate-400">Contract: Net 30 | Reliability Score: 96%</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      PO Ready
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Projected Demand (14-day):</span>
                      <span className="font-bold text-white">18,500 kg Miniket Rice</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Purchase Value:</span>
                      <span className="font-bold text-emerald-400">৳১৩,৪৬,৮০০</span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all">
                    Issue Purchase Order #PO-2609-02
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Subscriptions & Salary Cycle */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Salary-Cycle Recurring Renewals</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Scheduled delivery batches aligned with customer corporate salary paydays (1st, 5th, 10th).
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Household</th>
                      <th className="p-3">Salary Payday</th>
                      <th className="p-3">Subscription Type</th>
                      <th className="p-3">Basket Amount</th>
                      <th className="p-3">Price Lock</th>
                      <th className="p-3">Next Scheduled Run</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">Hossain Household (Gulshan)</td>
                      <td className="p-3 text-emerald-400 font-bold">3rd of Month</td>
                      <td className="p-3">Smart Basket</td>
                      <td className="p-3 font-bold text-white">৳৫,৮৯০</td>
                      <td className="p-3 text-emerald-400">✓ 30-Day Locked</td>
                      <td className="p-3 text-slate-400">Oct 3, 2026</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Ahmed Household (Uttara)</td>
                      <td className="p-3 text-emerald-400 font-bold">5th of Month</td>
                      <td className="p-3">Same Basket</td>
                      <td className="p-3 font-bold text-white">৳৬,২০০</td>
                      <td className="p-3 text-slate-500">Standard</td>
                      <td className="p-3 text-slate-400">Oct 5, 2026</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Chowdhury Household (Dhanmondi)</td>
                      <td className="p-3 text-emerald-400 font-bold">1st of Month</td>
                      <td className="p-3">Custom Subscription</td>
                      <td className="p-3 font-bold text-white">৳৮,৪৫০</td>
                      <td className="p-3 text-emerald-400">✓ 30-Day Locked</td>
                      <td className="p-3 text-slate-400">Oct 1, 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
