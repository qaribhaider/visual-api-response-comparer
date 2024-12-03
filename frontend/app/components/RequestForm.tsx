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
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="API URL"
              className="flex-1 p-2 border rounded"
              required
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-24 p-2 border rounded"
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
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Headers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('body')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'body'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
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
                      className="text-sm text-blue-600 hover:text-blue-800"
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
                        className="w-1/2 p-2 border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header Value"
                        className="w-1/2 p-2 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                        title="Remove header"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {headers.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
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
                    className="w-full p-2 border rounded h-24 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Send Request
          </button>
        </form>
      </div>

      <div className="p-4 mt-4 border rounded-lg">
        <div>
          <button
            onClick={() => setIsModifierOpen(!isModifierOpen)}
            className="w-full text-sm text-gray-700 hover:text-gray-900 py-2 flex items-center justify-center gap-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span>{isModifierOpen ? '▼' : '▶'}</span>
            Response Modifier
          </button>

          {isModifierOpen && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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