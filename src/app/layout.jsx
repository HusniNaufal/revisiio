import './globals.css';

export const metadata = {
  title: 'revisi.io - Content Collaboration',
  description: 'Revisi.io Content Revision & Collaboration Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
