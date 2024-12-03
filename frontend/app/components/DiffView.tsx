'use client';

import { compareResponses } from '../utils/compareResponses';

interface DiffViewProps {
  left: any;
  right: any;
}

export function DiffView({ left, right }: DiffViewProps) {
  const differences = left && right ? compareResponses(left, right) : [];

  if (differences.length === 0) {
    return (
      <div className="text-center text-dark-text-muted p-4">
        No differences found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden border-dark-border bg-dark-100">
      <div className="bg-dark-200 px-4 py-2 font-medium border-b border-dark-border text-dark-text-primary">
        Detailed Differences
      </div>
      <div className="divide-y divide-dark-border">
        {differences.map((diff, index) => (
          <div key={index} className="p-4">
            <div className="font-mono text-sm text-dark-text-secondary mb-2">
              Path: {diff.path.join('.')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-dark-text-secondary mb-1">Left Value:</div>
                <pre className="bg-dark-300 p-2 rounded text-red-300 text-sm overflow-auto border border-dark-border">
                  {JSON.stringify(diff.left, null, 2)}
                </pre>
              </div>
              <div>
                <div className="text-sm font-medium text-dark-text-secondary mb-1">Right Value:</div>
                <pre className="bg-dark-300 p-2 rounded text-green-300 text-sm overflow-auto border border-dark-border">
                  {JSON.stringify(diff.right, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
