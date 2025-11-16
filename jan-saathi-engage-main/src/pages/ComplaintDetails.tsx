import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  QrCode,
  AlertCircle,
  Building2,
  Calendar,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  LogOut,
  Download,
  FileDown
} from "lucide-react";

interface Update {
  id: string;
  type: "admin" | "contractor";
  message: string;
  date: string;
}

interface TimelineEvent {
  id: string;
  status: "completed" | "in-progress" | "pending";
  title: string;
  date: string;
  icon: React.ReactNode;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Define the complaint interface to match the data structure
interface Complaint {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  priority: string;
  category: string;
  location: string;
  date: string;
  timestamp: number;
  points?: number;
  // Add image property if needed
  image?: string;
}

export default function ComplaintDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Issue Reported",
      message: "A new road issue has been reported in Sector 5",
      time: "5 minutes ago",
      read: false
    },
    {
      id: "2",
      title: "Issue Resolved",
      message: "Water supply issue in Green Park Colony has been resolved",
      time: "1 hour ago",
      read: false
    },
    {
      id: "3",
      title: "System Update",
      message: "System maintenance scheduled for tomorrow at 2 AM",
      time: "2 hours ago",
      read: true
    }
  ]);
  
  // State for the actual complaint data
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Sample updates - in a real app, this would come from an API
  const updates: Update[] = [
    {
      id: "1",
      type: "admin",
      message: "Complaint has been reviewed and assigned to the maintenance team. Work is scheduled to begin within 48 hours.",
      date: "Jan 16, 2024"
    },
    {
      id: "2",
      type: "contractor",
      message: "Materials have been ordered and work will begin tomorrow morning. Expected completion time is 2 days.",
      date: "Jan 17, 2024"
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      status: "completed",
      title: "Complaint submitted",
      date: "Jan 15, 2024",
      icon: <CheckCircle2 className="h-4 w-4 text-white" />
    },
    {
      id: "2",
      status: "in-progress",
      title: "Under review",
      date: "Jan 16, 2024",
      icon: <Clock className="h-4 w-4 text-white" />
    },
    {
      id: "3",
      status: "pending",
      title: "Resolution in progress",
      date: "Jan 17, 2024",
      icon: <CheckCircle2 className="h-4 w-4 text-white" />
    }
  ];

  const complaintRef = useRef<HTMLDivElement>(null);

  // Fetch complaint data based on ID
  useEffect(() => {
    const fetchComplaint = () => {
      try {
        // Get complaints from localStorage
        const savedComplaints = localStorage.getItem('complaints');
        if (savedComplaints) {
          const complaints: Complaint[] = JSON.parse(savedComplaints);
          // Find the complaint with matching ID
          const foundComplaint = complaints.find(c => c.id === id);
          if (foundComplaint) {
            setComplaint(foundComplaint);
          } else {
            // If not found, use a default complaint
            setComplaint({
              id: id || "Unknown",
              title: "Complaint Not Found",
              description: "The requested complaint could not be found.",
              status: "Pending",
              priority: "Medium",
              category: "General",
              location: "Unknown Location",
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              timestamp: Date.now()
            });
          }
        } else {
          // If no complaints in localStorage, use a default complaint
          setComplaint({
            id: id || "Unknown",
            title: "Complaint Not Found",
            description: "No complaints data found.",
            status: "Pending",
            priority: "Medium",
            category: "General",
            location: "Unknown Location",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.error("Error fetching complaint:", error);
        // Fallback to default complaint on error
        setComplaint({
          id: id || "Unknown",
          title: "Error Loading Complaint",
          description: "An error occurred while loading the complaint details.",
          status: "Pending",
          priority: "Medium",
          category: "General",
          location: "Unknown Location",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: Date.now()
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaint();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };

  const handleDownloadPDF = async () => {
    if (!complaintRef.current || !complaint) return;

    try {
      // Find and hide the download button
      const downloadButton = document.querySelector('[data-pdf-exclude="true"]');
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = 'none';
      }

      // Create PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Add header with white background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 40, 'F');
      
      // Add JanSaathi text in dark gray
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text("JanSaathi", 20, 25);
      
      // Add subtitle
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text("Complaint Management System", 20, 35);

      // Reset text color for content
      pdf.setTextColor(51, 51, 51);

      // Add report title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Complaint Details Report", 20, 55);

      // Add metadata section
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(102, 102, 102);
      
      const metadata = [
        { label: "Complaint ID", value: complaint.id },
        { label: "Status", value: complaint.status },
        { label: "Priority", value: complaint.priority },
        { label: "Category", value: complaint.category },
        { label: "Generated On", value: new Date().toLocaleDateString() }
      ];

      let yPos = 65;
      metadata.forEach(item => {
        pdf.text(`${item.label}:`, 20, yPos);
        pdf.setTextColor(51, 51, 51);
        pdf.text(item.value, 60, yPos);
        pdf.setTextColor(102, 102, 102);
        yPos += 7;
      });

      // Add a subtle separator
      pdf.setDrawColor(204, 204, 204);
      pdf.line(20, yPos + 5, 190, yPos + 5);

      // Capture the main content
      const canvas = await html2canvas(complaintRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff"
      });

      // Show the download button again
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = '';
      }

      const imgData = canvas.toDataURL("image/png");
      
      // Calculate dimensions to fit on A4 while maintaining aspect ratio
      const imgWidth = 170; // A4 width - margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the main content with a subtle border
      pdf.setDrawColor(204, 204, 204);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(18, yPos + 10, 174, imgHeight + 4, 2, 2, 'FD');
      pdf.addImage(imgData, "PNG", 20, yPos + 12, imgWidth, imgHeight);

      // Add a subtle border around the entire page
      pdf.setDrawColor(204, 204, 204);
      pdf.rect(5, 5, 200, 287);

      // Save the PDF
      pdf.save(`complaint-${complaint.id}-details.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Make sure to show the button again even if there's an error
      const downloadButton = document.querySelector('[data-pdf-exclude="true"]');
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = '';
      }
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-jansaathi-darkSlate flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jansaathi-royalBlue mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaint details...</p>
        </div>
      </section>
    );
  }

  if (!complaint) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-jansaathi-darkSlate flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Complaint Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The requested complaint could not be found.</p>
          <Button 
            onClick={() => navigate("/citizen")}
            className="mt-6 bg-jansaathi-royalBlue hover:bg-jansaathi-royalBlue/90 text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-jansaathi-darkSlate">
      {/* Custom Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 dark:bg-jansaathi-darkSlate/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="JanSaathi Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange bg-clip-text text-transparent">
                JanSaathi
              </span>
            </a>
          </div>

          {/* Right side - Dark mode toggle and notifications */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none relative"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-jansaathi-royalBlue text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg" ref={complaintRef}>
          {/* Header */}
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Complaint #{complaint.id}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {complaint.title}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={cn(
                  "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                  complaint.status === "In Progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                  complaint.status === "Pending" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                )}>
                  {complaint.status}
                </span>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="flex items-center space-x-2 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:bg-gray-100 dark:hover:bg-gray-700"
                  data-pdf-exclude="true"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Download Report</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div>
                  {/* Image */}
                  <div className="mb-6">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  </div>

                  {/* Location Map */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Location</h4>
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <MapPin className="h-12 w-12" />
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Complaint QR Code</h4>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <QRCodeSVG
                          id="qr-code"
                          value={`${window.location.origin}/complaints/${complaint.id}`}
                          size={128}
                          level="H"
                          includeMargin={true}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Status Timeline */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Status Timeline</h4>
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {timelineEvents.map((event, index) => (
                          <li key={event.id}>
                            <div className="relative pb-8">
                              {index !== timelineEvents.length - 1 && (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600" aria-hidden="true"></span>
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800",
                                    event.status === "completed" && "bg-green-500",
                                    event.status === "in-progress" && "bg-yellow-500",
                                    event.status === "pending" && "bg-gray-400"
                                  )}>
                                    {event.icon}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.title}</p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    <time dateTime={event.date}>{event.date}</time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Details</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {complaint.priority || "Not specified"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {complaint.category || "Not specified"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {complaint.description || "No description provided"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {complaint.location || "Not specified"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {complaint.date || "Not specified"}
                        </dd>
                      </div>
                      {complaint.points && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Points</dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            {complaint.points}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Updates */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Updates</h4>
                    <div className="space-y-4">
                      {updates.map((update) => (
                        <div key={update.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {update.type === "admin" ? "Admin Update" : "Contractor Update"}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{update.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {update.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}