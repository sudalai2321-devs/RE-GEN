'use client';

import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  loading?: boolean;
}

export function FileUpload({ onFileSelect, accept = '.pdf,.docx,.pptx,.txt,.md', loading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
        dragActive
          ? 'border-blue-500 bg-blue-950/30'
          : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <label htmlFor="file-upload" className="cursor-pointer block">
        <div className="w-14 h-14 rounded-2xl bg-blue-950/40 text-blue-400 border border-blue-800/60 flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h4 className="text-base font-semibold text-white mb-1">
          Drop documented project report or file
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          Supports research papers, technical reports, presentation decks: PDF, DOCX, PPTX, TXT, MD
        </p>
        <span className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors">
          Browse Files
        </span>
      </label>

      {selectedFile && (
        <div className="mt-6 p-3 bg-slate-800/60 border border-slate-700 rounded-xl max-w-md mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-200 truncate">
            <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="truncate font-medium">{selectedFile.name}</span>
          </div>
          <span className="text-slate-400 font-mono">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </span>
        </div>
      )}
    </div>
  );
}
