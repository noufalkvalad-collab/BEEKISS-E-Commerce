import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth/adminJwt";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("admin_access_token")?.value;

    if (!accessToken) {
        redirect("/admin/login");
    }

    const payload = await verifyAdminToken(accessToken);

    if (!payload || payload.role !== "admin") {
        redirect("/admin/login");
    }

    return (
        <main className="min-h-screen bg-[#0F2E1D] flex items-center justify-center p-6 relative overflow-hidden mt-[-80px]">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-gradient-to-r from-transparent to-white/5 blur-3xl transform rotate-12 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] rounded-full bg-gradient-to-l from-transparent to-[#D4A017]/10 blur-3xl transform -rotate-12 pointer-events-none"></div>

            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-w-md w-full text-center relative z-10 animate-[fadeInUp_0.8s_ease-out_forwards]">
                {/* Brand Logo Mini */}
                <div className="w-16 h-16 mx-auto relative mb-6">
                    <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm shadow-md" />
                    <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-2xl z-10">B</div>
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-2 tracking-wide">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500 mb-8 font-sans text-sm">
                    Secure management portal
                </p>

                <div className="bg-[#FDFDF9] border border-[#0F2E1D]/5 rounded-2xl p-5 mb-8 text-left shadow-inner">
                    <p className="text-xs text-gray-400 font-sans tracking-widest uppercase mb-1">Logged in as admin</p>
                    <p className="text-[#0F2E1D] font-bold font-sans truncate text-lg">{payload.email}</p>
                </div>

                <LogoutButton />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </main>
    );
}
