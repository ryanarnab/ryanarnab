import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import ImageTrail from "@/components/hero/ImageTrail";
import WorkSection from "@/components/work/DiscoverySection";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import AboutSection from "@/components/about/AboutSection";
import PlaygroundSection from "@/components/playground/PlaygroundSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <ScrollProvider>

      <Cursor />
      {/*<ImageTrail />*/}

      <Navbar />
      <Hero />
      <WorkSection />

      <div className="h-[40vh]" />
      <AboutSection />
      <PlaygroundSection />
      <ContactSection />
      
    </ScrollProvider>
  );
}