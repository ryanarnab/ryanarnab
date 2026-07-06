import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import ImageTrail from "@/components/hero/ImageTrail";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Cursor />
      <ImageTrail />
      <Navbar />
      <Hero />
    </main>
  );
}