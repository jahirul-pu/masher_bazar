import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

interface MobileBasketItem {
  id: string;
  nameBn: string;
  nameEn: string;
  qty: number;
  masikPrice: number;
  marketPrice: number;
  unit: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'market' | 'savings' | 'orders'>('market');
  const [isPriceLocked, setIsPriceLocked] = useState(false);

  const [items, setItems] = useState<MobileBasketItem[]>([
    { id: '1', nameBn: 'চাষী মিনিকেট চাল ২৫ কেজি', nameEn: 'Chashi Miniket 25kg', qty: 1, masikPrice: 1980, marketPrice: 2150, unit: '২৫ কেজি' },
    { id: '2', nameBn: 'রূপচাঁদা সয়াবিন তেল ৫ লিটার', nameEn: 'Rupchanda Oil 5L', qty: 1, masikPrice: 815, marketPrice: 860, unit: '৫ লিটার' },
    { id: '3', nameBn: 'এসিআই পিওর দেশি মসুর ডাল ২ কেজি', nameEn: 'ACI Masoor Dal 2kg', qty: 2, masikPrice: 310, marketPrice: 340, unit: '২ কেজি' },
    { id: '4', nameBn: 'ফ্রেশ লাল আটা ৫ কেজি', nameEn: 'Fresh Atta 5kg', qty: 1, masikPrice: 295, marketPrice: 325, unit: '৫ কেজি' },
    { id: '5', nameBn: 'তাজা আলু ৫ কেজি ব্যাগ', nameEn: 'Potato 5kg', qty: 1, masikPrice: 230, marketPrice: 260, unit: '৫ কেজি' },
    { id: '6', nameBn: 'পাবনার দেশি পেঁয়াজ ৫ কেজি', nameEn: 'Onion 5kg', qty: 1, masikPrice: 395, marketPrice: 450, unit: '৫ কেজি' },
    { id: '7', nameBn: 'হুইল ডিটারজেন্ট ২ কেজি', nameEn: 'Wheel Detergent 2kg', qty: 1, masikPrice: 330, marketPrice: 360, unit: '২ কেজি' },
  ]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };

  const totalMasik = items.reduce((acc, i) => acc + i.masikPrice * i.qty, 0);
  const totalMarket = items.reduce((acc, i) => acc + i.marketPrice * i.qty, 0);
  const totalSavings = Math.max(0, totalMarket - totalMasik);

