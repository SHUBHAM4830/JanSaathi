import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Calendar, 
  Search, 
  Filter,
  Eye,
  AlertCircle,
  Construction,
  Droplets,
  Zap,
  Wifi,
  Lightbulb,
  Trash2,
  Bell,
  Sun,
  Moon,
  LogOut
} from "lucide-react";

interface CommunityComplaint {
  id: string;
  title: string;
  category: string;
  location: string;
  status: "Pending" | "In Progress" | "Resolved";
  date: string;
  upvotes: number;
  distance: string; // Distance from current user
  userName: string; // Name of the user who submitted the complaint
  hasUpvoted?: boolean; // Track if current user has upvoted
}

interface Notification {
  message: string;
  time: string;
  read: boolean;
}

export default function CommunityComplaints() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      message: "New complaint in your area: Garbage collection issue",
      time: "2 hours ago",
      read: false,
    },
    {
      message: "Complaint #123 has been resolved",
      time: "1 day ago",
      read: false,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [communityComplaints, setCommunityComplaints] = useState<CommunityComplaint[]>([
    {
      id: "12345",
      title: "Pothole on Main Street",
      category: "Road Infrastructure",
      location: "Main Street, Sector 12, New Delhi",
      status: "In Progress",
      date: "Jan 15, 2024",
      upvotes: 24,
      distance: "1.2 km",
      userName: "Rajesh Kumar",
      hasUpvoted: false
    },
    {
      id: "CMP-102",
      title: "Street Light Not Working",
      category: "Street Lighting",
      location: "Main Road, New Delhi",
      status: "In Progress",
      date: "Jan 19, 2024",
      upvotes: 18,
      distance: "0.8 km",
      userName: "Priya Sharma",
      hasUpvoted: true
    },
    {
      id: "CMP-103",
      title: "Water Supply Issue",
      category: "Water Supply",
      location: "Green Park, New Delhi",
      status: "Resolved",
      date: "Jan 18, 2024",
      upvotes: 32,
      distance: "2.5 km",
      userName: "Amit Patel",
      hasUpvoted: false
    },
    {
      id: "CMP-104",
      title: "Broken Footpath Tiles",
      category: "Footpath Repair",
      location: "Park Street, New Delhi",
      status: "Pending",
      date: "Jan 17, 2024",
      upvotes: 15,
      distance: "1.7 km",
      userName: "Sneha Gupta",
      hasUpvoted: false
    },
    {
      id: "CMP-105",
      title: "Overflowing Drainage",
      category: "Drainage",
      location: "Sector 8, New Delhi",
      status: "In Progress",
      date: "Jan 16, 2024",
      upvotes: 28,
      distance: "0.5 km",
      userName: "Vikram Singh",
      hasUpvoted: false
    },
    {
      id: "CMP-106",
      title: "Missing Manhole Cover",
      category: "Road Safety",
      location: "Market Road, New Delhi",
      status: "Pending",
      date: "Jan 15, 2024",
      upvotes: 42,
      distance: "1.1 km",
      userName: "Anjali Mehta",
      hasUpvoted: false
    }
  ]);

  const categories = ["All", "Waste Management", "Street Lighting", "Water Supply", "Footpath Repair", "Drainage", "Road Safety"];

  useEffect(() => {
    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save dark mode preference
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };

  const filteredComplaints = communityComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || complaint.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Waste Management":
        return <Trash2 className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Street Lighting":
        return <Lightbulb className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Water Supply":
        return <Droplets className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Footpath Repair":
        return <Construction className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Drainage":
        return <Droplets className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Road Safety":
        return <AlertCircle className="w-5 h-5 text-jansaathi-royalBlue" />;
      default:
        return <AlertCircle className="w-5 h-5 text-jansaathi-royalBlue" />;
    }
  };

  const handleViewDetails = (id: string) => {
    // Navigate to the complaint details page
    navigate(`/complaints/${id}`);
  };

  const handleUpvote = (id: string) => {
    setCommunityComplaints(prevComplaints => 
      prevComplaints.map(complaint => {
        if (complaint.id === id) {
          // Toggle the upvote status
          const newHasUpvoted = !complaint.hasUpvoted;
          const upvoteChange = newHasUpvoted ? 1 : -1;
          
          return {
            ...complaint,
            upvotes: complaint.upvotes + upvoteChange,
            hasUpvoted: newHasUpvoted
          };
        }
        return complaint;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-jansaathi-darkSlate">
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
                      {notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => markAsRead(index)}
                        >
                          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
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
      <div className="relative z-10 flex-grow overflow-y-auto pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                Community Complaints
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                View complaints from other citizens in your area
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button
                onClick={() => navigate("/citizen")}
                variant="outline"
                className="mr-2"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-400 h-4 w-4" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Complaints</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{communityComplaints.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Construction className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {communityComplaints.filter(c => c.status === "In Progress").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Droplets className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {communityComplaints.filter(c => c.status === "Resolved").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Complaints List */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                Nearby Complaints
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          {getCategoryIcon(complaint.category)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange">
                              {complaint.title}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className={
                                complaint.status === "In Progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                                complaint.status === "Pending" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }
                            >
                              {complaint.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                            <span className="flex items-center">
                              <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                              {complaint.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                              {complaint.date}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                              {complaint.distance}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>Submitted by: {complaint.userName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 ml-4">
                        <div className="text-center">
                          <button
                            onClick={() => handleUpvote(complaint.id)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                              complaint.hasUpvoted 
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            <span>▲</span>
                            <span>{complaint.upvotes}</span>
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upvotes</p>
                        </div>
                        <Button
                          onClick={() => handleViewDetails(complaint.id)}
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 sm:px-6 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No complaints found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}