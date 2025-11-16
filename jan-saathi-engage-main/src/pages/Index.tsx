import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import LoadingScreen from "@/components/LoadingScreen";
import { Calendar, Info, MapPin, Search, Share, Settings, User, Users, AlertCircle, Clock, Brain } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setIsLoading(false);
    document.body.style.overflow = "";
  };

  // Prevent scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      
      <NavBar />
      
      <main className={`flex-grow ${isLoading ? 'hidden' : 'block'}`}>
        <Hero />
        
        {/* Services Section */}
        <section id="services" className="py-20 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-jansaathi-slateGray dark:text-jansaathi-lightGray/90 max-w-2xl mx-auto">
                Empowering citizens with accessible civic tools and resources designed to make government 
                services more transparent and user-friendly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={AlertCircle}
                title="Civic Issue Reporting"
                description="Easily report problems like potholes, broken roads, waterlogging, and live wires. Upload a photo, auto-tag the location with Google Maps, and let JanSaathi streamline your civic complaints instantly."
              />
              <FeatureCard 
                icon={Clock}
                title="Real-Time Complaint Tracking"
                description="Stay informed with live status updates for your submitted complaints. From Pending → In Progress → Resolved, track every step and receive admin remarks for full transparency."
              />
              <FeatureCard 
                icon={Brain}
                title="AI-Powered Categorization"
                description="JanSaathi automatically detects and classifies issues using AI image and text analysis—ensuring faster sorting and resolution. Priority tagging is applied for critical issues like open wires."
              />
              <FeatureCard 
                icon={Users}
                title="Community Engagement"
                description="Engage your neighborhood by upvoting important complaints, sharing QR codes for issue tracking, and helping crowd-prioritize local problems. Empower communities with collective voice and action."
              />
            </div>
          </div>
        </section>
        
        {/* Initiatives Section */}
        <section id="initiatives" className="py-20 px-4 md:px-6 bg-secondary/50 dark:bg-jansaathi-darkSlate/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Initiatives</h2>
              <p className="text-jansaathi-slateGray dark:text-jansaathi-lightGray/90 max-w-2xl mx-auto">
                Our flagship programs designed to foster civic engagement and strengthen communities across the nation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 md:p-8 transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-jansaathi-emeraldGreen/20 to-jansaathi-emeraldGreen/10">
                  <MapPin className="h-6 w-6 text-jansaathi-emeraldGreen" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Urban Issue Resolution Platform</h3>
                <p className="text-jansaathi-slateGray/80 dark:text-jansaathi-lightGray/80 mb-6 flex-grow">
                  Partnering with local governments to implement a centralized civic issue reporting system powered by AI, geolocation, and real-time tracking to enhance urban infrastructure and governance.
                </p>
                <button className="mt-auto text-jansaathi-emeraldGreen dark:text-jansaathi-emeraldGreen font-medium flex items-center">
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
              
              <div className="glass-card p-6 md:p-8 transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-jansaathi-royalBlue/20 to-jansaathi-royalBlue/10">
                  <Users className="h-6 w-6 text-jansaathi-royalBlue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Citizen-Government Collaboration</h3>
                <p className="text-jansaathi-slateGray/80 dark:text-jansaathi-lightGray/80 mb-6 flex-grow">
                  Building digital forums where citizens and officials can engage in transparent decision-making, with live complaint updates, community upvoting, and comment-based dialogue for better accountability.
                </p>
                <button className="mt-auto text-jansaathi-royalBlue dark:text-jansaathi-royalBlue font-medium flex items-center">
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
              
              <div className="glass-card p-6 md:p-8 transition-all duration-300 hover:shadow-xl flex flex-col">
                <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-jansaathi-saffronOrange/20 to-jansaathi-saffronOrange/10">
                  <Brain className="h-6 w-6 text-jansaathi-saffronOrange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Civic Tech & AI Tools</h3>
                <p className="text-jansaathi-slateGray/80 dark:text-jansaathi-lightGray/80 mb-6 flex-grow">
                  Leveraging AI for automatic issue categorization, severity detection, and QR-code-based tracking. Future enhancements include voice input, multilingual support, and IoT-based auto-reporting sensors.
                </p>
                <button className="mt-auto text-jansaathi-saffronOrange dark:text-jansaathi-saffronOrange font-medium flex items-center">
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="contact" className="py-20 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="glass-card p-8 md:p-12 max-w-5xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the JanSaathi Movement</h2>
                <p className="text-jansaathi-slateGray/90 dark:text-jansaathi-lightGray/90 mb-8 max-w-2xl mx-auto">
                  Together, we can build stronger communities and more responsive governance. 
                  Sign up today to get involved and make your voice heard.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full md:w-auto md:flex-1 max-w-sm px-4 py-3 rounded-full border border-border bg-background/70 dark:bg-jansaathi-darkSlate/40 focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue"
                  />
                  <button className="btn-primary px-8">
                    Keep Me Updated
                  </button>
                </div>
                
                <p className="text-sm text-jansaathi-slateGray/70 dark:text-jansaathi-lightGray/70 mt-4">
                  We respect your privacy. Your information will never be shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
