import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import ImageTrail from "@/components/hero/ImageTrail";
import WorkSection from "@/components/work/WorkSection";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import AboutSection from "@/components/about/AboutSection";
import PlaygroundSection from "@/components/playground/PlaygroundSection";

export default function Home() {
  return (
    <ScrollProvider>

      <Cursor />
      {/*<ImageTrail />*/}

      <Navbar />
      <div className="relative">
        <Hero />

      <div className="relative z-20">
        <WorkSection />
      </div>
      </div>

      <AboutSection />
      <PlaygroundSection />

    </ScrollProvider>
  );
}