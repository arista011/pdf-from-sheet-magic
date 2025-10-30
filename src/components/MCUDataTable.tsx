import { MCUData } from '@/types/mcu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MCUDataTableProps {
  data: MCUData[];
  onGeneratePDF: (employee: MCUData, index: number) => void;
  onGenerateAll: () => void;
}

export const MCUDataTable = ({ data, onGeneratePDF, onGenerateAll }: MCUDataTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Karyawan MCU</CardTitle>
            <CardDescription>
              Total {data.length} karyawan ditemukan
            </CardDescription>
          </div>
          <Button onClick={onGenerateAll} size="lg">
            <Download className="mr-2 h-4 w-4" />
            Generate Semua PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>NPK</TableHead>
                <TableHead>Nama Karyawan</TableHead>
                <TableHead>Seksi</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Tanggal MCU</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{employee.NPK}</TableCell>
                  <TableCell>{employee["Nama Karyawan"]}</TableCell>
                  <TableCell className="text-sm">{employee.SEKSI}</TableCell>
                  <TableCell className="text-sm">{employee.DEPARTEMEN}</TableCell>
                  <TableCell>{employee["Tanggal MCU"]}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGeneratePDF(employee, index)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      PDF
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
