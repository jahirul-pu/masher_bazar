'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  Search,
  Filter,
  X,
  Check,
  Tag,
  Boxes,
} from 'lucide-react';
import { DEFAULT_INVENTORY_PRODUCTS, InventoryItem } from '@masik/business-rules';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'wms' | 'inventory' | 'procurement' | 'subscriptions'>('wms');
  const [waveGenerated, setWaveGenerated] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Background Inventory Management State
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(DEFAULT_INVENTORY_PRODUCTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    nameEn: '',
    nameBn: '',
    category: 'চাল',
    categorySlug: 'staples_rice',
    brand: 'Masher Bazar Essentials',
    unit: 'KG',
    unitValue: 25,
    mrp: 2100,
    masikPrice: 1890,
    purchaseCost: 1700,
    physicalStock: 300,
    batchNumber: `BAT-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-01`,
    sku: '',
    isPrivateLabel: false,
  });

  // Load stored custom inventory on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('masik_inventory_catalog');
      if (stored) {
        const parsed: InventoryItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge avoiding duplicate IDs
          const existingIds = new Set(DEFAULT_INVENTORY_PRODUCTS.map((i) => i.id));
          const customOnly = parsed.filter((p) => !existingIds.has(p.id));
          setInventoryList([...DEFAULT_INVENTORY_PRODUCTS, ...customOnly]);
        }
      }
    } catch {
      // fallback to default
    }
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nameEn || !newProduct.nameBn) return;

    const uniqueId = `p-custom-${Date.now()}`;
    const generatedSku =
      newProduct.sku.trim() ||
      `${newProduct.categorySlug.slice(0, 4).toUpperCase()}-${newProduct.brand.slice(0, 4).toUpperCase()}-${newProduct.unitValue}${newProduct.unit}`;

    const createdItem: InventoryItem = {
      id: uniqueId,
      variantId: `v-${uniqueId}`,
      sku: generatedSku,
      nameEn: newProduct.nameEn,
      nameBn: newProduct.nameBn,
      category: newProduct.category,
      categorySlug: newProduct.categorySlug,
      brand: newProduct.brand,
      unit: newProduct.unit,
      unitValue: Number(newProduct.unitValue),
      masikPrice: Number(newProduct.masikPrice),
      mrp: Number(newProduct.mrp),
      purchaseCost: Number(newProduct.purchaseCost),
      stockAvailable: Number(newProduct.physicalStock),
      physicalStock: Number(newProduct.physicalStock),
      reservedStock: 0,
      batchNumber: newProduct.batchNumber,
      status: Number(newProduct.physicalStock) > 30 ? 'Healthy' : 'Low Stock',
      isPrivateLabel: newProduct.isPrivateLabel,
    };

    const updated = [createdItem, ...inventoryList];
    setInventoryList(updated);

    try {
      localStorage.setItem('masik_inventory_catalog', JSON.stringify(updated));
      window.dispatchEvent(new Event('inventory_updated'));
      // Attempt backend persistence
      fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdItem),
      }).catch(() => {});
    } catch {}

    setNotification(`পণ্য "${createdItem.nameBn}" সফলভাবে ইনভেন্টরিতে যুক্ত হয়েছে!`);
    setTimeout(() => setNotification(null), 4000);
    setIsAddModalOpen(false);

    // Reset form
    setNewProduct({
      nameEn: '',
      nameBn: '',
      category: 'চাল',
      categorySlug: 'staples_rice',
      brand: 'Masher Bazar Essentials',
      unit: 'KG',
      unitValue: 5,
      mrp: 500,
      masikPrice: 450,
      purchaseCost: 400,
      physicalStock: 200,
      batchNumber: `BAT-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-02`,
      sku: '',
      isPrivateLabel: false,
    });
  };

  const handleRestock = (sku: string) => {
    const updated = inventoryList.map((item) => {
      if (item.sku === sku) {
        const added = 50;
        return {
          ...item,
          physicalStock: item.physicalStock + added,
          stockAvailable: item.stockAvailable + added,
          status: 'Healthy' as const,
        };
      }
      return item;
    });
    setInventoryList(updated);
    try {
      localStorage.setItem('masik_inventory_catalog', JSON.stringify(updated));
      window.dispatchEvent(new Event('inventory_updated'));
    } catch {}
    setNotification(`SKU ${sku} এ +৫০ ইউনিট যুক্ত করা হয়েছে`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered inventory list
  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameBn.includes(searchQuery) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <span className="font-black text-lg text-white tracking-tight">Masher Bazar</span>
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

        {/* Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 text-sm font-bold flex items-center justify-between animate-fade-in shadow-lg shadow-emerald-950/50">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 2: Inventory & Batch Alerts */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Inventory KPI Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Total Catalog SKUs</span>
                <span className="text-2xl font-black text-white mt-1 block">{inventoryList.length}</span>
                <span className="text-[10px] text-teal-400 font-bold block mt-1">Across 8 FMCG Categories</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Physical Warehouse Stock</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {inventoryList.reduce((acc, i) => acc + i.physicalStock, 0).toLocaleString()} units
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-1">Tejgaon & Mirpur Hubs</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Net Available for Orders</span>
                <span className="text-2xl font-black text-teal-300 mt-1 block">
                  {inventoryList.reduce((acc, i) => acc + i.stockAvailable, 0).toLocaleString()} units
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">After Active Wave Reservations</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Low Stock Warnings</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  {inventoryList.filter((i) => i.status === 'Low Stock' || i.stockAvailable < 50).length}
                </span>
                <span className="text-[10px] text-amber-400 font-bold block mt-1">Requires Reorder / PO</span>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
              {/* Header with Title and Add Product Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-teal-400" />
                    <span>Central Inventory Control & Warehouse Catalog</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hub: Dhaka Central Fulfillment Center | Real-time Batch Allocation & Margin Audits
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন পণ্য যুক্ত করুন (Add Product)</span>
                </button>
              </div>

              {!alertDismissed && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-200">
                      <strong>Reorder Alert:</strong> Teer Pure Soybean Oil 5L inventory has fallen below the 7-day safety buffer (85 units remaining vs 150 expected demand).
                    </p>
                  </div>
                  <button
                    onClick={() => setAlertDismissed(true)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold shrink-0"
                  >
                    Draft PO
                  </button>
                </div>
              )}

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Product Name, Bangla Name, SKU, Brand, or Batch..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                  {['ALL', 'চাল', 'ডাল', 'তেল', 'ঘি', 'আটা', 'ময়দা', 'আলু', 'পেঁয়াজ', 'লবণ', 'চিনি', 'মসলা', 'পরিচ্ছন্নতা', 'ব্যক্তিগত যত্ন', 'গৃহস্থালী টিস্যু'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-teal-600 text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Product Name (EN / BN)</th>
                      <th className="p-3">Category & Brand</th>
                      <th className="p-3">Batch #</th>
                      <th className="p-3">Market (MRP)</th>
                      <th className="p-3">Masik Price</th>
                      <th className="p-3">Physical</th>
                      <th className="p-3">Reserved</th>
                      <th className="p-3">Available</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-slate-400 text-sm">
                          কোনো পণ্য পাওয়া যায়নি (No products found matching "{searchQuery}")
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => (
                        <tr key={item.sku} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono text-slate-300 font-semibold">{item.sku}</td>
                          <td className="p-3">
                            <div className="font-bold text-white text-xs">{item.nameEn}</div>
                            <div className="text-[11px] text-teal-400 font-medium">{item.nameBn}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-[11px] text-slate-300 block">{item.category}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">{item.brand}</span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{item.batchNumber}</td>
                          <td className="p-3 text-slate-400 line-through">৳{item.mrp}</td>
                          <td className="p-3 font-bold text-emerald-400">৳{item.masikPrice}</td>
                          <td className="p-3 font-semibold">{item.physicalStock} {item.unit}</td>
                          <td className="p-3 text-amber-400">{item.reservedStock} {item.unit}</td>
                          <td className="p-3 font-black text-teal-300">{item.stockAvailable} {item.unit}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block border ${
                                item.status === 'Healthy'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRestock(item.sku)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-all border border-slate-700"
                              title="Add 50 units replenishment"
                            >
                              +৫০ রিস্টক
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Add New Product to Inventory */}
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Boxes className="w-6 h-6 text-teal-400" />
                        <span>ইনভেন্টরিতে নতুন পণ্য যুক্ত করুন</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Add New Staple / SKU to Masher Bazar Central Catalog & Inventory
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    {/* Names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Product Name (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.nameEn}
                          onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                          placeholder="e.g. Pran Chinigura Polao Rice 5kg"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Product Name (বাংলা) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.nameBn}
                          onChange={(e) => setNewProduct({ ...newProduct, nameBn: e.target.value })}
                          placeholder="যেমন: প্রাণ চিনিগুঁড়া পোলাও চাল ৫ কেজি"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Category & Brand */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Category (বিভাগ) *
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            const slugMap: Record<string, string> = {
                              'চাল': 'staples_rice',
                              'ডাল': 'lentils_dal',
                              'তেল': 'cooking_oil',
                              'ঘি': 'dairy_ghee',
                              'আটা': 'staples_flour',
                              'ময়দা': 'staples_maida',
                              'আলু': 'produce_potato',
                              'পেঁয়াজ': 'produce_onion',
                              'লবণ': 'cooking_salt',
                              'চিনি': 'grocery_sugar',
                              'মসলা': 'spices',
                              'পরিচ্ছন্নতা': 'cleaning_detergent',
                              'ব্যক্তিগত যত্ন': 'personal_care',
                              'গৃহস্থালী টিস্যু': 'household_tissue',
                            };
                            setNewProduct({
                              ...newProduct,
                              category: val,
                              categorySlug: slugMap[val] || 'staples',
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        >
                          <option value="চাল">চাল (Rice)</option>
                          <option value="ডাল">ডাল (Lentils / Dal)</option>
                          <option value="তেল">তেল (Edible Oil)</option>
                          <option value="ঘি">ঘি (Ghee)</option>
                          <option value="আটা">আটা (Whole Wheat Atta)</option>
                          <option value="ময়দা">ময়দা (Refined Flour / Maida)</option>
                          <option value="আলু">আলু (Potato)</option>
                          <option value="পেঁয়াজ">পেঁয়াজ (Onion)</option>
                          <option value="লবণ">লবণ (Salt)</option>
                          <option value="চিনি">চিনি (Sugar)</option>
                          <option value="মসলা">মসলা (Spices)</option>
                          <option value="পরিচ্ছন্নতা">পরিচ্ছন্নতা (Cleaning & Detergent)</option>
                          <option value="ব্যক্তিগত যত্ন">ব্যক্তিগত যত্ন (Personal Care & Soap)</option>
                          <option value="গৃহস্থালী টিস্যু">গৃহস্থালী টিস্যু (Tissue & Paper)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Brand (ব্র্যান্ড) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                          placeholder="e.g. Pran / Chashi / Teer / ACI"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Unit & SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Unit Type (পরিমাপ একক)
                        </label>
                        <select
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        >
                          <option value="KG">কেজি (KG)</option>
                          <option value="LITER">লিটার (LITER)</option>
                          <option value="PACK">প্যাক (PACK)</option>
                          <option value="PCS">পিস (PCS)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Pack Size Value (মান)
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={newProduct.unitValue}
                          onChange={(e) => setNewProduct({ ...newProduct, unitValue: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          SKU (ঐচ্ছিক / অটো তৈরি)
                        </label>
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                          placeholder="যেমন: RICE-PRAN-CHINI-5K"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Pricing Tier & Margin Guard */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Market MRP (বাজার মূল্য ৳)
                        </label>
                        <input
                          type="number"
                          required
                          value={newProduct.mrp}
                          onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-emerald-400 block mb-1">
                          Masher Price (বিক্রয় মূল্য ৳)
                        </label>
                        <input
                          type="number"
                          required
                          value={newProduct.masikPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, masikPrice: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-emerald-700/80 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">
                          Purchase Cost (ক্রয় খরচ ৳)
                        </label>
                        <input
                          type="number"
                          required
                          value={newProduct.purchaseCost}
                          onChange={(e) => setNewProduct({ ...newProduct, purchaseCost: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      {/* Live Calculated Stats */}
                      <div className="sm:col-span-3 flex items-center justify-between text-xs pt-1 px-1">
                        <span className="text-emerald-400 font-bold">
                          ✓ গ্রাহক সাশ্রয়: ৳{Math.max(0, newProduct.mrp - newProduct.masikPrice)} (
                          {newProduct.mrp > 0
                            ? Math.round(((newProduct.mrp - newProduct.masikPrice) / newProduct.mrp) * 100)
                            : 0}
                          %)
                        </span>
                        <span
                          className={`font-bold ${
                            newProduct.masikPrice > 0 &&
                            ((newProduct.masikPrice - newProduct.purchaseCost) / newProduct.masikPrice) * 100 >= 8
                              ? 'text-teal-400'
                              : 'text-amber-400'
                          }`}
                        >
                          মার্জিন:{' '}
                          {newProduct.masikPrice > 0
                            ? Math.round(
                                ((newProduct.masikPrice - newProduct.purchaseCost) / newProduct.masikPrice) * 1000
                              ) / 10
                            : 0}
                          % (নূন্যতম লক্ষ্য: ৮%)
                        </span>
                      </div>
                    </div>

                    {/* Stock & Batch */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Initial Stock Quantity (প্রাথমিক স্টক) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={newProduct.physicalStock}
                          onChange={(e) => setNewProduct({ ...newProduct, physicalStock: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Batch Number (ব্যাচ কোড)
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.batchNumber}
                          onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Private Label Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isPrivateLabel"
                        checked={newProduct.isPrivateLabel}
                        onChange={(e) => setNewProduct({ ...newProduct, isPrivateLabel: e.target.checked })}
                        className="rounded border-slate-700 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="isPrivateLabel" className="text-xs text-slate-300 font-medium">
                        এটি মাসিকের নিজস্ব ব্র্যান্ড (Masher Bazar Essentials / Private Label)
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                      >
                        বাতিল করুন (Cancel)
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-950/50 transition-all"
                      >
                        ✓ ইনভেন্টরিতে সংরক্ষণ করুন (Save to Inventory)
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
