import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Brain, FileText, Upload, X } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

function ResumeUpload({ onUpload, onClose }) {
      const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

interface DragHandler {
    (e: React.DragEvent<HTMLDivElement>): void;
}

const handleDrag: DragHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
    } else if (e.type === "dragleave") {
        setDragActive(false);
    }
};

interface DropHandler {
    (e: React.DragEvent<HTMLDivElement>): void;
}

const handleDrop: DropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile: File | undefined = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
        setFile(droppedFile);
    }
};

  const handleSubmit = async () => {
    if (!file || !targetRole) return;
    
    setIsProcessing(true);
    await onUpload(file, targetRole);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white brutalist-border brutalist-shadow p-8 w-full max-w-lg transform -rotate-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black tracking-tight">UPLOAD RESUME</h2>
          <Button
            onClick={onClose}
            className="bg-red-400 hover:bg-red-500 text-black brutalist-border brutalist-shadow font-black"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

<div className="space-y-6">
          <div>
            <Label className="font-bold text-black mb-2 block">TARGET ROLE</Label>
            <Input
              placeholder="Software Engineer, Data Analyst, etc."
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="brutalist-border font-bold"
            />
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-4 border-dashed p-8 text-center transition-all ${
              dragActive ? 'border-green-600 bg-green-50' : 'border-black'
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
              id="resume-upload"
            />
            
            {!file ? (
              <>
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="font-bold text-black mb-4">
                  DRAG & DROP YOUR RESUME HERE
                </p>
                <Button
                //   onClick={() => document.getElementById('resume-upload').click()}
                  className="bg-blue-400 hover:bg-blue-500 text-black brutalist-border brutalist-shadow font-black"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  CHOOSE FILE
                </Button>
                <p className="text-xs font-bold text-gray-600 mt-2">
                  PDF FILES ONLY
                </p>
              </>
            ) : (
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 text-green-600" />
                <p className="font-bold text-black">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!file || !targetRole || isProcessing}
            className="w-full bg-green-400 hover:bg-green-500 text-black brutalist-border brutalist-shadow font-black"
          >
            {isProcessing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                AI ANALYZING...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                ANALYZE WITH AI
              </>
            )}
          </Button>
        </div>
        
      </div>
    </div>
  )
}

export default ResumeUpload
