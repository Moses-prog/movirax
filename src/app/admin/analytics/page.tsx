'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getAnalyticsStats, AnalyticsStats } from '@/lib/analytics';
import { Card, CardHeader, CardBody } from '@heroui/react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
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
  const totalUsers = stats?.totalUsers || 0;
  const activeSubscribers = stats?.activeSubscribers || 0;
  const cancelledSubscribers = stats?.cancelledSubscribers || 0;

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
    }
  };

  // Plans Doughnut Chart Data based on DB stats
  const planNames = stats ? Object.keys(stats.plansDistribution) : [];
  const planValues = stats ? Object.values(stats.plansDistribution) : [];
  
  const freeUsers = Math.max(0, totalUsers - activeSubscribers);
  if (freeUsers > 0) {
    planNames.push('Free');
    planValues.push(freeUsers);
  }

  const plansData = {
    labels: planNames,
    datasets: [
      {
        data: planValues,
        backgroundColor: [
          'rgba(243, 18, 96, 0.8)',
          'rgba(245, 165, 36, 0.8)',
          'rgba(0, 111, 238, 0.8)',
          'rgba(255, 255, 255, 0.1)',
        ],
        borderColor: 'rgba(24, 24, 27, 1)',
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
          'rgba(245, 165, 36, 0.8)', // Warning/Amber
          'rgba(120, 40, 200, 0.8)', // Secondary/Purple
          'rgba(0, 111, 238, 0.8)', // Primary/Blue
        ],
        borderColor: 'rgba(24, 24, 27, 1)',
        borderWidth: 2,
      }
    ]
  };

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics & Reporting</h1>
          <p className="text-default-500 mt-1">Track revenue, growth, and subscription metrics</p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Monthly Revenue" 
          value={`₦${mrr.toLocaleString()}`} 
          icon={<DollarSign size={20} />} 
          loading={loading}
        />
        <MetricCard 
          title="Total Registered Users" 
          value={totalUsers.toLocaleString()} 
          icon={<Users size={20} />} 
          loading={loading}
        />
        <MetricCard 
          title="Active Subscriptions" 
          value={activeSubscribers.toLocaleString()} 
          icon={<Activity size={20} />} 
          loading={loading}
        />
        <MetricCard 
          title="Cancelled Subscriptions" 
          value={cancelledSubscribers.toLocaleString()} 
          icon={<BarChart3 size={20} />} 
          loading={loading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50 lg:col-span-2">
          <CardHeader className="px-6 pt-6 pb-2">
            <h3 className="text-base font-bold text-foreground">Top Subscribed Plans</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-4">
            <div className="grid md:grid-cols-2 gap-8 items-center h-full">
              <div className="h-[240px] w-full flex justify-center">
                {loading ? <ChartSkeleton circular /> : (
                  <Doughnut 
                    data={plansData} 
                    options={{
                      ...chartOptions,
                      cutout: '70%'
                    }} 
                  />
                )}
              </div>
              <div className="flex flex-col justify-center gap-4">
                {planNames.map((name, idx) => (
                  <div key={name} className="flex items-center justify-between border-b border-divider pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`size-3 rounded-full`} style={{ backgroundColor: plansData.datasets[0].backgroundColor[idx] }} />
                      <span className="text-sm font-bold text-foreground">{name}</span>
                    </div>
                    <span className="text-sm font-black text-foreground">{planValues[idx]} subs</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50">
          <CardHeader className="px-6 pt-6 pb-2">
            <h3 className="text-base font-bold text-foreground">Payment Methods</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6 pt-2">
            <div className="h-[220px] w-full mb-4">
              {loading ? <ChartSkeleton circular /> : (
                <Doughnut 
                  data={paymentsData} 
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.7)', padding: 20 } } },
                    cutout: '65%'
                  }} 
                />
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, loading = false }: any) {
  return (
    <Card className="border-none shadow-sm bg-background/60 dark:bg-default-100/50 h-[140px]">
      <CardBody className="flex flex-col justify-between p-6">
        <div className="flex items-center justify-between text-default-500">
          <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
          <div className="rounded-lg bg-default-100 p-2 text-foreground">{icon}</div>
        </div>
        
        {loading ? (
          <div className="h-10 w-24 animate-pulse rounded-xl bg-default-200" />
        ) : (
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-black text-foreground">{value}</h2>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function ChartSkeleton({ circular = false }: { circular?: boolean }) {
  if (circular) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="size-48 animate-pulse rounded-full border-[24px] border-default-200" />
      </div>
    );
  }
  return null;
}
