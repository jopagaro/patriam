'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

interface EditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

export default function Editor({ initialContent, onSave }: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[500px] focus:outline-none',
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      await onSave(editor.getHTML());
    } catch (error) {
      console.error('Failed to save:', error);
      // You might want to show an error toast here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6">
      <div className="border border-light-900/10 rounded-lg p-4 mb-4">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 