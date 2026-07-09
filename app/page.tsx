import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import ImageTrail from "@/components/hero/ImageTrail";
import WorkSection from "@/components/work/WorkSection";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";

export default function Home() {
  return (
    <ScrollProvider>

      <Cursor />
      {/*<ImageTrail />*/}

      <Navbar />
      <Hero />
      <workSection />

    </ScrollProvider>
  );
}