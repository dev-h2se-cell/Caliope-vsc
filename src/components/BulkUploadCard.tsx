'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileJson, X, Loader2 } from 'lucide-react';

interface BulkUploadCardProps {
  onUploadSuccess: (newItemsCount: number) => void;
  uploadAction: (jsonContent: string) => Promise<{ success: boolean; message: string; count: number }>;
  title: string;
  description: string;
  buttonText: string;
}

export function BulkUploadCard({ onUploadSuccess, uploadAction, title, description, buttonText }: BulkUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const jsonFile = acceptedFiles.find(f => f.type === 'application/json');
    if (jsonFile) {
      setFile(jsonFile);
    } else {
      toast({
        title: 'Archivo no válido',
        description: 'Por favor, selecciona un archivo con formato .json',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = event.target?.result as string;
        const result = await uploadAction(jsonContent);
        
        if (result.success) {
          toast({
            title: 'Carga Exitosa',
            description: result.message,
          });
          onUploadSuccess(result.count);
          setFile(null);
        } else {
          throw new Error(result.message);
        }

      } catch (error: any) {
        toast({
          title: 'Error al procesar el archivo',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-3">
              <FileJson className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              {isDragActive
                ? 'Suelta el archivo aquí...'
                : 'Arrastra y suelta un archivo .json o haz clic para seleccionar'}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
