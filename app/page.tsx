import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import WorkSection from "@/components/work/DiscoverySection";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import AboutSection from "@/components/about/AboutSection";
import PlaygroundSection from "@/components/playground/PlaygroundSection";
import ContactSection from "@/components/contact/ContactSection";
import OrbitalSidebar from "@/components/navigation/OrbitalSidebar";
import BackgroundParticles from "@/components/hero/BackgroundParticles";

export default function Home() {
  return (
    <ScrollProvider>
      <Cursor />
      <BackgroundParticles />
      <OrbitalSidebar />

      <Navbar />
      <Hero />
      <WorkSection />
      <AboutSection />
      <PlaygroundSection />
      <ContactSection />
    </ScrollProvider>
  );
}