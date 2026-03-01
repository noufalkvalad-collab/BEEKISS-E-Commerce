"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, MoreVertical, CheckCircle, Clock, Truck, Package } from "lucide-react";

// Mock Data
const MOCK_ORDERS = [
    { id: "ORD-9012", customer: "Rahul Sharma", email: "rahul.s@example.com", date: "2026-02-28", items: 2, total: 2598, status: "Processing", payment: "Paid" },
    { id: "ORD-9011", customer: "Priya Patel", email: "priya.p@example.com", date: "2026-02-28", items: 1, total: 1299, status: "Pending", payment: "Pending" },
    { id: "ORD-9010", customer: "Amit Kumar", email: "amit.k@example.com", date: "2026-02-27", items: 3, total: 3897, status: "Shipped", payment: "Paid" },
    { id: "ORD-9009", customer: "Sneha Reddy", email: "sneha.r@example.com", date: "2026-02-27", items: 1, total: 1299, status: "Delivered", payment: "Paid" },
    { id: "ORD-9008", customer: "Vikram Singh", email: "vikram.s@example.com", date: "2026-02-26", items: 4, total: 5196, status: "Processing", payment: "Paid" },
    { id: "ORD-9007", customer: "Neha Gupta", email: "neha.g@example.com", date: "2026-02-25", items: 2, total: 2598, status: "Delivered", payment: "Paid" },
    { id: "ORD-9006", customer: "Arjun Desai", email: "arjun.d@example.com", date: "2026-02-25", items: 1, total: 1299, status: "Cancelled", payment: "Refunded" },
];

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered": return <CheckCircle className="w-4 h-4 mr-1 text-green-600" />;
            case "Processing": return <Package className="w-4 h-4 mr-1 text-blue-600" />;
            case "Shipped": return <Truck className="w-4 h-4 mr-1 text-purple-600" />;
            case "Pending": return <Clock className="w-4 h-4 mr-1 text-yellow-600" />;
            default: return null;
        }
    };

    const filteredOrders = MOCK_ORDERS.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-forest-green">Orders Management</h1>
                    <p className="text-gray-500 mt-1">View and manage all customer orders</p>
                </div>
                <button className="bg-forest-green text-white px-4 py-2 rounded font-medium hover:bg-forest-green/90 transition-colors">
                    Export CSV
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-honey-gold focus:ring-1 focus:ring-honey-gold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        className="border rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:border-honey-gold w-full md:w-auto tracking-wide text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium whitespace-nowrap">Order ID</th>
                                <th className="p-4 font-medium">Customer / Email</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium text-center">Items</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Total</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                        <td className="p-4 font-medium text-forest-green">{order.id}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-xs text-gray-500">{order.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                                        <td className="p-4 text-center text-gray-700">{order.items}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' : ''}
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-900">₹{order.total.toLocaleString('en-IN')}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 text-gray-400 hover:text-honey-gold hover:bg-honey-gold/10 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-gray-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination mock */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {filteredOrders.length} of {MOCK_ORDERS.length} entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border rounded bg-forest-green text-white">1</button>
                        <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
