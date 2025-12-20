import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, History } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PDFHistoryItem {
  id: string;
  nama_karyawan: string;
  npk: string | null;
  file_name: string;
  generated_at: string;
}

interface PDFHistoryTableProps {
  data: PDFHistoryItem[];
  onDelete: (id: string) => void;
}

export const PDFHistoryTable = ({ data, onDelete }: PDFHistoryTableProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada riwayat PDF yang di-generate</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Riwayat PDF
        </CardTitle>
        <CardDescription>
          {data.length} PDF telah di-generate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Karyawan</TableHead>
                <TableHead>NPK</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama_karyawan}</TableCell>
                  <TableCell>{item.npk || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.file_name}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(item.generated_at), 'dd MMM yyyy HH:mm', { locale: id })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
