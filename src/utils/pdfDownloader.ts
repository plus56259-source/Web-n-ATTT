import { jsPDF } from 'jspdf';
import { AcademicMaterial } from '../types';

/**
 * Remove Vietnamese accents for clean standard PDF font rendering (standard ASCII helvetica)
 * while preserving clean readable Vietnamese text in documentation.
 */
function toStandardAscii(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function downloadAcademicPDF(material: AcademicMaterial): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Header bar styling
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(248, 250, 252);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('UNILEVELUP - KHO HOC LIEU DAI HOC CHUAN QUOC GIA', margin, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Official Academic Syllabus & Guide | Ma hoc phan: ${material.subjectCode}`, margin, 21);

    yPos = 38;

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const titleLines = doc.splitTextToSize(toStandardAscii(material.title), contentWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 7 + 4;

    // University & Author pill box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`Truong / Don vi dao tao:`, margin + 4, yPos + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(toStandardAscii(material.university), margin + 48, yPos + 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`Tac gia / Bien soan:`, margin + 4, yPos + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(toStandardAscii(material.author), margin + 48, yPos + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`So tin chi: ${material.credits} | So trang: ${material.pages || 350} | Nam: ${material.year || 2023}`, margin + 4, yPos + 18);

    yPos += 30;

    // Section 1: Overview
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('1. TONG QUAN HOC PHAN & MUC TIEU MON HOC', margin, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(toStandardAscii(material.description), contentWidth);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 5 + 6;

    // Section 2: Key Curriculum Topics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('2. NOI DUNG TRONG TAM & DE CUONG CHI TIET CAC CHUONG', margin, yPos);
    yPos += 6;

    material.keyTopics.forEach((topic, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129); // green bullet
      doc.text(`[${idx + 1}]`, margin, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const topicLines = doc.splitTextToSize(toStandardAscii(topic), contentWidth - 10);
      doc.text(topicLines, margin + 8, yPos);
      yPos += topicLines.length * 4.8 + 2;
    });

    yPos += 4;

    // Check if new page needed
    if (yPos > 210) {
      doc.addPage();
      yPos = 20;
    }

    // Section 3: Exam Tips & High Score Strategy
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text('3. BI QUYET ON THI & PHONG TRANH BAY DIEM LIET (THU KHOA A+)', margin, yPos);
    yPos += 6;

    doc.setFillColor(254, 243, 199); // amber-100
    const tipText = toStandardAscii(material.tipsForExam);
    const tipLines = doc.splitTextToSize(tipText, contentWidth - 8);
    const tipBoxHeight = tipLines.length * 5 + 8;
    doc.roundedRect(margin, yPos, contentWidth, tipBoxHeight, 2, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 53, 15);
    doc.text(tipLines, margin + 4, yPos + 6);
    yPos += tipBoxHeight + 8;

    // Section 4: Official Source Links
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('4. NGUON TRA CUU & THU VIEN NHA TRUONG', margin, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(toStandardAscii(`Don vi phat hanh: ${material.officialSource || material.publisher || material.university}`), margin, yPos);
    yPos += 5;
    if (material.viewOnlineUrl) {
      doc.text(`Lien ket truc tuyen: ${material.viewOnlineUrl}`, margin, yPos);
      yPos += 5;
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 282, pageWidth - margin, 282);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`UniLevelUp Academic Library | Trang ${i} / ${pageCount}`, margin, 287);
      doc.text(toStandardAscii(`Tai lieu: ${material.title.substring(0, 40)}...`), pageWidth - margin - 60, 287);
    }

    // Trigger real download
    const cleanFileName = toStandardAscii(material.title)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);
    doc.save(`${cleanFileName}_GiaoTrinh_UniLevelUp.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}
