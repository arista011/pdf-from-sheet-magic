import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MCUData } from '@/types/mcu';

export const generateMCUPDF = (data: MCUData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with logo placeholder
  doc.setFillColor(0, 165, 233);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 15, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 15, 18);
  
  doc.setFontSize(8);
  doc.text('life.love.laughter', pageWidth - 45, 15);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN HASIL MEDICAL CHECK UP', pageWidth / 2, 35, { align: 'center' });
  
  // Data Pasien Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA PASIEN', 15, 50);
  
  const patientData = [
    ['NAMA LENGKAP', `: ${data["Nama Karyawan"] || '-'}`],
    ['JENIS KELAMIN', `: ${data["Jenis Kelamin"] || '-'}`],
    ['NPK', `: ${data["NPK"] || '-'}`],
    ['SEKSI', `: ${data["SEKSI"] || '-'}`],
    ['DEPARTEMEN', `: ${data["DEPARTEMEN"] || '-'}`],
    ['PERIODE', `: ${data["Tanggal MCU"] || '-'}`],
    ['PERUSAHAAN', ': PT. SUZUKI INDOMOBIL MOTOR (TAMBUN 2)'],
  ];
  
  autoTable(doc, {
    startY: 55,
    body: patientData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Page 2 - Detailed Information
  doc.addPage();
  
  // Header on page 2
  doc.setFillColor(0, 165, 233);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 15, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 15, 18);
  doc.setFontSize(8);
  doc.text('life.love.laughter', pageWidth - 45, 15);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN HASIL MEDICAL CHECK UP', pageWidth / 2, 35, { align: 'center' });
  
  let yPos = 50;
  
  // I. Identitas
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('I. Identitas', 15, yPos);
  
  const identityData = [
    ['NPK', data["NPK"] || '-'],
    ['Nama', data["Nama Karyawan"] || '-'],
    ['PAT ID', data["PATID"] || '-'],
    ['Tanggal lahir', data["Tanggal lahir"] || '-'],
    ['Usia', `${data["Usia"] || '-'} Tahun`],
    ['Jenis kelamin', data["Jenis Kelamin"] || '-'],
    ['Tanggal MCU', data["Tanggal MCU"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos + 5,
    body: identityData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // II. Anamnesa
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('II. Anamnesa', 15, yPos);
  
  yPos += 5;
  doc.setFontSize(12);
  doc.text('Riwayat penyakit sekarang', 15, yPos);
  
  const anamnesaData = [
    ['Riwayat Penyakit Sekarang', data["Riwayat Penyakit Sekarang"] || 'Tidak Ada'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: anamnesaData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(12);
  doc.text('Riwayat penyakit dahulu', 15, yPos);
  
  const riwayatData = [
    ['Riwayat Penyakit Dahulu', data["Riwayat Penyakit Dahulu"] || 'Tidak Ada'],
    ['Riwayat Penyakit Keluarga', data["Riwayat Penyakit Keluarga"] || 'Tidak Ada'],
    ['Riwayat Pengobatan', data["Riwayat Pengobatan"] || 'Tidak Ada'],
    ['Riwayat Operasi', data["Riwayat Operasi"] || 'Tidak Ada'],
    ['Riwayat Kecelakaan', data["Riwayat Kecelakaan"] || 'Tidak pernah'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: riwayatData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(12);
  doc.text('Riwayat Kebiasaan', 15, yPos);
  
  const kebiasaanData = [
    ['Merokok /Vape', data["Merokok /Vape"] || 'Tidak'],
    ['Jumlah Batang', data["Jumlah Batang"] || '-'],
    ['Alkohol', data["Alkohol"] || 'Tidak'],
    ['Olahraga', data["Olahraga"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: kebiasaanData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Page 3 - Physical Examination
  doc.addPage();
  
  // Header on page 3
  doc.setFillColor(0, 165, 233);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 15, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 15, 18);
  doc.setFontSize(8);
  doc.text('life.love.laughter', pageWidth - 45, 15);
  
  doc.setTextColor(0, 0, 0);
  
  yPos = 35;
  
  // III. Pemeriksaan Fisik
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('III. Pemeriksaan Fisik', 15, yPos);
  
  yPos += 5;
  doc.setFontSize(12);
  doc.text('1. Status Generalis', 15, yPos);
  
  const statusData = [
    ['Hasil Tensi', `${data["Tekanan Darah MmHg"] || '-'} mmHg`],
    ['Nadi', `${data["Nadi ()"] || '-'} x/menit`],
    ['Suhu Badan', `${data["Suhu Badan C"] || '-'} ℃`],
    ['Frekuensi nafas', `${data["Frekuensi nafas ()"] || '-'} (x/menit)`],
    ['Tinggi Badan', `${data["Tinggi (cm)"] || '-'} cm`],
    ['Berat Badan', `${data["Berat ()"] || '-'} Kg`],
    ['BMI', `${data["BMI"] || '-'} (Kg/m2)`],
    ['Status Gizi', data["Status Gizi"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: statusData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // 2. Mata
  doc.setFontSize(12);
  doc.text('2. Mata', 15, yPos);
  
  yPos += 5;
  doc.setFontSize(11);
  doc.text('2.1 Mata Kanan', 15, yPos);
  
  const mataKananData = [
    ['Visus Mata Kanan', data["Visus Mata Kanan"] || '-'],
    ['Keadaan umum', data["Keadaan umum Kanan"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: mataKananData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(11);
  doc.text('2.2 Mata Kiri', 15, yPos);
  
  const mataKiriData = [
    ['Visus Mata Kiri', data["Visus Mata Kiri"] || '-'],
    ['Keadaan umum', data["Keadaan Umum Kiri"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: mataKiriData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(11);
  doc.text('2.3 Test Buta Warna', 15, yPos);
  
  const butaWarnaData = [
    ['Test buta warna', data["Test Buta Warna"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos + 2,
    body: butaWarnaData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Kesimpulan dan Saran
  if (data["Kesimpulan"] || data["Saran"]) {
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    if (data["Kesimpulan"]) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Kesimpulan:', 15, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const kesimpulanLines = doc.splitTextToSize(data["Kesimpulan"], pageWidth - 30);
      doc.text(kesimpulanLines, 15, yPos);
      yPos += kesimpulanLines.length * 5 + 5;
    }
    
    if (data["Saran"]) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Saran:', 15, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const saranLines = doc.splitTextToSize(data["Saran"], pageWidth - 30);
      doc.text(saranLines, 15, yPos);
    }
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Senyum, cinta, dan lakukan yang terbaik untuk harimu', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
