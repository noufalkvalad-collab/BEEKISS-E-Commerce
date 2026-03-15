"use client";

import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/utils/exportUtils";
import { useState } from "react";

interface RevenueExportButtonsProps {
    stats: {
        revenue: number;
        orders: number;
        products: number;
        users: number;
    };
}

export default function RevenueExportButtons({ stats }: RevenueExportButtonsProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleExportExcel = () => {
        const data = [
            { Metric: "Total Revenue", Value: `₹${stats.revenue}` },
            { Metric: "Total Orders (Delivered)", Value: stats.orders },
            { Metric: "Total Products", Value: stats.products },
            { Metric: "Registered Users", Value: stats.users },
            { Metric: "Report Date", Value: new Date().toLocaleString('en-IN') }
        ];
        exportToExcel(data, `Revenue_Report_${new Date().toISOString().split('T')[0]}`, "Revenue");
        setIsMenuOpen(false);
    };

    const handleExportPDF = () => {
        const headers = ["Metric", "Value"];
        const data = [
            ["Total Revenue", `Rs. ${stats.revenue.toLocaleString('en-IN')}`],
            ["Total Orders (Delivered)", stats.orders.toString()],
            ["Total Products", stats.products.toString()],
            ["Registered Users", stats.users.toString()],
        ];
        exportToPDF(headers, data, `Revenue_Report_${new Date().toISOString().split('T')[0]}`, "Bee Kiss - Revenue Report");
        setIsMenuOpen(false);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-forest-green text-white px-4 py-2 rounded-xl font-medium hover:bg-forest-green/90 transition-all shadow-sm text-sm"
            >
                <Download className="w-4 h-4" />
                Export Report
            </button>

            {isMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                        <button
                            onClick={handleExportExcel}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            Excel Report
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4 text-red-600" />
                            PDF Report
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
