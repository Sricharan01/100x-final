import { ChartConfiguration } from 'chart.js';
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

const getColor = (index: number, alpha = 0.7) => 
  `hsla(${index * 137.5}, 70%, 50%, ${alpha})`;

export const generateChartConfig = (
  type: string,
  data: any[],
  columns: string[]
): ChartConfiguration => {
  const baseConfig = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  };

  switch (type) {
    case 'bar':
      return {
        type: 'bar',
        data: {
          labels: data.map(item => String(item[columns[0]])),
          datasets: columns.slice(1).map((col, i) => ({
            label: col,
            data: data.map(item => Number(item[col])),
            backgroundColor: getColor(i),
            borderColor: getColor(i, 1),
            borderWidth: 1,
          })),
        },
        options: {
          ...baseConfig,
          scales: {
            x: {
              type: 'category',
              title: { display: true, text: columns[0] }
            },
            y: {
              type: 'linear',
              title: { display: true, text: columns[1] }
            }
          }
        }
      };

    case 'line':
      return {
        type: 'line',
        data: {
          labels: data.map(item => String(item[columns[0]])),
          datasets: columns.slice(1).map((col, i) => ({
            label: col,
            data: data.map(item => Number(item[col])),
            borderColor: getColor(i, 1),
            backgroundColor: getColor(i, 0.1),
            fill: true,
          })),
        },
        options: {
          ...baseConfig,
          scales: {
            x: {
              type: 'category',
              title: { display: true, text: columns[0] }
            },
            y: {
              type: 'linear',
              title: { display: true, text: columns[1] }
            }
          }
        }
      };

    case 'pie':
      return {
        type: 'pie',
        data: {
          labels: data.map(item => String(item[columns[0]])),
          datasets: [{
            data: data.map(item => Number(item[columns[1]])),
            backgroundColor: data.map((_, i) => getColor(i)),
          }],
        },
        options: baseConfig
      };

    case 'scatter':
      return {
        type: 'scatter',
        data: {
          datasets: [{
            label: `${columns[0]} vs ${columns[1]}`,
            data: data.map(item => ({
              x: Number(item[columns[0]]),
              y: Number(item[columns[1]]),
            })),
            backgroundColor: getColor(0, 0.6),
          }],
        },
        options: {
          ...baseConfig,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: { display: true, text: columns[0] }
            },
            y: {
              type: 'linear',
              title: { display: true, text: columns[1] }
            }
          }
        }
      };

    case 'radar':
      return {
        type: 'radar',
        data: {
          labels: columns,
          datasets: data.slice(0, 3).map((item, i) => ({
            label: `Dataset ${i + 1}`,
            data: columns.map(col => Number(item[col])),
            backgroundColor: getColor(i, 0.2),
            borderColor: getColor(i, 1),
          })),
        },
        options: baseConfig
      };

    default:
      return generateChartConfig('bar', data, columns);
  }
};