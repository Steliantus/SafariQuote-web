import "./globals.css";

export const metadata = {
  title: "SafariQuote",
  description: "Live, multi-tenant quote builder for Ondjamba Safaris and its tour-operator partners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 font-sans">{children}</body>
    </html>
  );
}
