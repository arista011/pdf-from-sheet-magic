import { useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(
      (file) =>
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.csv')
    );

    if (excelFile) {
      onFileSelect(excelFile);
    } else {
      toast({
        title: 'File tidak valid',
        description: 'Silakan upload file Excel (.xlsx, .xls, atau .csv)',
        variant: 'destructive',
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.csv')
      ) {
        onFileSelect(file);
      } else {
        toast({
          title: 'File tidak valid',
          description: 'Silakan upload file Excel (.xlsx, .xls, atau .csv)',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-primary/10 p-6 mb-4">
          <FileSpreadsheet className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Upload File Excel MCU</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Drag & drop file Excel Anda di sini, atau klik tombol di bawah untuk memilih file
        </p>
        <div className="flex gap-4">
          <Button asChild className="cursor-pointer">
            <label>
              <Upload className="mr-2 h-4 w-4" />
              Pilih File
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
              />
            </label>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Format yang didukung: .xlsx, .xls, .csv
        </p>
      </CardContent>
    </Card>
  );
};
