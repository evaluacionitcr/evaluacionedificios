"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, X, Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from "~/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  name: string;
  url: string;
}

interface StagedFile {
  id: string;
  file: File;
  preview: string;
}

import { LoadingSpinnerSVG } from "~/components/ui/svg";

export default function ImagesComponent() {
  const testEvaluationId = 123;
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin() {
      toast(
        <div className="flex items-center gap-2 text-white">
          <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 5000,
          id: "uploading-toast",
        },
      );
    },
    onUploadError(err) {
      toast.dismiss("uploading-toast");
      toast.error("Upload failed. Please try again.");
      setIsSaving(false);
    },
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setStagedFiles([]); // Clear staged files after successful upload
      }
      setIsSaving(false);
      toast.success("Images uploaded successfully!");
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const newStagedFiles = acceptedFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file)
      }));
      setStagedFiles(prev => [...prev, ...newStagedFiles]);
    }
  });

  const handleRemoveStaged = (id: string) => {
    setStagedFiles(files => {
      const fileToRemove = files.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return files.filter(f => f.id !== id);
    });
  };


  const handleSave = async () => {
    if (stagedFiles.length === 0) {
      toast.error("No images to upload");
      return;
    }
    
    setIsSaving(true);
    await startUpload(stagedFiles.map(f => f.file), {
      evaluationId: testEvaluationId,
      description: "Imágenes de evaluación",
    });
  };

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      stagedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="mb-4 text-xl font-semibold">
        Imágenes de la evaluación
      </h2>

      <div {...getRootProps()} className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          {isDragActive ? (
            <p>Suelta las imágenes aquí ...</p>
          ) : (
            <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
          )}
        </div>
      </div>

      {/* Staged Images */}
      {stagedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">
              Imágenes pendientes ({stagedFiles.length})
            </h3>
            
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {stagedFiles.map((file) => (
              <div key={file.id} className="group relative overflow-hidden rounded-md border">
                <div className="relative aspect-square">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStaged(file.id)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="truncate p-2 text-xs">{file.file.name}</div>
              </div>
            ))}
          </div>
        </div>
      )
      }
      <Button 
              onClick={handleSave} 
              disabled={isSaving || isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? 'Guardando...' : 'Guardar Imágenes'}
      </Button>
    </div>
  );
}
