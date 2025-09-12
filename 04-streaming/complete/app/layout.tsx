import './globals.css';

export const metadata = {
  title: 'DevMate - AI Workshop',
  description: 'Building AI-powered developer tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}