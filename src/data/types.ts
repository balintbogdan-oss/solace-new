// Raw data types that will eventually come from Power BI
export interface ReportMetadata {
  title: string;
  description?: string;
  lastUpdated: Date;
  reportId: string;
}

export interface PowerBIColumnMetadata {
  key: string;
  header: string;
  dataType: 'string' | 'number' | 'dateTime' | 'boolean';
  dataCategory?: 'Currency' | 'PhoneNumber' | 'Address' | 'Geography' | 'Identity';
  format?: string;
  aggregation?: 'sum' | 'average' | 'count' | 'min' | 'max' | 'none';
  sortByColumn?: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
}

export interface Report<T> {
  metadata: ReportMetadata;
  columns: PowerBIColumnMetadata[];
  data: T[];
}

// Client-side component types
export interface ClientReportColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  type: 'string' | 'number' | 'currency' | 'date' | 'boolean' | 'phone';
  format?: {
    type: 'currency' | 'number' | 'date' | 'phone';
    options?: Record<string, unknown>;
  };
}

export interface ClientReport {
  metadata: {
    title: string;
    description?: string;
    lastUpdated: Date;
  };
  columns: ClientReportColumn[];
  data: Record<string, unknown>[];
  options?: {
    showTimeRange?: boolean;
    showSearch?: boolean;
    showColumnCustomization?: boolean;
    showExport?: boolean;
    defaultTimeRange?: string;
  };
  actions?: {
    onExport?: () => void;
    onRefresh?: () => void;
  };
}

export interface ReportData {
  metadata: {
    title: string;
    description: string;
    lastUpdated: Date;
  };
  columns: ReportColumn[];
  data: Record<string, unknown>[];
}

export interface ReportColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  dataType: 'string' | 'number' | 'dateTime' | 'boolean';
  dataCategory?: 'Currency';
}

// Helper to convert server report to client report
export function toClientReport<T extends Record<string, unknown>>(report: Report<T>): ClientReport {
  return {
    metadata: {
      title: report.metadata.title,
      description: report.metadata.description,
      lastUpdated: report.metadata.lastUpdated
    },
    columns: report.columns.map(column => {
      const baseColumn: ClientReportColumn = {
        key: column.key,
        header: column.header,
        width: column.width,
        align: column.align,
        type: 'string' // Default type
      };

      // Map server data types to client types
      if (column.dataType === 'dateTime') {
        baseColumn.type = 'date';
        baseColumn.format = { type: 'date' };
      } else if (column.dataType === 'number') {
        if (column.dataCategory === 'Currency') {
          baseColumn.type = 'currency';
          baseColumn.format = { type: 'currency' };
        } else {
          baseColumn.type = 'number';
          baseColumn.format = { type: 'number' };
        }
      } else if (column.dataCategory === 'PhoneNumber') {
        baseColumn.type = 'phone';
        baseColumn.format = { type: 'phone' };
      } else if (column.dataType === 'boolean') {
        baseColumn.type = 'boolean';
      }

      return baseColumn;
    }),
    data: report.data.map(item => ({ ...item } as Record<string, unknown>)),
  };
}

export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const formatPhone = (value: string | null | undefined): string => {
  if (!value) return '-';
  return String(value);
}; 