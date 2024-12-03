'use client';

import { useState } from 'react';
import CodeEditor from './Editor';

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

export function RequestForm({ title, onSubmit, onModifierChange }: RequestFormProps) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState('');
  const [modifier, setModifier] = useState('');
  const [isModifierOpen, setIsModifierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');

  const defaultModifierCode = `// Example: Modify the response before comparison
// The 'response' variable contains the API response
// Return the modified response
if (response.ip === '') {
  response.ip = '0.0.0.0';
}
return response;`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedHeaders = headers.reduce((acc, header) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {} as Record<string, string>);

    onSubmit({
      url,
      method,
      headers: formattedHeaders,
      body,
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

  return (
    <>
      <div className="p-4 border rounded-lg bg-dark-100 border-dark-border">
        <h3 className="text-lg font-medium mb-4 text-dark-text-primary">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="API URL"
              className="flex-1 p-2 border rounded bg-dark-50 border-dark-border text-dark-text-primary placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-dark-primary"
              required
            />
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
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Request body (JSON)"
                    className="w-full p-2 border rounded h-24 font-mono text-sm bg-dark-100 border-dark-border text-dark-text-primary placeholder-dark-text-secondary"
                  />
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
