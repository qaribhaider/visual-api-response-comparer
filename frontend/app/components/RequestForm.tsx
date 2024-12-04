'use client';

import { useState, useCallback, useEffect } from 'react';
import CodeEditor from './Editor';
import { ErrorBoundary } from './ErrorBoundary';
import { FaTimes } from 'react-icons/fa';

interface RequestFormProps {
  title: string;
  panelId: string;
  onSubmit: (request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    modifier?: string;
  }) => void;
  onModifierChange: (modifier: string) => void;
}

// Strictly typed configuration for local storage
type RequestConfig = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Array<{ key: string; value: string }>;
  body: string;
};

// Validation function to ensure type safety
function isValidRequestConfig(config: any): config is RequestConfig {
  // Detailed logging for debugging
  console.log('Validating config:', config);

  // Check if config is an object
  if (typeof config !== 'object' || config === null) {
    console.warn('Invalid config: not an object');
    return false;
  }

  // Validate URL (allow empty string)
  if (typeof config.url !== 'string') {
    console.warn('Invalid URL:', config.url);
    return false;
  }

  // Validate method
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!allowedMethods.includes(config.method)) {
    console.warn('Invalid method:', config.method);
    return false;
  }

  // Validate headers
  if (!Array.isArray(config.headers)) {
    console.warn('Headers is not an array:', config.headers);
    return false;
  }

  // Strict header validation
  const validHeaders = config.headers.every(
    (header: any) => 
      header !== null &&
      typeof header === 'object' && 
      typeof header.key === 'string' && 
      typeof header.value === 'string'
  );

  if (!validHeaders) {
    console.warn('Invalid headers:', config.headers);
    return false;
  }

  // Validate body
  if (typeof config.body !== 'string') {
    console.warn('Invalid body:', config.body);
    return false;
  }

  return true;
}

function RequestFormContent({ 
  title, 
  panelId, 
  onSubmit, 
  onModifierChange 
}: RequestFormProps) {
  // Unique local storage key for this specific panel
  const LOCAL_STORAGE_KEY = `request-config-${panelId}-v2`;

  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState('');
  const [modifier, setModifier] = useState('');
  const [isModifierOpen, setIsModifierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');
  const [errors, setErrors] = useState<{ url?: string; body?: string }>({});
  const [componentError, setComponentError] = useState<Error | null>(null);

  // Load configuration from local storage on component mount
  useEffect(() => {
    try {
      console.log(`Loading configuration for ${panelId}`);
      const savedConfigString = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (savedConfigString) {
        try {
          const savedConfig = JSON.parse(savedConfigString);
          
          console.log(`Saved config for ${panelId}:`, savedConfig);
          
          // Validate the saved configuration
          if (isValidRequestConfig(savedConfig)) {
            // Explicitly set each state to ensure no reference issues
            setUrl(savedConfig.url || '');
            setMethod(savedConfig.method);
            
            // Deep clone headers to prevent any reference sharing
            const loadedHeaders = savedConfig.headers.map(header => ({
              key: header.key,
              value: header.value
            }));
            
            console.log(`Loaded headers for ${panelId}:`, loadedHeaders);
            setHeaders(loadedHeaders);
            
            setBody(savedConfig.body || '');
          } else {
            // If invalid, remove the incorrect local storage entry
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            console.warn(`Invalid saved configuration for ${panelId}, cleared local storage`);
          }
        } catch (parseError) {
          // JSON parsing failed
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          console.error(`Failed to parse saved configuration for ${panelId}:`, parseError);
        }
      }
    } catch (error) {
      console.error(`Error loading saved configuration for ${panelId}:`, error);
    }
  }, [LOCAL_STORAGE_KEY, panelId]);

  // Save configuration to local storage whenever relevant fields change
  useEffect(() => {
    try {
      // Prepare configuration object with deep cloning
      const currentConfig: RequestConfig = {
        url,
        method,
        // Create a deep, independent copy of headers
        headers: headers.map(header => ({ 
          key: header.key.trim(), 
          value: header.value.trim() 
        })),
        body
      };

      console.log(`Saving configuration for ${panelId}:`, currentConfig);

      // Validate before saving
      if (isValidRequestConfig(currentConfig)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentConfig));
      }
    } catch (error) {
      console.error(`Error saving configuration for ${panelId}:`, error);
    }
  }, [url, method, headers, body, LOCAL_STORAGE_KEY, panelId]);

  // Reset all form fields and clear local storage
  const handleReset = () => {
    // Clear local storage
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Reset all state
    setUrl('');
    setMethod('GET');
    setHeaders([]);
    setBody('');
    setModifier('');
    setIsModifierOpen(false);
    setActiveTab('headers');
    setErrors({});
  };

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
    } catch {
      return 'Invalid URL format';
    }
  }, []);

  // JSON Validation Function
  const validateJson = useCallback((jsonString: string) => {
    if (!jsonString.trim()) return null; // Empty is valid
    try {
      // Attempt to parse the JSON
      JSON.parse(jsonString);
      
      // Additional custom validation can be added here
      
      return null; // Valid JSON
    } catch {
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

  // Method change handler with type-safe conversion
  const handleMethodChange = useCallback((value: string) => {
    // Type guard to ensure only allowed methods are set
    const allowedMethods: Array<'GET' | 'POST' | 'PUT' | 'DELETE'> = ['GET', 'POST', 'PUT', 'DELETE'];
    const method = value as 'GET' | 'POST' | 'PUT' | 'DELETE';
    if (allowedMethods.includes(method)) {
      setMethod(method);
    }
  }, []);

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
      {/* <div className="p-4 border rounded-lg bg-dark-100 border-dark-border"> */}
      {/* <div className="p-4 rounded-xl bg-gray-800"> */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        {/* <h3 className="text-lg font-semibold mb-4 text-dark-text-primary">{title}</h3> */}
        <h3 className="mb-4 text-lg font-bold text-gray-800">{title}</h3>

        <form onSubmit={safeOnSubmit} className="space-y-4">
          <div className="flex">
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
                className={`w-full rounded-l border py-2 px-3 focus:outline-none focus:ring-2 ${
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
              onChange={(e) => handleMethodChange(e.target.value)}
              className="w-24 py-2 px-3 border rounded-r"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveTab('headers')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'headers'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-300'
                }`}
              >
                Headers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('body')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'body'
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-300'
                }`}
              >
                Request Body
              </button>
            </div>

            <div className="p-4">
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
                        className="w-1/2 px-3 py-1.5 border rounded text-xs"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header Value"
                        className="w-1/2 px-3 py-1.5 border rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        className="px-2 text-gray-400 hover:text-red-500"
                        title="Remove header"
                      >
                        <FaTimes className="h-3 w-3" />
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

          <div className="flex items-center space-x-2 mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Send Request
            </button>
          </div>
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
                height="187.5px"
                defaultLanguage="javascript"
                defaultValue={defaultModifierCode}
                onChange={(value) => {
                  const newValue = value || '';
                  setModifier(newValue);
                }}
              />
              <button
                type="button"
                onClick={() => onModifierChange(modifier)}
                className="w-full p-2 bg-dark-200 text-dark-text-secondary rounded hover:bg-dark-300 transition-colors mt-2"
              >
                Apply Modifier
              </button>
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
