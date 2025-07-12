import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "StackIt - Q&A Forum",
  description: "A community-driven Q&A platform for developers and tech enthusiasts",
  icons : {
    icon: "/StackIt_Icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedDarkMode = localStorage.getItem('darkMode');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = savedDarkMode === 'true' || (savedDarkMode === null && prefersDark);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <ClerkProvider>
        <body className="h-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </body>
      </ClerkProvider>
    </html>
  );
}
