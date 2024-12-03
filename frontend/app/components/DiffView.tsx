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
      <div className="text-center text-gray-500 p-4">
        No differences found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        Detailed Differences
      </div>
      <div className="divide-y">
        {differences.map((diff, index) => (
          <div key={index} className="p-4">
            <div className="font-mono text-sm text-gray-600 mb-2">
              Path: {diff.path.join('.')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Left Value:</div>
                <pre className="bg-red-50 p-2 rounded text-red-700 text-sm overflow-auto">
                  {JSON.stringify(diff.left, null, 2)}
                </pre>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Right Value:</div>
                <pre className="bg-green-50 p-2 rounded text-green-700 text-sm overflow-auto">
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
