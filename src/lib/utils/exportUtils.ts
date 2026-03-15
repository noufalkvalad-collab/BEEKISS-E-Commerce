import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (headers: string[], data: any[][], fileName: string, title?: string) => {
    const doc = new jsPDF();
    
    if (title) {
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 30);
    }

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: title ? 35 : 15,
        theme: 'striped',
        headStyles: { fillColor: [15, 46, 29] }, // forest-green color from BEEKISS theme
        styles: { fontSize: 8 },
    });

    doc.save(`${fileName}.pdf`);
};
