import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth/adminJwt";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { Activity, IndianRupee, ShoppingBag, Users as UsersIcon } from "lucide-react";

async function getDashboardStats() {
    await dbConnect();

    // Run all aggregations in parallel for maximum speed
    const [totalProducts, totalUsers, totalOrders, revenueData] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: { $ne: "admin" } }),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ])
    ]);

    return {
        products: totalProducts,
        users: totalUsers,
        orders: totalOrders,
        revenue: revenueData.length > 0 ? revenueData[0].total : 0,
    };
}

export default async function AdminOverviewPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("admin_access_token")?.value;

    if (!accessToken) {
        redirect("/admin/login");
    }

    const payload = await verifyAdminToken(accessToken);

    if (!payload || payload.role !== "admin") {
        redirect("/admin/login");
    }

    const stats = await getDashboardStats();

    const statCards = [
        { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, trend: "+12.5%", color: "text-green-600", bg: "bg-green-100" },
        { title: "Total Orders", value: stats.orders.toLocaleString(), icon: ShoppingBag, trend: "+5.2%", color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Active Products", value: stats.products.toLocaleString(), icon: Activity, trend: "0%", color: "text-[#D4A017]", bg: "bg-honey-gold/20" },
        { title: "Registered Users", value: stats.users.toLocaleString(), icon: UsersIcon, trend: "+18.2%", color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="max-w-7xl mx-auto animation-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1 font-sans">Welcome back, {payload.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? "text-green-700 bg-green-50" : "text-gray-600 bg-gray-50"
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-gray-500 font-sans text-sm font-medium mb-1">{stat.title}</h3>
                            <div className="text-2xl font-bold text-[#0F2E1D]">{stat.value}</div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center py-20">
                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F2E1D] mb-2 font-serif">Awaiting Recent Activity Flow</h3>
                <p className="text-gray-500 max-w-sm mx-auto">The analytics chart and recent orders list will populate here as store data begins accumulating.</p>
            </div>
        </div>
    );
}
