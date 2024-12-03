'use client';

import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface VisualDiffViewProps {
  left: any;
  right: any;
}

export function VisualDiffView({ left, right }: VisualDiffViewProps) {
  const formatJson = (json: any) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch {
      return '';
    }
  };

  if (!left && !right) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium border-b">
        Visual Difference
      </div>
      <ReactDiffViewer
        oldValue={formatJson(left)}
        newValue={formatJson(right)}
        splitView={true}
        hideLineNumbers={false}
        showDiffOnly={false}
        useDarkTheme={false}
        compareMethod={DiffMethod.WORDS}
        leftTitle="Response 1"
        rightTitle="Response 2"
        styles={{
          variables: {
            light: {
              diffViewerBackground: '#fff',
              addedBackground: '#e6ffec',
              addedColor: '#1a7f37',
              removedBackground: '#ffebe9',
              removedColor: '#cf222e',
              wordAddedBackground: '#abf2bc',
              wordRemovedBackground: '#ffd7d5',
              addedGutterBackground: '#e6ffec',
              removedGutterBackground: '#ffebe9',
              gutterBackground: '#f6f8fa',
              gutterBackgroundDark: '#f0f1f2',
            },
          },
        }}
      />
    </div>
  );
}
