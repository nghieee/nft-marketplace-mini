// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "NFT Marketplace Mini",
  description: "A modern NFT marketplace powered by Next.js, Wagmi & RainbowKit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className, 
        spaceGrotesk.variable,
        "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 min-h-screen"
      )}>
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-purple-500/5 via-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
        </div>

        <div className="relative flex min-h-screen flex-col">
          {/* Header */}
          <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5"></div>
            <div className="relative container mx-auto flex h-20 items-center justify-between px-6">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-sm opacity-90"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-space-grotesk">
                  NFT Market
                </h1>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link 
                  href="/" 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 group px-4 py-2"
                >
                  <span className="relative z-10">Home</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </Link>
                <Link 
                  href="/marketplace" 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 group px-4 py-2"
                >
                  <span className="relative z-10">Marketplace</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </Link>
                <Link 
                  href="/profile" 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 group px-4 py-2"
                >
                  <span className="relative z-10">Profile</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </Link>
              </nav>

              {/* Wallet Connect Button */}
              <button className="relative group overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connect Wallet</span>
                </span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative flex-1 container mx-auto px-6 py-12">
            <div className="relative">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>
            <div className="relative container mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} NFT Marketplace Mini
                  </div>
                  <div className="hidden md:block w-px h-4 bg-gray-600"></div>
                  <div className="text-sm text-gray-500">
                    Built with Next.js & Wagmi
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017-.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
