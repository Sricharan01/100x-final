import React, { useState, useEffect } from 'react';
import ColumnSelector from './ColumnSelector';
import ChartTypeSelector from './ChartTypeSelector';
import ChartDisplay from '../ChartDisplay';
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

interface InteractiveGraphControlsProps {
  data: any[];
  columns: string[];
  loading?: boolean;
}

const InteractiveGraphControls: React.FC<InteractiveGraphControlsProps> = ({
  data,
  columns,
  loading = false
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedChartType, setSelectedChartType] = useState('bar');

  const handleColumnSelect = (column: string, axis: 'x' | 'y') => {
    const index = axis === 'x' ? 0 : 1;
    setSelectedColumns(prev => {
      const newColumns = [...prev];
      newColumns[index] = column;
      return newColumns;
    });
  };

  const canShowChart = selectedColumns.length === 2 && 
    selectedColumns.every(col => col !== '') &&
    selectedChartType !== '';

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Customize Your Visualization
        </h3>
        
        <ChartTypeSelector
          selectedType={selectedChartType}
          onTypeSelect={setSelectedChartType}
          disabled={loading}
        />
        
        <ColumnSelector
          columns={columns}
          selectedColumns={selectedColumns}
          onColumnSelect={handleColumnSelect}
          disabled={loading}
        />
      </div>

      {canShowChart && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ChartDisplay
            type={selectedChartType}
            data={data}
            columns={selectedColumns}
          />
        </div>
      )}
    </div>
  );
};

export default InteractiveGraphControls;