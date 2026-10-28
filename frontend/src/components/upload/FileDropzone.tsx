import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

interface FileDropzoneProps {
  onStatementUploaded: (content: string, fileName?: string) => void;
  isLoading: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onStatementUploaded,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const text = await file.text();
      onStatementUploaded(text, file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const text = await file.text();
      onStatementUploaded(text, file.name);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isLoading && fileInputRef.current?.click()}
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-all duration-300 text-center ${
        isLoading ? 'opacity-60 cursor-not-allowed' : ''
      } ${
        isDragOver
          ? 'border-purple-400 bg-purple-500/10 shadow-xl shadow-purple-900/30 scale-[0.99]'
          : 'border-white/10 hover:border-purple-500/40 bg-[#121927]/60 hover:bg-[#151e30]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv"
        className="hidden"
        disabled={isLoading}
        onChange={handleFileInputChange}
      />

      <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isDragOver
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 scale-110'
              : 'bg-purple-500/10 text-purple-400 group-hover:scale-105 border border-purple-500/20'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
            {isLoading
              ? 'Processing Statement...'
              : isDragOver
              ? 'Drop transaction statement here'
              : 'Drop your transactions.txt or click to browse'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports standard PhonePe exported text statements and comma-separated logs
          </p>
        </div>

        {/* Example format pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 font-mono">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>YYYY-MM-DD, Merchant, Amount</span>
        </div>
      </div>
    </div>
  );
};
