'use client';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  height?: string;
  defaultLanguage?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  options?: any;
}

export default function CodeEditor({
  height = '200px',
  defaultLanguage = 'javascript',
  defaultValue = '',
  onChange,
  options = {},
}: CodeEditorProps) {
  return (
    <Editor
      height={height}
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        lineNumbers: 'on',
        tabSize: 2,
        ...options,
      }}
      theme="vs-light"
    />
  );
}