  const handleCheckout = () => {
    Alert.alert(
      'মাসিক বাজার নিশ্চিতকরণ',
      `আপনার ৳${totalMasik.toLocaleString()} টাকার মাসিক বাজার সফলভাবে গ্রহণ করা হয়েছে!\nসাশ্রয়: ৳${totalSavings.toLocaleString()}\nডেলিভারি এরিয়া: ঢাকা`,
      [{ text: 'ঠিক আছে' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064e3b" />

      {/* Mobile Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>মাসিক বাজার</Text>
          <Text style={styles.headerSubtitle}>এক মাসের বাজার। এক অর্ডারে।</Text>
        </View>
        <View style={styles.savingsPill}>
          <Text style={styles.savingsPillText}>🔥 সাশ্রয় ৳{totalSavings}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'market' && styles.tabItemActive]}
          onPress={() => setActiveTab('market')}
        >
          <Text style={[styles.tabText, activeTab === 'market' && styles.tabTextActive]}>
            মাসিক বাজার
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'savings' && styles.tabItemActive]}
          onPress={() => setActiveTab('savings')}
        >
          <Text style={[styles.tabText, activeTab === 'savings' && styles.tabTextActive]}>
            সেভিংস হিস্ট্রি
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'orders' && styles.tabItemActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            অর্ডার ট্র্যাকিং
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'market' && (
          <>
            {/* Quick 1-Tap Reorder Banner */}
            <View style={styles.repeatCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.repeatCardTitle}>অক্টোবর বাজার প্রস্তুত</Text>
                <Text style={styles.repeatCardSub}>গত মাসের মত একই বাজার ১-ট্যাপে অর্ডার করুন</Text>
              </View>
              <TouchableOpacity style={styles.repeatBtn} onPress={handleCheckout}>
                <Text style={styles.repeatBtnText}>১-ট্যাপে নিন</Text>
              </TouchableOpacity>
            </View>

            {/* Price Lock Toggle */}
            <TouchableOpacity
              style={[styles.lockCard, isPriceLocked && styles.lockCardActive]}
              onPress={() => setIsPriceLocked(!isPriceLocked)}
            >
              <Text style={styles.lockTitle}>
                {isPriceLocked ? '✓ ৩০ দিনের মূল্য লক সক্রিয়' : '🔒 ৩০ দিনের জন্য মূল্য লক করুন'}
              </Text>
              <Text style={styles.lockSubtitle}>
                বাজারে দ্রব্যমূল্য বাড়লেও আপনার এই বাজার মূল্য অপরিবর্তিত থাকবে
              </Text>
            </TouchableOpacity>

            {/* Item List */}
            <Text style={styles.sectionTitle}>বাজারের পণ্য তালিকা ({items.length}টি)</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.nameBn}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>৳{item.masikPrice}</Text>
                    <Text style={styles.itemMarketPrice}>৳{item.marketPrice}</Text>
                    <Text style={styles.itemSavingsText}>
                      সাশ্রয় ৳{item.marketPrice - item.masikPrice}
                    </Text>
                  </View>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'savings' && (
          <View style={styles.savingsView}>
            <Text style={styles.sectionTitle}>আপনার সেভিংস হিস্ট্রি</Text>
            <View style={styles.statsCard}>
              <Text style={styles.statLabel}>সর্বমোট সাশ্রয়</Text>
              <Text style={styles.statValue}>৳৪,১৮০</Text>
              <Text style={styles.statSub}>গড় সাশ্রয় ৮.৫% (৮টি অর্ডার সম্পন্ন)</Text>
            </View>

            <View style={styles.historyList}>
              <View style={styles.historyRow}>
                <Text style={styles.historyMonth}>সেপ্টেম্বর বাজার</Text>
                <Text style={styles.historyAmount}>+৳৬৮০ সাশ্রয়</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyMonth}>আগস্ট বাজার</Text>
                <Text style={styles.historyAmount}>+৳৫৪০ সাশ্রয়</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyMonth}>জুলাই বাজার</Text>
                <Text style={styles.historyAmount}>+৳৬২০ সাশ্রয়</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'orders' && (
          <View style={styles.savingsView}>
            <Text style={styles.sectionTitle}>লাইভ অর্ডার ট্র্যাকিং</Text>
            <View style={styles.statsCard}>
              <Text style={styles.statLabel}>অর্ডার #MB-2026-10492</Text>
              <Text style={[styles.statValue, { color: '#059669', fontSize: 18, marginTop: 4 }]}>
                প্যাকিং সম্পন্ন (DISPATCHED)
              </Text>
              <Text style={styles.statSub}>ডেলিভারি স্লট: আজ দুপুর ১২টা - ৩টা (মিরপুর)</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Checkout Bar (Section 60 PRD) */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>মোট বাজার মূল্য</Text>
          <Text style={styles.bottomTotalValue}>৳{totalMasik.toLocaleString()}</Text>
          <Text style={styles.bottomSavingsSub}>বাজার মূল্য ৳{totalMarket.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>অর্ডার কনফার্ম করুন</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  savingsPill: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  savingsPillText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#059669',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  repeatCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  repeatCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064e3b',
  },
  repeatCardSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  repeatBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  repeatBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  lockCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  lockCardActive: {
    borderColor: '#0d9488',
    backgroundColor: '#f0fdfa',
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  lockSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  itemRow: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  itemMarketPrice: {
    fontSize: 11,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  itemSavingsText: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '700',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  qtyText: {
    width: 28,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 13,
  },
  savingsView: {
    marginTop: 8,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  statSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  historyList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyMonth: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomTotalLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064e3b',
  },
  bottomSavingsSub: {
    fontSize: 10,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  checkoutBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});
