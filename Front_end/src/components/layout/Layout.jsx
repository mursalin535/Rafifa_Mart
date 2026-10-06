import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative pt-20 md:pt-24">
        {children}
      </main>
    </div>
  );
}
