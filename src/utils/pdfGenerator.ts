import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MCUData } from '@/types/mcu';
import logoImage from '@/assets/mitra-keluarga-logo.png';

export const generateMCUPDF = (data: MCUData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with logo
  doc.setFillColor(0, 165, 233);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  // Add logo
  doc.addImage(logoImage, 'PNG', 10, 5, 15, 15);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 28, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 28, 18);
  
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
  doc.addImage(logoImage, 'PNG', 10, 5, 15, 15);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 28, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 28, 18);
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
  doc.addImage(logoImage, 'PNG', 10, 5, 15, 15);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 28, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 28, 18);
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
  
  let yPos2 = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(11);
  doc.text('2.3 Test Buta Warna', 15, yPos2);
  
  const butaWarnaData = [
    ['Test buta warna', data["Test Buta Warna"] || '-'],
  ];
  
  autoTable(doc, {
    startY: yPos2 + 2,
    body: butaWarnaData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Kesimpulan dan Saran - Add new page for this section
  doc.addPage();
  
  // Header on new page
  doc.setFillColor(0, 165, 233);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.addImage(logoImage, 'PNG', 10, 5, 15, 15);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mitra Keluarga', 28, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grand Wisata', 28, 18);
  doc.setFontSize(8);
  doc.text('life.love.laughter', pageWidth - 45, 15);
  doc.setTextColor(0, 0, 0);
  
  let yPos3 = 35;
  
  // V. Kesimpulan
  if (data["Kesimpulan"]) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('V. Kesimpulan', 15, yPos3);
    yPos3 += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const kesimpulanLines = doc.splitTextToSize(data["Kesimpulan"], pageWidth - 30);
    doc.text(kesimpulanLines, 15, yPos3);
    yPos3 += kesimpulanLines.length * 5 + 10;
  }
  
  // VI. Saran
  if (data["Saran"]) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('VI. Saran', 15, yPos3);
    yPos3 += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const saranLines = doc.splitTextToSize(data["Saran"], pageWidth - 30);
    doc.text(saranLines, 15, yPos3);
    yPos3 += saranLines.length * 5 + 10;
  }
  
  // VII. Kriteria Status MCU
  if (data["Kriteria Status"] || data["Status_Resume"]) {
    const status = data["Kriteria Status"] || data["Status_Resume"] || '';
    
    if (yPos3 > 230) {
      doc.addPage();
      doc.setFillColor(0, 165, 233);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.addImage(logoImage, 'PNG', 10, 5, 15, 15);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Mitra Keluarga', 28, 12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Grand Wisata', 28, 18);
      doc.setFontSize(8);
      doc.text('life.love.laughter', pageWidth - 45, 15);
      doc.setTextColor(0, 0, 0);
      yPos3 = 35;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('VII. Kriteria Status MCU', 15, yPos3);
    yPos3 += 10;
    
    // Status text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Kriteria Status MCU: ${status.toUpperCase()}`, 15, yPos3);
    yPos3 += 10;
    
    // Date and location
    const currentDate = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dateStr = `Bekasi, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(dateStr, 15, yPos3);
    yPos3 += 20;
    
    // Doctor signature section
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    // Add logo watermark for signature area
    doc.addImage(logoImage, 'PNG', 15, yPos3 - 5, 10, 10);
    doc.text('Mitra', 28, yPos3);
    yPos3 += 4;
    doc.text('Keluarga', 28, yPos3);
    yPos3 += 15;
    
    // Doctor name
    const doctorName = data["Dokter Pemeriksa"] || 'dr. Eka Rizki Febriyanti';
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(doctorName, 15, yPos3);
    yPos3 += 5;
    
    // Grand Wisata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Grand Wisata', 15, yPos3);
    yPos3 += 5;
    
    // SIP License
    doc.setFontSize(8);
    doc.text('SIP : KS.08/1217/DPMTSP/DU/2024', 15, yPos3);
    yPos3 += 7;
    
    // Position title
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('DOKTER MEDICAL CHECK UP', 15, yPos3);
    
    // Status box - colored based on status
    let bgColor: [number, number, number] = [16, 185, 129]; // Default green
    
    const statusUpper = status.toUpperCase();
    
    if (statusUpper.includes('FIT TO WORK WITH NOTE') || statusUpper.includes('CATATAN')) {
      bgColor = [234, 179, 8]; // Yellow
    } else if (statusUpper.includes('UNFIT TO WORK') || statusUpper.includes('TIDAK FIT')) {
      bgColor = [239, 68, 68]; // Red
    } else if (statusUpper.includes('FIT TO WORK') || statusUpper.includes('FIT')) {
      bgColor = [16, 185, 129]; // Green
    }
    
    // Draw status box on the right side
    const boxWidth = 70;
    const boxHeight = 12;
    const boxX = pageWidth - boxWidth - 15;
    const boxY = yPos3 - 50;
    
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'F');
    
    // Draw status text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(status.toUpperCase(), boxX + boxWidth / 2, boxY + 7, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
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
