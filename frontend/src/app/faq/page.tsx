import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import HeroSection from "@/components/ui/layout/HeroSection";
import FeaturesStrip from "@/components/ui/layout/FeatureStrip";
import ToolsGrid from "@/components/ui/layout/ToolsGrid";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#09090b" }}>
      <Navbar />
      <HeroSection />
      <FeaturesStrip />
      <ToolsGrid />
      <Footer />
    </main>
  );
}
