<template>
  <div class="max-w-none px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
    <div v-if="!store.currentUser || !store.currentUser.isAdmin" class="flex flex-col items-center justify-center py-20 text-center bg-[#FBF7F2] rounded-2xl border border-stone-100">
      <svg class="w-16 h-16 text-rose-500 mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <h2 class="text-xl font-bold text-stone-700">Admin Analytics Access Required</h2>
      <p class="text-stone-500 text-sm mt-1 max-w-sm">Please log in as the store owner to view private site analytics.</p>
    </div>

    <div v-else class="space-y-8">
      <div class="border-b border-stone-150 pb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <button @click="setView('admin')" class="text-xs font-bold text-rose-500 hover:text-rose-700 mb-3 flex items-center gap-1">
            <span>←</span> Back to Admin
          </button>
          <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-850">Site Analytics Dashboard</h1>
          <p class="text-sm text-stone-500 mt-1">Track visits, customer actions, product interest, conversion, and sales performance.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="rangeDays" @change="refreshAnalytics" class="px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 focus:outline-none">
            <option :value="7">Last 7 days</option>
            <option :value="30">Last 30 days</option>
            <option :value="90">Last 90 days</option>
          </select>
          <button @click="refreshAnalytics" class="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div v-if="loading" class="bg-white border border-stone-100 rounded-2xl p-12 text-center text-sm text-stone-500">
        Loading analytics...
      </div>

      <div v-else-if="!analytics" class="bg-white border border-dashed border-stone-200 rounded-2xl p-12 text-center text-sm text-stone-500">
        No analytics data yet. Visits and clicks will appear here as customers use the site.
      </div>

      <div v-else class="space-y-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Visits" :value="analytics.totals.visits" tone="rose" />
          <MetricCard label="Unique Visitors" :value="analytics.totals.uniqueVisitors" tone="indigo" />
          <MetricCard label="Clicks / Actions" :value="analytics.totals.clicks" tone="amber" />
          <MetricCard label="Revenue" :value="`₹${analytics.totals.revenue}`" tone="green" />
          <MetricCard label="Product Views" :value="analytics.totals.productViews" tone="stone" />
          <MetricCard label="Add To Bag" :value="analytics.totals.addToCartClicks" tone="rose" />
          <MetricCard label="Orders" :value="analytics.totals.orders" tone="green" />
          <MetricCard label="New Users" :value="analytics.totals.newUsers" tone="indigo" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-stone-400">Visitor to Order</p>
            <p class="text-3xl font-bold text-stone-850 mt-2">{{ analytics.totals.conversionRate }}%</p>
            <p class="text-sm text-stone-500 mt-1">Unique visitor conversion rate.</p>
          </div>
          <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-stone-400">View to Bag</p>
            <p class="text-3xl font-bold text-stone-850 mt-2">{{ analytics.totals.addToCartRate }}%</p>
            <p class="text-sm text-stone-500 mt-1">Product views that became add-to-bag actions.</p>
          </div>
          <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-stone-400">Average Order</p>
            <p class="text-3xl font-bold text-stone-850 mt-2">₹{{ analytics.totals.averageOrderValue }}</p>
            <p class="text-sm text-stone-500 mt-1">Average value from completed orders.</p>
          </div>
        </div>

        <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 class="font-serif text-xl font-bold text-stone-850">Daily Site Pulse</h2>
              <p class="text-xs text-stone-500 mt-1">Visits, clicks, orders, and revenue by day.</p>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="day in analytics.daily" :key="day.date" class="grid grid-cols-[92px_1fr_70px_70px] sm:grid-cols-[110px_1fr_90px_90px] gap-3 items-center text-xs">
              <span class="font-semibold text-stone-500">{{ shortDate(day.date) }}</span>
              <div class="h-8 bg-[#FBF7F2] rounded-full overflow-hidden flex">
                <div class="bg-rose-500/80" :style="{ width: barWidth(day.visits, maxDailyVisits) }"></div>
                <div class="bg-indigo-500/80" :style="{ width: barWidth(day.clicks, maxDailyClicks) }"></div>
              </div>
              <span class="text-stone-600">{{ day.visits }} visits</span>
              <span class="font-bold text-rose-600">₹{{ day.revenue }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RankList title="Top Pages" :items="analytics.topPages" empty="No page visits tracked yet." />
          <RankList title="Top Viewed Products" :items="analytics.topViewedProducts" empty="No product views tracked yet." />
          <RankList title="Most Added To Bag" :items="analytics.topCartProducts" empty="No add-to-bag clicks tracked yet." />
          <RankList title="Popular Categories" :items="analytics.topCategories" empty="No category interest tracked yet." />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5">
          <RankList title="Top Actions" :items="formattedActions" empty="No clicks tracked yet." />

          <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <h2 class="font-serif text-xl font-bold text-stone-850">Recent Activity</h2>
            <div v-if="analytics.recentEvents.length === 0" class="text-sm text-stone-500 py-8">No recent events yet.</div>
            <div v-else class="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
              <div v-for="(event, index) in analytics.recentEvents" :key="`${event.createdAt}-${index}`" class="flex items-start justify-between gap-3 border border-stone-100 rounded-xl p-3">
                <div class="min-w-0">
                  <p class="text-sm font-bold text-stone-800">{{ formatAction(event.type) }}</p>
                  <p class="text-xs text-stone-500 truncate">{{ event.productName || event.category || event.page || 'Site activity' }}</p>
                </div>
                <span class="text-[10px] text-stone-400 whitespace-nowrap">{{ shortTime(event.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../store.js';

const MetricCard = {
  props: ['label', 'value', 'tone'],
  computed: {
    toneClass() {
      const tones = {
        rose: 'text-rose-600 bg-rose-50 border-rose-100',
        indigo: 'text-indigo-650 bg-indigo-50 border-indigo-100',
        amber: 'text-amber-700 bg-amber-50 border-amber-100',
        green: 'text-green-700 bg-green-50 border-green-100',
        stone: 'text-stone-800 bg-stone-50 border-stone-100'
      };
      return tones[this.tone] || tones.stone;
    }
  },
  template: `
    <div class="border rounded-2xl p-5 shadow-sm" :class="toneClass">
      <p class="text-[10px] font-bold uppercase tracking-wider opacity-70">{{ label }}</p>
      <p class="text-2xl sm:text-3xl font-bold mt-2 font-sans">{{ value }}</p>
    </div>
  `
};

const RankList = {
  props: ['title', 'items', 'empty'],
  methods: {
    width(count) {
      const max = Math.max(...this.items.map(item => item.count), 1);
      return `${Math.max((count / max) * 100, 8)}%`;
    }
  },
  template: `
    <div class="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
      <h2 class="font-serif text-xl font-bold text-stone-850">{{ title }}</h2>
      <div v-if="!items || items.length === 0" class="text-sm text-stone-500 py-8">{{ empty }}</div>
      <div v-else class="mt-4 space-y-3">
        <div v-for="item in items" :key="item.name" class="space-y-1.5">
          <div class="flex items-center justify-between gap-3 text-sm">
            <span class="font-semibold text-stone-700 truncate">{{ item.name }}</span>
            <span class="text-xs font-bold text-rose-600">{{ item.count }}</span>
          </div>
          <div class="h-2 rounded-full bg-[#FBF7F2] overflow-hidden">
            <div class="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full" :style="{ width: width(item.count) }"></div>
          </div>
        </div>
      </div>
    </div>
  `
};

export default {
  name: 'AdminAnalyticsView',
  components: {
    MetricCard,
    RankList
  },
  props: {
    setView: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      rangeDays: 30,
      loading: false
    };
  },
  computed: {
    store() {
      return store;
    },
    analytics() {
      return this.store.analytics;
    },
    maxDailyVisits() {
      return Math.max(...(this.analytics?.daily || []).map(day => day.visits), 1);
    },
    maxDailyClicks() {
      return Math.max(...(this.analytics?.daily || []).map(day => day.clicks), 1);
    },
    formattedActions() {
      return (this.analytics?.topActions || []).map(item => ({
        ...item,
        name: this.formatAction(item.name)
      }));
    }
  },
  mounted() {
    this.refreshAnalytics();
  },
  methods: {
    async refreshAnalytics() {
      if (!this.store.currentUser?.isAdmin) return;
      this.loading = true;
      await this.store.fetchAnalytics(this.rangeDays);
      this.loading = false;
    },
    barWidth(value, max) {
      return `${Math.max((Number(value || 0) / max) * 50, value > 0 ? 4 : 0)}%`;
    },
    shortDate(date) {
      return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    },
    shortTime(date) {
      return new Date(date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    formatAction(action) {
      return String(action || '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
};
</script>
