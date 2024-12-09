export interface ColumnStats {
  type: 'numeric' | 'date' | 'categorical';
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  quartiles?: {
    q1: number;
    q2: number;
    q3: number;
  };
  skewness?: number;
  kurtosis?: number;
  uniqueValues?: number;
  frequencies?: Record<string, number>;
  dateRange?: {
    start: string;
    end: string;
  };
  distribution?: Record<string, number>;
  mode?: string;
  entropy?: number;
}

export interface DatasetStatistics {
  totalRecords: number;
  columnStats: Record<string, ColumnStats>;
  correlations: Record<string, Record<string, number>>;
  outliers: Record<string, number[]>;
  summary: {
    totalRecords: number;
    numericColumns: number;
    categoricalColumns: number;
    dateColumns: number;
    completeness: number;
  };
}