import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

interface ChartDisplayProps {
  type: string;
  data: any[];
  columns: string[];
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ type, data = [], columns = [] }) => {
  if (!data.length || !columns.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-64">
        <p className="text-gray-500">No data available for visualization</p>
      </div>
    );
  }

  const getColor = (index: number, alpha = 0.7) => 
    `hsla(${index * 137.5}, 70%, 50%, ${alpha})`;

  const chartConfig = {
    labels: data.map(item => String(item[columns[0]] || '')),
    datasets: type === 'scatter' ? [
      {
        label: `${columns[0]} vs ${columns[1]}`,
        data: data.map(item => ({
          x: Number(item[columns[0]]) || 0,
          y: Number(item[columns[1]]) || 0
        })),
        backgroundColor: getColor(0, 0.6),
        borderColor: getColor(0),
      }
    ] : columns.slice(1).map((col, i) => ({
      label: col,
      data: data.map(item => Number(item[col]) || 0),
      backgroundColor: getColor(i),
      borderColor: getColor(i, 1),
      borderWidth: 1,
      fill: type === 'line',
      tension: type === 'line' ? 0.4 : undefined
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        display: true
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: type !== 'pie' ? {
      x: {
        type: 'category' as const,
        display: true,
        title: {
          display: true,
          text: columns[0]
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        title: {
          display: true,
          text: columns[1]
        }
      }
    } : undefined
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <Chart type={type} data={chartConfig} options={options} />
    </div>
  );
};

export default ChartDisplay;