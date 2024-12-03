export type ApiResponse = unknown;

export interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  modifier?: string;
}

export interface DiffViewProps {
  left: ApiResponse;
  right: ApiResponse;
}

export interface EditorProps {
  height?: string;
  defaultLanguage: string;
  defaultValue: string;
  onChange: (value: string | undefined) => void;
}

export interface ComparisonResult {
  path: string;
  type: 'added' | 'removed' | 'changed';
  value?: unknown;
  oldValue?: unknown;
}
