'use client';

import { useState, useCallback, useEffect } from 'react';
import CodeEditor from './Editor';
import { ErrorBoundary } from './ErrorBoundary';

interface RequestFormProps {
  title: string;
  onSubmit: (request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    modifier?: string;
  }) => void;
  onModifierChange: (modifier: string) => void;
}

function RequestFormContent({ title, onSubmit, onModifierChange }: RequestFormProps) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState('');
  const [modifier, setModifier] = useState('');
  const [isModifierOpen, setIsModifierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');
  const [errors, setErrors] = useState<{ url?: string; body?: string }>({});
  const [componentError, setComponentError] = useState<Error | null>(null);

  const defaultModifierCode = `// Example: Modify the response before comparison
// The 'response' variable contains the API response
// Return the modified response
if (response.ip === '') {
  response.ip = '0.0.0.0';
}
return response;`;

  // URL Validation Function
  const validateUrl = useCallback((inputUrl: string) => {
    try {
      const url = new URL(inputUrl);
      // Additional checks can be added here
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(url.protocol)) {
        return 'Only HTTP and HTTPS protocols are allowed';
      }
      return null;
    } catch (error) {
      return 'Invalid URL format';
    }
  }, []);

  // JSON Validation Function
  const validateJson = useCallback((jsonString: string) => {
    if (!jsonString.trim()) return null; // Empty is valid
    try {
      // Attempt to parse the JSON
      const parsed = JSON.parse(jsonString);
      
      // Additional custom validation can be added here
      // For example, checking for specific keys or structures
      
      return null; // Valid JSON
    } catch (error) {
      return 'Invalid JSON format';
    }
  }, []);

  const safeOnSubmit = (e: React.FormEvent) => {
    try {
      handleSubmit(e);
    } catch (error) {
      console.error('Error in form submission:', error);
      setComponentError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    const urlError = validateUrl(url);
    
    // Validate Body (if not GET method)
    const bodyError = method !== 'GET' ? validateJson(body) : null;
    
    // Set errors if any
    if (urlError || bodyError) {
      setErrors({
        url: urlError || undefined,
        body: bodyError || undefined
      });
      return;
    }

    // Clear any previous errors
    setErrors({});

    const formattedHeaders = headers.reduce((acc, header) => {
      if (header.key && header.value) {
        // Sanitize header keys and values
        acc[header.key.trim()] = header.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    onSubmit({
      url: url.trim(),
      method,
      headers: formattedHeaders,
      body: body.trim(),
      modifier,
    });
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  if (componentError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-700 font-bold mb-2">Request Form Error</h3>
        <p className="text-red-600">{componentError.message}</p>
        <button 
          onClick={() => setComponentError(null)}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border rounded-lg bg-dark-100 border-dark-border">
        <h3 className="text-lg font-medium mb-4 text-dark-text-primary">{title}</h3>

        <form onSubmit={safeOnSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  // Optional: Clear URL error as user types
                  if (errors.url) {
                    setErrors(prev => ({ ...prev, url: undefined }));
                  }
                }}
                placeholder="API URL"
                className={`w-full p-2 border rounded bg-dark-50 border-dark-border text-dark-text-primary placeholder-dark-text-secondary focus:outline-none focus:ring-2 ${
                  errors.url ? 'border-red-500 focus:ring-red-500' : 'focus:ring-dark-primary'
                }`}
                required
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url}</p>
              )}
            </div>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-24 p-2 border rounded bg-dark-50 border-dark-border text-dark-text-primary"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="border rounded-lg overflow-hidden border-dark-border">
            <div className="flex border-b border-dark-border bg-dark-200">
              <button
                type="button"
                onClick={() => setActiveTab('headers')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'headers'
                    ? 'bg-dark-300 text-dark-text-primary'
                    : 'text-dark-text-secondary hover:bg-dark-200'
                }`}
              >
                Headers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('body')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'body'
                    ? 'bg-dark-300 text-dark-text-primary'
                    : 'text-dark-text-secondary hover:bg-dark-200'
                }`}
              >
                Request Body
              </button>
            </div>

            <div className="p-4 bg-dark-50">
              {activeTab === 'headers' ? (
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addHeader}
                      className="text-sm text-dark-primary hover:text-dark-accent"
                    >
                      + Add Header
                    </button>
                  </div>
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header Key"
                        className="w-1/2 p-2 border rounded bg-dark-100 border-dark-border text-dark-text-primary placeholder-dark-text-secondary"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header Value"
                        className="w-1/2 p-2 border rounded bg-dark-100 border-dark-border text-dark-text-primary placeholder-dark-text-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        className="text-dark-text-secondary hover:text-red-500 px-2"
                        title="Remove header"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {headers.length === 0 && (
                    <div className="text-center text-dark-text-muted py-4">
                      No headers added
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      // Optional: Clear body error as user types
                      if (errors.body) {
                        setErrors(prev => ({ ...prev, body: undefined }));
                      }
                    }}
                    placeholder="Request body (JSON)"
                    className={`w-full p-2 border rounded h-24 font-mono text-sm bg-dark-100 border-dark-border text-dark-text-primary placeholder-dark-text-secondary ${
                      errors.body ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.body && (
                    <p className="text-red-500 text-sm mt-1">{errors.body}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-dark-primary text-white py-2 rounded hover:bg-dark-accent transition-colors"
          >
            Send Request
          </button>
        </form>
      </div>

      <div className="p-4 mt-4 border rounded-lg bg-dark-100 border-dark-border">
        <div>
          <button
            onClick={() => setIsModifierOpen(!isModifierOpen)}
            className="w-full text-sm text-dark-text-primary hover:text-dark-text-secondary py-2 flex items-center justify-center gap-2 rounded-md border border-dark-border hover:bg-dark-200 transition-colors"
          >
            <span>{isModifierOpen ? '▼' : '▶'}</span>
            Response Modifier
          </button>

          {isModifierOpen && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-dark-text-secondary">
                Modify Response
              </label>
              <CodeEditor
                height="150px"
                defaultLanguage="javascript"
                defaultValue={defaultModifierCode}
                onChange={(value) => {
                  const newValue = value || '';
                  setModifier(newValue);
                  onModifierChange(newValue);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function RequestForm(props: RequestFormProps) {
  return (
    <ErrorBoundary>
      <RequestFormContent {...props} />
    </ErrorBoundary>
  );
}
