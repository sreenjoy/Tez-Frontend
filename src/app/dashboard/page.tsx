"use client"

import { useState, useEffect, useContext } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { PipelineContext } from '../../components/layout/AppLayout'

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
)

// Set global Chart.js options for dark mode compatibility
ChartJS.defaults.color = 'rgb(156, 163, 175)';
ChartJS.defaults.borderColor = 'rgba(156, 163, 175, 0.1)';

// Chart components with real implementation
const LineChart = ({ data, options }) => (
  <div className="h-64 w-full">
    <Line data={data} options={options} />
  </div>
)

const BarChart = ({ data, options }) => (
  <div className="h-64 w-full">
    <Bar data={data} options={options} />
  </div>
)

const PieChart = ({ data, options }) => (
  <div className="h-64 w-full">
    <Pie data={data} options={options} />
  </div>
)

// Icon components
const UpArrow = () => (
  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
)

const DownArrow = () => (
  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

// Mock data
const mockDeals = [
  { id: 1, name: 'Acme Corp Website Redesign', value: 8500, stage: 'Negotiation', probability: 70, lastActivity: '2h ago', contact: 'John Doe' },
  { id: 2, name: 'GlobalTech Mobile App', value: 15000, stage: 'Proposal', probability: 50, lastActivity: '1d ago', contact: 'Jane Smith' },
  { id: 3, name: 'EduLearn LMS Integration', value: 12000, stage: 'Discovery', probability: 30, lastActivity: '3d ago', contact: 'Mike Johnson' },
  { id: 4, name: 'Sunshine Cafe POS System', value: 5500, stage: 'Closed Won', probability: 100, lastActivity: '1w ago', contact: 'Sarah Lee' },
]

const mockTasks = [
  { id: 1, title: 'Follow up with GlobalTech', dueDate: 'Today', priority: 'High', deal: 'GlobalTech Mobile App' },
  { id: 2, title: 'Send proposal to FitLife', dueDate: 'Tomorrow', priority: 'Medium', deal: 'FitLife Fitness App' },
  { id: 3, title: 'Review EduLearn contract', dueDate: 'Apr 15', priority: 'High', deal: 'EduLearn LMS Integration' },
  { id: 4, title: 'Schedule demo with Sunshine Cafe', dueDate: 'Apr 18', priority: 'Low', deal: 'Sunshine Cafe POS System' },
  { id: 5, title: 'Prepare quarterly review', dueDate: 'Apr 20', priority: 'Medium', deal: null },
]

// Mock chart data
const revenueMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const revenueData = [32400, 38700, 42300, 47800, 53200, 58900];
const revenueProjected = [null, null, null, null, 53200, 58900, 64500, 70200];
const revenueLabels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Chat volume data for the new chart
const chatMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const inboundChatData = [820, 932, 901, 934, 1290, 1330];
const outboundChatData = [620, 732, 801, 834, 1090, 1130];
const chatLabels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Weekly chat volume data
const chatWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weeklyInboundChatData = [145, 132, 151, 184, 190, 103, 95];
const weeklyOutboundChatData = [125, 112, 131, 144, 150, 83, 75];

// Deal stages for distribution chart
const dealStages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];
const dealCountsByStage = [5, 3, 2, 4];
const stageColors = [
  'rgba(74, 144, 226, 0.7)',
  'rgba(126, 87, 194, 0.7)',
  'rgba(241, 90, 34, 0.7)',
  'rgba(39, 174, 96, 0.7)',
];

// Pipeline activity data
const pipelineActivities = ['Calls', 'Emails', 'Meetings', 'Tasks'];
const pipelineActivityCounts = [24, 47, 18, 35];
const pipelineActivityColors = [
  'rgba(74, 144, 226, 0.7)',
  'rgba(126, 87, 194, 0.7)',
  'rgba(241, 90, 34, 0.7)',
  'rgba(39, 174, 96, 0.7)',
];

// Weekly pipeline activity data
const weeklyPipelineActivityCounts = [12, 28, 9, 17];
// Quarterly pipeline activity data
const quarterlyPipelineActivityCounts = [68, 123, 45, 89];

// Response time data by day of week
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const responseTimeByDay = [1.2, 1.8, 1.5, 2.1, 1.7, 3.2, 4.5];

// Monthly response time data (average by week of month)
const monthlyResponseLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const monthlyResponseTimeData = [1.7, 1.9, 2.3, 1.5];

// Quarterly response time data (by month)
const quarterlyResponseLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const quarterlyResponseTimeData = [2.1, 1.9, 1.7, 1.5, 1.8, 2.0];

