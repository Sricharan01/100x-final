import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { AnalysisResult } from '../types/analysisTypes';

export const exportToPDF = async (
  analysis: AnalysisResult,
  chartRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
  const pdf = new jsPDF();
  let yOffset = 10;

  // Add title
  pdf.setFontSize(16);
  pdf.text('Data Analysis Report', 10, yOffset);
  yOffset += 15;

  // Add analysis text
  pdf.setFontSize(12);
  const addText = (text: string, title?: string) => {
    if (title) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, 10, yOffset);
      yOffset += 7;
      pdf.setFont('helvetica', 'normal');
    }
    
    const splitText = pdf.splitTextToSize(text, 180);
    pdf.text(splitText, 10, yOffset);
    yOffset += splitText.length * 7 + 5;
  };

  // Add each section
  if (analysis.insights.summary) {
    addText(analysis.insights.summary, 'Summary');
  }

  ['keyFindings', 'trends', 'correlations', 'recommendations'].forEach(section => {
    if (analysis.insights[section]?.length) {
      yOffset += 5;
      addText(
        analysis.insights[section].map((item: string) => `• ${item}`).join('\n'),
        section.charAt(0).toUpperCase() + section.slice(1)
      );
    }
  });

  // Add charts
  if (chartRef.current) {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    // Add new page if needed
    if (yOffset > 250) {
      pdf.addPage();
      yOffset = 10;
    }
    
    pdf.addImage(imgData, 'PNG', 10, yOffset, 190, 100);
  }

  pdf.save('data-analysis-report.pdf');
};

export const exportToDocx = async (
  analysis: AnalysisResult,
  data: any[]
): Promise<void> => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Data Analysis Report',
              bold: true,
              size: 32
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n' })]
        }),
        // Add analysis sections
        ...Object.entries(analysis.insights).flatMap(([section, content]) => {
          if (!content) return [];
          
          return [
            new Paragraph({
              children: [
                new TextRun({
                  text: section.charAt(0).toUpperCase() + section.slice(1),
                  bold: true,
                  size: 24
                })
              ]
            }),
            ...(Array.isArray(content) 
              ? content.map(item => new Paragraph({
                  children: [new TextRun({ text: `• ${item}` })]
                }))
              : [new Paragraph({
                  children: [new TextRun({ text: content })]
                })]
            ),
            new Paragraph({ children: [new TextRun({ text: '\n' })] })
          ];
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'data-analysis-report.docx');
};

export const exportToImage = async (
  chartRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
  if (!chartRef.current) return;

  const canvas = await html2canvas(chartRef.current);
  canvas.toBlob(blob => {
    if (blob) {
      saveAs(blob, 'data-analysis-charts.png');
    }
  });
};

export const exportToJSON = async (
  analysis: AnalysisResult,
  data: any[]
): Promise<void> => {
  const exportData = {
    analysis,
    data,
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  
  saveAs(blob, 'data-analysis-report.json');
};