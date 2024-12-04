'use client';

import { useState, useEffect } from 'react';
import { RequestForm } from './components/RequestForm';
import { VisualDiffView } from './components/VisualDiffView';
import { DiffView } from './components/DiffView';
import { Header } from './components/Header';

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
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-4 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex w-full">
            <div className="pr-2 w-1/2">
              <RequestForm 
                title="Request 1"
                panelId="left"
                onSubmit={(request) => handleRequest('left', request)}
                onModifierChange={(modifier) => {
                  setLeftModifier(modifier);
                }}
              />
            </div>
            <div className="pl-2 w-1/2">
              <RequestForm 
                title="Request 2"
                panelId="right"
                onSubmit={(request) => handleRequest('right', request)}
                onModifierChange={(modifier) => {
                  setRightModifier(modifier);
                }}
              />
            </div>
          </div>

          {/* Response comparison section */}
          <div className="mt-4 w-full">
            {loading.left || loading.right ? (
              <div className="text-center py-8 text-gray-500">Loading responses...</div>
            ) : (leftResponse || rightResponse) && (
              <div className="space-y-8 w-full">
                <VisualDiffView 
                  left={leftResponse} 
                  right={rightResponse} 
                />
                <DiffView 
                  left={leftResponse} 
                  right={rightResponse} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
