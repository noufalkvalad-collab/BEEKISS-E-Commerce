"use client";

import { TrendingUp, Package, IndianRupee, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

// Mock Data
const stats = [
    { label: "Total Revenue", value: "₹1,24,500", icon: IndianRupee, trend: "+12.5%" },
    { label: "Total Orders", value: "342", icon: Package, trend: "+5.2%" },
    { label: "Pending Orders", value: "18", icon: Clock, trend: "-2.1%" },
    { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, trend: "+0.8%" },
];

const recentOrders = [
    { id: "ORD-9012", customer: "Rahul Sharma", date: "Today, 10:23 AM", amount: 2598, status: "Processing" },
    { id: "ORD-9011", customer: "Priya Patel", date: "Today, 09:15 AM", amount: 1299, status: "Pending" },
    { id: "ORD-9010", customer: "Amit Kumar", date: "Yesterday, 04:45 PM", amount: 3897, status: "Shipped" },
    { id: "ORD-9009", customer: "Sneha Reddy", date: "Yesterday, 02:30 PM", amount: 1299, status: "Delivered" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back. Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-honey-gold/10 text-honey-gold rounded-lg">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-serif font-bold text-gray-900">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm font-medium text-honey-gold hover:text-forest-green flex items-center transition-colors">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm">
                                <th className="p-4 font-medium border-b border-gray-100">Order ID</th>
                                <th className="p-4 font-medium border-b border-gray-100">Customer</th>
                                <th className="p-4 font-medium border-b border-gray-100">Date</th>
                                <th className="p-4 font-medium border-b border-gray-100">Amount</th>
                                <th className="p-4 font-medium border-b border-gray-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentOrders.map((order, i) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <td className="p-4 font-medium text-forest-green">{order.id}</td>
                                    <td className="p-4 text-gray-700">{order.customer}</td>
                                    <td className="p-4 text-gray-500">{order.date}</td>
                                    <td className="p-4 font-medium text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : ''}
                      ${order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' : ''}
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
