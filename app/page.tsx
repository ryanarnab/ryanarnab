import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import Preloader from "@/components/ui/Preloader";
import WorkSection from "@/components/work/DiscoverySection";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import AboutSection from "@/components/about/AboutSection";
import PlaygroundSection from "@/components/playground/PlaygroundSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <ScrollProvider>
      <Preloader />
      <Cursor />

      <Navbar />
      <Hero />
      <WorkSection />

      <div className="h-[25vh] sm:h-[40vh]" />
      <AboutSection />
      <PlaygroundSection />
      <ContactSection />
    </ScrollProvider>
  );
}