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
    <div className="border border-dark-border rounded-lg overflow-hidden bg-dark-100 w-full">
      <div className="bg-dark-200 px-4 py-2 font-medium border-b border-dark-border text-dark-text-primary">
        Visual Difference
      </div>
      <ReactDiffViewer
        oldValue={formatJson(left)}
        newValue={formatJson(right)}
        splitView={true}
        hideLineNumbers={false}
        showDiffOnly={false}
        useDarkTheme={true}
        compareMethod={DiffMethod.WORDS}
        leftTitle="Response 1"
        rightTitle="Response 2"
        styles={{
          variables: {
            dark: {
              diffViewerBackground: '#1A1E23',
              addedBackground: '#10403A',
              addedColor: '#2DE5A5',
              removedBackground: '#4A2C33',
              removedColor: '#FF6B6B',
              wordAddedBackground: '#15594D',
              wordRemovedBackground: '#6B2E35',
              addedGutterBackground: '#10403A',
              removedGutterBackground: '#4A2C33',
              gutterBackground: '#161A1E',
              gutterBackgroundDark: '#121518',
              diffViewerTitleBackground: '#161A1E',
              diffViewerTitleColor: '#E5E7EB',
              diffViewerTitleBorderColor: '#2C3036',
            },
          },
          contentText: {
            color: '#E5E7EB',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.5',
          },
          line: {
            minWidth: '50%',
          },
        }}
      />
    </div>
  );
}
