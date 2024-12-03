'use client';

import { useState, useEffect } from 'react';
import Split from 'react-split';
import { RequestForm } from './components/RequestForm';
import { VisualDiffView } from './components/VisualDiffView';
import { DiffView } from './components/DiffView';

export default function Home() {
  const [leftResponse, setLeftResponse] = useState<any>(null);
  const [rightResponse, setRightResponse] = useState<any>(null);
  const [rawLeftResponse, setRawLeftResponse] = useState<any>(null);
  const [rawRightResponse, setRawRightResponse] = useState<any>(null);
  const [leftModifier, setLeftModifier] = useState<string>('');
  const [rightModifier, setRightModifier] = useState<string>('');
  const [loading, setLoading] = useState({ left: false, right: false });

  // Apply modifiers whenever they change
  useEffect(() => {
    if (rawLeftResponse) {
      applyModifier('left', rawLeftResponse, leftModifier);
    }
  }, [rawLeftResponse, leftModifier]);

  useEffect(() => {
    if (rawRightResponse) {
      applyModifier('right', rawRightResponse, rightModifier);
    }
  }, [rawRightResponse, rightModifier]);

  const applyModifier = (side: 'left' | 'right', rawResponse: any, modifier: string) => {
    try {
      if (modifier) {
        const modifierFn = new Function('response', modifier);
        const modifiedData = modifierFn(JSON.parse(JSON.stringify(rawResponse)));
        if (side === 'left') {
          setLeftResponse(modifiedData);
        } else {
          setRightResponse(modifiedData);
        }
      } else {
        if (side === 'left') {
          setLeftResponse(rawResponse);
        } else {
          setRightResponse(rawResponse);
        }
      }
    } catch (error) {
      console.error('Error in modifier function:', error);
      // On error, show the unmodified response
      if (side === 'left') {
        setLeftResponse(rawResponse);
      } else {
        setRightResponse(rawResponse);
      }
    }
  };

  const handleRequest = async (side: 'left' | 'right', request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    modifier?: string;
  }) => {
    try {
      setLoading(prev => ({ ...prev, [side]: true }));

      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? request.body : undefined,
      });

      const data = await response.json();
      
      // Store both raw and modified responses
      if (side === 'left') {
        setRawLeftResponse(data);
        setLeftModifier(request.modifier || '');
      } else {
        setRawRightResponse(data);
        setRightModifier(request.modifier || '');
      }
    } catch (error) {
      console.error('Error making request:', error);
    } finally {
      setLoading(prev => ({ ...prev, [side]: false }));
    }
  };

  return (
    <main className="min-h-screen bg-dark-100 text-dark-text-primary">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-dark-text-primary">
          API Response Comparer
        </h1>
        
        <Split
          className="flex"
          gutterSize={16}
          minSize={400}
        >
          <div className="pr-2">
            <RequestForm 
              title="Request 1"
              panelId="left"
              onSubmit={(request) => handleRequest('left', request)}
              onModifierChange={(modifier) => {
                setLeftModifier(modifier);
              }}
            />
          </div>
          <div className="pl-2">
            <RequestForm 
              title="Request 2"
              panelId="right"
              onSubmit={(request) => handleRequest('right', request)}
              onModifierChange={(modifier) => {
                setRightModifier(modifier);
              }}
            />
          </div>
        </Split>

        {loading.left || loading.right ? (
          <div className="mt-8">
            <div className="text-center py-8 text-gray-500">Loading responses...</div>
          </div>
        ) : (leftResponse || rightResponse) && (
          <div className="mt-8 space-y-8">
            <VisualDiffView left={leftResponse} right={rightResponse} />
            <DiffView left={leftResponse} right={rightResponse} />
          </div>
        )}
      </div>
    </main>
  );
}