export default function DashboardPage() {
  // State for tab switching in task section
  const [activeTaskTab, setActiveTaskTab] = useState('upcoming')
  
  // State for timeframe selector 
  const [timeframe, setTimeframe] = useState('month')
  
  // Get the selected pipeline from context
  const { selectedPipeline } = useContext(PipelineContext);

  // Update dashboard data when selected pipeline changes
  useEffect(() => {
    // This would normally fetch data based on the selectedPipeline
    console.log(`Loading data for pipeline: ${selectedPipeline}`);
    
    // In a real app, you would make API calls here to get the data for the selected pipeline
    // For now we'll just use our mock data
  }, [selectedPipeline]);

  // Add effect to update charts when timeframe changes
  useEffect(() => {
    console.log(`Timeframe changed to: ${timeframe}`);
    // In a real app, we would fetch different data based on the timeframe
    // For now we're just using our preconfigured mock data that switches based on timeframe
  }, [timeframe]);

  // Calculate KPI data based on timeframe and selectedPipeline - in a real app, this would come from an API
  const kpiData = {
    totalDeals: { value: selectedPipeline === "All Pipelines" ? 12 : 4, change: 16.7, trend: 'up' },
    activeRevenue: { value: selectedPipeline === "All Pipelines" ? 52500 : 15000, change: 12, trend: 'up' },
    avgResponseTime: { value: selectedPipeline === "All Pipelines" ? 1.8 : 1.2, change: 15, trend: 'down' },
    closedDeals: { value: selectedPipeline === "All Pipelines" ? 4 : 1, change: 33.3, trend: 'up' },
  }

  // Filter deals based on selected pipeline
  const filteredDeals = selectedPipeline === "All Pipelines" 
    ? mockDeals 
    : mockDeals.filter(deal => {
        if (selectedPipeline === "Sales Pipeline") return deal.stage === "Negotiation" || deal.stage === "Proposal";
        if (selectedPipeline === "Marketing Pipeline") return deal.name.includes("Mobile") || deal.name.includes("Website");
        if (selectedPipeline === "Support Pipeline") return deal.name.includes("POS") || deal.name.includes("LMS");
        return true;
      });

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Get style for priority tag
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  // Get style for stage tag
  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'Closed Won':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Negotiation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'Proposal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }
  
  // Create revenue forecast chart data
  const revenueChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Actual Revenue',
        data: revenueData.concat(Array(2).fill(null)),
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Projected Revenue',
        data: revenueProjected,
        borderColor: 'rgba(56, 189, 248, 0.5)',
        backgroundColor: 'rgba(56, 189, 248, 0.05)',
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(56, 189, 248, 0.5)',
        tension: 0.4,
        fill: true,
      }
    ]
  }
  
  // Revenue chart options
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  }
  
  // Create chat volume chart data
  const chatVolumeData = {
    labels: timeframe === 'week' ? chatWeekDays : timeframe === 'quarter' ? chatLabels : chatMonths,
    datasets: [
      {
        label: 'Inbound Chats',
        data: timeframe === 'week' ? weeklyInboundChatData : inboundChatData,
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Outbound Chats',
        data: timeframe === 'week' ? weeklyOutboundChatData : outboundChatData,
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        tension: 0.4,
        fill: true,
      }
    ]
  }

  // Chat volume chart options
  const chatVolumeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        beginAtZero: true
      }
    }
  }
  
  // Create pie chart data for deal distribution
  const dealDistributionData = {
    labels: dealStages,
    datasets: [
      {
        data: dealCountsByStage,
        backgroundColor: stageColors,
        borderWidth: 0,
      }
    ]
  }
  
  // Pie chart options
  const dealDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  }
  
  // Create bar chart data for pipeline activity
  const pipelineActivityData = {
    labels: pipelineActivities,
    datasets: [
      {
        label: 'Activity Count',
        data: timeframe === 'week' 
          ? weeklyPipelineActivityCounts 
          : timeframe === 'quarter' 
            ? quarterlyPipelineActivityCounts 
            : pipelineActivityCounts,
        backgroundColor: pipelineActivityColors,
        borderRadius: 4,
        borderWidth: 0,
      }
    ]
  }
  
  // Bar chart options for pipeline activity
  const pipelineActivityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        beginAtZero: true
      }
    }
  }
  
  // Create bar chart data for response metrics
  const responseMetricsData = {
    labels: timeframe === 'week' 
      ? daysOfWeek 
      : timeframe === 'month' 
        ? monthlyResponseLabels 
        : quarterlyResponseLabels,
    datasets: [
      {
        label: 'Avg. Response Time (hours)',
        data: timeframe === 'week' 
          ? responseTimeByDay 
          : timeframe === 'month' 
            ? monthlyResponseTimeData 
            : quarterlyResponseTimeData,
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderRadius: 4,
        borderWidth: 0,
      }
    ]
  }
  
  // Bar chart options for response metrics
  const responseMetricsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} hrs`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value) {
            return value + ' hrs';
          }
        },
        beginAtZero: true
      }
    }
  }

  return (
    <AppLayout>
      <div className="p-6">
        {/* Timeframe selector */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${timeframe === 'week' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${timeframe === 'month' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${timeframe === 'quarter' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setTimeframe('quarter')}
            >
              Quarter
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Deals</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{kpiData.totalDeals.value}</div>
              <div className={`flex items-center text-xs ${kpiData.totalDeals.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpiData.totalDeals.trend === 'up' ? <UpArrow /> : <DownArrow />}
                <span className="ml-1">{kpiData.totalDeals.change}% this {timeframe}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Revenue</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{formatCurrency(kpiData.activeRevenue.value)}</div>
              <div className={`flex items-center text-xs ${kpiData.activeRevenue.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpiData.activeRevenue.trend === 'up' ? <UpArrow /> : <DownArrow />}
                <span className="ml-1">{kpiData.activeRevenue.change}% this {timeframe}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Response Time</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{kpiData.avgResponseTime.value} hrs</div>
              <div className={`flex items-center text-xs ${kpiData.avgResponseTime.trend === 'down' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpiData.avgResponseTime.trend === 'down' ? <UpArrow /> : <DownArrow />}
                <span className="ml-1">{kpiData.avgResponseTime.change}% this {timeframe}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Closed Deals</h3>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{kpiData.closedDeals.value}</div>
              <div className={`flex items-center text-xs ${kpiData.closedDeals.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpiData.closedDeals.trend === 'up' ? <UpArrow /> : <DownArrow />}
                <span className="ml-1">{kpiData.closedDeals.change}% this {timeframe}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Chat Volume</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timeframe === 'week' ? 'Last 7 days' : timeframe === 'month' ? 'Last 6 months' : 'Last 8 months'}
              </div>
            </div>
            <LineChart data={chatVolumeData} options={chatVolumeOptions} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Deal Distribution</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">By stage</div>
            </div>
            <PieChart data={dealDistributionData} options={dealDistributionOptions} />
          </div>
        </div>
        
        {/* Pipeline activity and response metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pipeline Activity</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timeframe === 'week' ? 'This week' : timeframe === 'month' ? 'This month' : 'This quarter'}
              </div>
            </div>
            <BarChart data={pipelineActivityData} options={pipelineActivityOptions} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Response Metrics</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timeframe === 'week' ? 'By day of week' : timeframe === 'month' ? 'By week of month' : 'By month'}
              </div>
            </div>
            <BarChart data={responseMetricsData} options={responseMetricsOptions} />
          </div>
        </div>
        
        {/* Active deals table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Active Deals</h2>
            <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30">
              View All Deals
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deal</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Probability</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Activity</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/40">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {deal.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(deal.value)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStageStyle(deal.stage)}`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <span className="mr-2">{deal.probability}%</span>
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {deal.lastActivity}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {deal.contact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Tasks and Recent Activity */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tasks section */}
          <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30">
                Add Task
              </button>
            </div>
            
            {/* Task tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
              <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  className={`px-1 py-2 text-sm font-medium border-b-2 ${
                    activeTaskTab === 'upcoming'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTaskTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-1 py-2 text-sm font-medium border-b-2 ${
                    activeTaskTab === 'completed'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTaskTab('completed')}
                >
                  Completed
                </button>
                <button
                  className={`px-1 py-2 text-sm font-medium border-b-2 ${
                    activeTaskTab === 'all'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTaskTab('all')}
                >
                  All Tasks
                </button>
              </nav>
            </div>
            
            {/* Task list */}
            <div className="space-y-3">
              {mockTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-start p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600/40"
                >
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Due: <span className="font-medium">{task.dueDate}</span>
                      </div>
                      {task.deal && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {task.deal}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all tasks
              </button>
            </div>
          </div>
          
          {/* Recent activity section */}
          <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                  U
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium">You</span> added a comment to <span className="font-medium text-blue-600 dark:text-blue-400">Acme Corp Website Redesign</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                  S
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium">Sarah</span> created a task for <span className="font-medium text-blue-600 dark:text-blue-400">GlobalTech Mobile App</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                  M
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium">Mike</span> closed deal <span className="font-medium text-blue-600 dark:text-blue-400">Sunshine Cafe POS System</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 day ago</div>
                </div>
              </div>
              
              <div className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mr-3 flex-shrink-0">
                  J
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium">Jane</span> updated the proposal for <span className="font-medium text-blue-600 dark:text-blue-400">EduLearn LMS Integration</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago</div>
                </div>
              </div>
              
              <button className="w-full mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}