'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  DollarSign,
  Activity,
  PieChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getAnalyticsStats, AnalyticsStats } from '@/lib/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAnalyticsStats();
        setStats(data);
      } catch (e) {
        console.error("Failed to load analytics", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const mrr = stats?.mrr || 0;
  const mrrGrowth = 12.5; // Mock growth %
  const totalUsers = stats?.totalUsers || 0;
  const userGrowth = 8.2; // Mock growth %
  const churnRate = stats?.churnRate || 0;
  const churnChange = -0.5; // Mock growth %
  const conversionRate = stats?.conversionRate || 0;
  const conversionChange = 1.2; // Mock growth %

  // Common chart options matching the Movira X dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { family: 'inherit', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(13, 12, 15, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  // Mock revenue line chart
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue (NGN/USD)',
        data: [0, 0, 0, 0, 0, 0, mrr],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#dc2626',
      }
    ]
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Users',
        data: [0, 0, 0, 0, 0, 0, totalUsers],
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderRadius: 4,
      }
    ]
  };

  // Plans Doughnut Chart Data based on DB stats
  const planNames = stats ? Object.keys(stats.plansDistribution) : ['Free'];
  const planValues = stats && Object.keys(stats.plansDistribution).length > 0 
    ? Object.values(stats.plansDistribution) 
    : [totalUsers > 0 ? totalUsers : 1];
  
  if (planNames.length === 0) {
    planNames.push('Free Users');
    planValues.push(totalUsers || 1);
  }

  const plansData = {
    labels: planNames,
    datasets: [
      {
        data: planValues,
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(220, 38, 38, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(255, 255, 255, 0.1)',
        ],
        borderColor: 'rgba(13, 12, 15, 1)',
        borderWidth: 2,
      }
    ]
  };

  const methodNames = stats && Object.keys(stats.gatewaysDistribution).length > 0
    ? Object.keys(stats.gatewaysDistribution)
    : ['None'];
  const methodValues = stats && Object.keys(stats.gatewaysDistribution).length > 0
    ? Object.values(stats.gatewaysDistribution)
    : [1];

  const paymentsData = {
    labels: methodNames,
    datasets: [
      {
        data: methodValues,
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)', // Flutterwave/Crypto Amber
          'rgba(99, 102, 241, 0.8)', // Stripe Indigo
          'rgba(14, 165, 233, 0.8)', // Paystack Blue
        ],
        borderColor: 'rgba(13, 12, 15, 1)',
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1 text-3xl font-extrabold tracking-tight text-foreground">Analytics & Reporting</h1>
          <p className="m-0 text-sm font-medium text-muted-foreground">
            Track revenue, growth, and subscription metrics
          </p>
        </div>
      </header>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="MRR" 
          value={`₦${mrr.toLocaleString()}`} 
          change={mrrGrowth} 
          icon={<DollarSign size={20} />} 
          loading={loading}
        />
        <MetricCard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          change={userGrowth} 
          icon={<Users size={20} />} 
          loading={loading}
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
          change={conversionChange} 
          icon={<Activity size={20} />} 
          loading={loading}
        />
        <MetricCard 
          title="Churn Rate" 
          value={`${churnRate}%`} 
          change={churnChange} 
          icon={<BarChart3 size={20} />} 
          inverseColor
          loading={loading}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <h3 className="mb-6 text-[15px] font-bold text-foreground">Revenue Dashboard</h3>
          <div className="h-[300px] w-full">
            {loading ? <ChartSkeleton /> : <Line data={revenueData} options={chartOptions} />}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <h3 className="mb-6 text-[15px] font-bold text-foreground">User Growth</h3>
          <div className="h-[300px] w-full">
            {loading ? <ChartSkeleton /> : <Bar data={userGrowthData} options={chartOptions} />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl lg:col-span-2">
          <h3 className="mb-6 text-[15px] font-bold text-foreground">Top Subscribed Plans</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center h-full">
            <div className="h-[240px] w-full flex justify-center">
              {loading ? <ChartSkeleton circular /> : (
                <Doughnut 
                  data={plansData} 
                  options={{
                    ...chartOptions,
                    scales: { x: { display: false }, y: { display: false } },
                    cutout: '70%'
                  }} 
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-4">
              {planNames.map((name, idx) => (
                <div key={name} className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`size-3 rounded-full`} style={{ backgroundColor: plansData.datasets[0].backgroundColor[idx] }} />
                    <span className="text-[14px] font-bold text-foreground">{name}</span>
                  </div>
                  <span className="text-[15px] font-black text-foreground">{planValues[idx]} subs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
          <h3 className="mb-6 text-[15px] font-bold text-foreground">Payment Methods</h3>
          <div className="h-[220px] w-full mb-4">
            {loading ? <ChartSkeleton circular /> : (
              <Doughnut 
                data={paymentsData} 
                options={{
                  ...chartOptions,
                  scales: { x: { display: false }, y: { display: false } },
                  plugins: { ...chartOptions.plugins, legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.7)', padding: 20 } } },
                  cutout: '65%'
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon, inverseColor = false, loading = false }: any) {
  const isPositive = change >= 0;
  const isGood = inverseColor ? !isPositive : isPositive;
  
  return (
    <div className="rounded-2xl border border-white/5 bg-background/50 p-6 shadow-sm backdrop-blur-xl flex flex-col justify-between h-[140px]">
      <div className="flex items-center justify-between text-muted-foreground">
        <h3 className="text-[13px] font-bold uppercase tracking-wider">{title}</h3>
        <div className="rounded-lg bg-white/5 p-2">{icon}</div>
      </div>
      
      {loading ? (
        <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
      ) : (
        <div className="flex items-end gap-3">
          <h2 className="text-3xl font-black text-foreground">{value}</h2>
          <span className={`flex items-center gap-1 text-[13px] font-bold mb-1 ${isGood ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </span>
        </div>
      )}
    </div>
  );
}

function ChartSkeleton({ circular = false }: { circular?: boolean }) {
  if (circular) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="size-48 animate-pulse rounded-full border-[24px] border-white/5" />
      </div>
    );
  }
  
  return (
    <div className="flex h-full w-full items-end gap-2 pb-6 pl-8">
      <div className="absolute bottom-6 left-6 top-6 w-[1px] bg-white/10" />
      <div className="absolute bottom-6 left-6 right-6 h-[1px] bg-white/10" />
      {Array.from({ length: 7 }).map((_, i) => {
        const height = 20 + Math.random() * 60;
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end h-full">
            <div 
              className="w-4/5 animate-pulse rounded-t-sm bg-white/5" 
              style={{ height: `${height}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
