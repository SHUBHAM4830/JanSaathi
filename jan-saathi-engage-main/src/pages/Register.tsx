import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import { Users, ShieldCheck, Building } from "lucide-react";

export default function Register() {
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // Here you would typically make an API call to register
    // For now, we'll just handle the redirection based on role
    
    if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "contractor") {
      navigate("/contractor-dashboard");
    } else {
      navigate("/citizen");
    }
  };

  const roles = [
    { id: "citizen", name: "Citizen", description: "Access public services and report issues", icon: Users },
    { id: "admin", name: "Administrator", description: "Manage and oversee platform operations", icon: ShieldCheck },
    { id: "contractor", name: "Contractor", description: "Handle service requests and maintenance", icon: Building },
  ];

  return (
    <section className="fixed inset-0 overflow-hidden flex flex-col">
      <NavBar />
      
      {/* Background Elements - City Silhouette with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, 
              rgba(255,255,255,0.9) 0%, 
              rgba(255,255,255,0.7) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231E3A8A' fill-opacity='0.1' d='M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")
          `
        }}
      >
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-jansaathi-darkSlate/95 dark:to-jansaathi-darkSlate/90 transition-all duration-300"></div>
      </div>

      {/* City Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-32 md:h-48 z-[1] overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-auto"
          style={{ transform: "translateZ(0)" }}
        >
          <path
            fill="currentColor"
            fillOpacity="0.1"
            d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,208C672,224,768,256,864,261.3C960,267,1056,245,1152,208C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="transition-colors duration-300 text-jansaathi-royalBlue dark:text-jansaathi-royalBlue"
          ></path>
        </svg>
      </div>

      {/* Main content container below navbar */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="max-w-3xl w-full space-y-4 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl my-16">
          <div className={cn(
            "text-center space-y-4",
            isVisible ? "animate-fade-in" : "opacity-0"
          )}>
            <div className="flex justify-center">
              <img 
                src="/logo.png" 
                alt="JanSaathi Logo" 
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create Your Account
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Join JanSaathi to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Selector Cards */}
            <div className="space-y-2 flex flex-col justify-center">
              {roles.map((role, index) => (
                <div
                  key={role.id}
                  className={cn(
                    "flex items-center p-2.5 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] relative",
                    selectedRole === role.id
                      ? "border-jansaathi-royalBlue dark:border-jansaathi-saffronOrange bg-gradient-to-r from-blue-100/50 dark:from-blue-900/50 to-purple-100/50 dark:to-purple-900/50 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:border-jansaathi-royalBlue/50 hover:shadow-sm",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                    `animation-delay-${index * 100}` // Staggered animation delay
                  )}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className={cn("p-1.5 rounded-full", 
                       selectedRole === role.id ? "bg-white dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-700/50")}>
                     <role.icon className={cn("w-4 h-4", selectedRole === role.id ? "text-jansaathi-saffronOrange dark:text-jansaathi-saffronOrange" : "text-gray-500 dark:text-gray-400")}/>
                  </div>
                  
                  <div className="ml-3 text-left flex-grow">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{role.description}</p>
                  </div>
                  
                  {selectedRole === role.id && (
                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-jansaathi-royalBlue dark:bg-jansaathi-saffronOrange rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            <form className="space-y-3 flex flex-col justify-center" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-2">
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <div className="flex items-center text-xs pt-1">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="h-3 w-3 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange border-gray-300 dark:border-gray-700 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-gray-900 dark:text-gray-300">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:text-jansaathi-royalBlue/80 dark:hover:text-jansaathi-saffronOrange/80">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:text-jansaathi-royalBlue/80 dark:hover:text-jansaathi-saffronOrange/80">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="text-center text-sm mt-3">
                <Button
                  type="submit"
                  className="w-full flex justify-center py-1.5 px-4 text-sm border border-transparent rounded-lg text-white bg-jansaathi-royalBlue dark:bg-jansaathi-saffronOrange hover:bg-jansaathi-royalBlue/90 dark:hover:bg-jansaathi-saffronOrange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:text-jansaathi-royalBlue/80 dark:hover:text-jansaathi-saffronOrange/80">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating shapes - visual flair */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-jansaathi-royalBlue/10 dark:bg-jansaathi-royalBlue/5 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70"></div>
      <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-jansaathi-saffronOrange/10 dark:bg-jansaathi-saffronOrange/5 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-1000 opacity-70"></div>
    </section>
  );
} 