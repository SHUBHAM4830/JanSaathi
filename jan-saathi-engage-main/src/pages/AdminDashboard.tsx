import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  Sun, 
  Moon, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Users, 
  Building2, 
  Wrench, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  X,
  Eye,
  Gavel,
  IndianRupee
} from "lucide-react";
import Chart from "chart.js/auto";
import Footer from "@/components/Footer";

// Types
interface Issue {
  id: string;
  category: string;
  description: string;
  location: string;
  status: "Pending" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
  date: string;
  timestamp: number;
}

interface Stat {
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: any;
  color: string;
  bgColor: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [selectedArea, setSelectedArea] = useState("all");
  const [showCreateBidModal, setShowCreateBidModal] = useState(false);
  const [newBid, setNewBid] = useState({
    category: "",
    description: "",
    location: "",
    deadline: ""
  });
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "ISS-001",
      category: "Potholes",
      description: "Large pothole on Main Street causing traffic disruption",
      location: "Main Street, Sector 5",
      status: "In Progress",
      priority: "High",
      date: "2 hours ago",
      timestamp: Date.now() - 7200000 // 2 hours ago
    },
    {
      id: "ISS-002",
      category: "Waterlogging",
      description: "Severe water accumulation in residential area after heavy rain",
      location: "Green Park Colony",
      status: "Pending",
      priority: "Medium",
      date: "4 hours ago",
      timestamp: Date.now() - 14400000 // 4 hours ago
    },
    {
      id: "ISS-003",
      category: "Live Wires",
      description: "Exposed electrical wires hanging dangerously low",
      location: "Sunset Heights",
      status: "Resolved",
      priority: "High",
      date: "1 day ago",
      timestamp: Date.now() - 86400000 // 1 day ago
    },
    {
      id: "ISS-004",
      category: "Broken Roads",
      description: "Major road damage causing traffic congestion",
      location: "Green Valley",
      status: "Pending",
      priority: "Medium",
      date: "2 days ago",
      timestamp: Date.now() - 172800000 // 2 days ago
    }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Get notifications from localStorage or use default notifications
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    
    // Default notifications if none are saved
    return [
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
    ];
  });

  const navigate = useNavigate();
  const itemsPerPage = 2;

  // Calculate statistics
  const stats = useMemo<Stat[]>(() => {
    const totalIssues = issues.length;
    const activeIssues = issues.filter(issue => issue.status === "Pending").length;
    const inProgressIssues = issues.filter(issue => issue.status === "In Progress").length;
    const resolvedIssues = issues.filter(issue => issue.status === "Resolved").length;

    // Calculate changes (mock data for now)
    const changes = {
      total: 12,
      active: -5,
      inProgress: 8,
      resolved: 15
    };

    return [
      { 
        title: "Total Issues", 
        value: totalIssues, 
        change: changes.total,
        trend: changes.total > 0 ? "up" : "down",
        icon: AlertCircle, 
        color: "text-jansaathi-royalBlue dark:text-jansaathi-royalBlue",
        bgColor: "bg-blue-50 dark:bg-blue-900/20"
      },
      { 
        title: "Active Issues", 
        value: activeIssues, 
        change: changes.active,
        trend: changes.active > 0 ? "up" : "down",
        icon: Clock, 
        color: "text-jansaathi-saffronOrange dark:text-jansaathi-saffronOrange",
        bgColor: "bg-orange-50 dark:bg-orange-900/20"
      },
      { 
        title: "In Progress", 
        value: inProgressIssues, 
        change: changes.inProgress,
        trend: changes.inProgress > 0 ? "up" : "down",
        icon: Wrench, 
        color: "text-green-500 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20"
      },
      { 
        title: "Resolved", 
        value: resolvedIssues, 
        change: changes.resolved,
        trend: changes.resolved > 0 ? "up" : "down",
        icon: CheckCircle2, 
        color: "text-purple-500 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-900/20"
      }
    ];
  }, [issues]);

  // Function to count bids for an issue
  const countBidsForIssue = (issueId: string) => {
    const savedBids = localStorage.getItem('contractorBids');
    if (savedBids) {
      const allBids: any[] = JSON.parse(savedBids);
      return allBids.filter(bid => bid.projectId === issueId).length;
    }
    return 0;
  };

  // Filter issues based on search, category, and status
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [issues, searchQuery, selectedCategory, selectedStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIssues.slice(start, start + itemsPerPage);
  }, [filteredIssues, currentPage]);

  // Chart data
  const chartData = useMemo(() => {
    const categoryData = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timelineData = {
      reported: [65, 59, 80, 81, 56, 55],
      resolved: [28, 48, 40, 19, 86, 27]
    };

    return { categoryData, timelineData };
  }, [issues]);

  useEffect(() => {
    // Initialize charts
    const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;
    const timelineCtx = document.getElementById('timelineChart') as HTMLCanvasElement;

    if (categoryCtx) {
      const ctx = categoryCtx.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(chartData.categoryData),
            datasets: [{
              data: Object.values(chartData.categoryData),
              backgroundColor: [
                '#1E3A8A', // royalBlue
                '#F97316', // saffronOrange
                '#10B981', // green
                '#8B5CF6', // purple
                '#6B7280'  // gray
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              }
            },
            cutout: '70%'
          }
        });
      }
    }

    if (timelineCtx) {
      const ctx = timelineCtx.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Issues Reported',
                data: chartData.timelineData.reported,
                borderColor: '#1E3A8A',
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Issues Resolved',
                data: chartData.timelineData.resolved,
                borderColor: '#F97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }
  }, [chartData]);

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

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    // Save to localStorage
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminNotifications') {
        const savedNotifications = localStorage.getItem('adminNotifications');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update notifications from localStorage periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const savedNotifications = localStorage.getItem('adminNotifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    }, 1000); // Check every 1 second for faster updates
    
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = (issueId: string) => {
    // Navigate to complaint details page
    navigate(`/complaints/${issueId}`);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };

  // Function to handle creating a new bid
  const handleCreateBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing open bids from localStorage or initialize empty array
    const existingBids = JSON.parse(localStorage.getItem('openBids') || '[]');
    
    // Create new bid object
    const bid = {
      id: `BID-${Date.now()}`,
      category: newBid.category,
      description: newBid.description,
      location: newBid.location,
      deadline: newBid.deadline
    };
    
    // Add new bid to existing bids
    const updatedBids = [...existingBids, bid];
    
    // Save to localStorage
    localStorage.setItem('openBids', JSON.stringify(updatedBids));
    
    // Reset form and close modal
    setNewBid({
      category: "",
      description: "",
      location: "",
      deadline: ""
    });
    setShowCreateBidModal(false);
    
    // Send notification to contractors
    const contractorNotifications = JSON.parse(localStorage.getItem('contractorNotifications') || '[]');
    const notification = {
      id: `NOTIF-${Date.now()}`,
      title: "New Bid Available",
      message: `A new ${bid.category} project is available for bidding: ${bid.description}`,
      time: new Date().toLocaleString(),
      read: false
    };
    contractorNotifications.push(notification);
    localStorage.setItem('contractorNotifications', JSON.stringify(contractorNotifications));
    
    // Dispatch storage event to trigger immediate update in other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'contractorNotifications',
      newValue: JSON.stringify(contractorNotifications)
    }));
  };

  // Function to handle input changes for new bid form
  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBid(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to get open bids from localStorage
  const getOpenBids = () => {
    return JSON.parse(localStorage.getItem('openBids') || '[]');
  };

  // Categories for bid creation
  const bidCategories = [
    "Broken Roads",
    "Live Wires",
    "Potholes",
    "Waterlogging"
  ];

  const categories = ["all", "Broken Roads", "Live Wires", "Potholes", "Waterlogging"];
  const statuses = ["all", "Pending", "In Progress", "Resolved"];
  const areas = ["all", "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5"];

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
      <div className="relative z-10 flex-grow overflow-y-auto pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, Administrator
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Here's an overview of the platform's current status
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateBidModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Gavel className="h-4 w-4" />
                <span>Create New Bid</span>
              </button>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {areas.map(area => (
                  <option key={area} value={area}>
                    {area === "all" ? "All Areas" : area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 transition-all duration-300",
                  "hover:shadow-lg transform hover:-translate-y-1",
                  "border border-gray-100 dark:border-gray-700"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.change > 0 ? "+" : ""}{stat.change}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Issues by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Issue Distribution
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange"
                  onClick={() => navigate('/admin/analytics/categories')}
                >
                  View Details
                </Button>
              </div>
              <div className="h-80">
                <canvas id="categoryChart"></canvas>
              </div>
            </div>

            {/* Resolution Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Monthly Trends
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange"
                  onClick={() => navigate('/admin/analytics/trends')}
                >
                  View Details
                </Button>
              </div>
              <div className="h-80">
                <canvas id="timelineChart"></canvas>
              </div>
            </div>
          </div>

          {/* Recent Issues Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Issues
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Latest reported issues and their status
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Status" : status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bids
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {issue.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {issue.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {issue.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {issue.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            issue.status === "In Progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                            issue.status === "Pending" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          )}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            issue.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                            issue.priority === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          )}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {issue.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{countBidsForIssue(issue.id)}</span>
                          {countBidsForIssue(issue.id) > 0 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                              bid{countBidsForIssue(issue.id) > 1 ? 's' : ''}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => handleViewDetails(issue.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => navigate(`/admin/bids/${issue.id}`)}
                            >
                              <Wrench className="h-4 w-4" />
                              <span>Manage Bids</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => navigate(`/admin/issue-bidding/${issue.id}`)}
                            >
                              <IndianRupee className="h-4 w-4" />
                              <span>Create Bid</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredIssues.length)}</span> of{" "}
                    <span className="font-medium">{filteredIssues.length}</span> results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating shapes - visual flair */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-jansaathi-royalBlue/10 dark:bg-jansaathi-royalBlue/5 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70"></div>
      <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-jansaathi-saffronOrange/10 dark:bg-jansaathi-saffronOrange/5 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-1000 opacity-70"></div>
      
      {/* Create Bid Modal */}
      {showCreateBidModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Create New Bid
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4" onSubmit={handleCreateBid}>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={newBid.category}
                            onChange={handleBidInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          >
                            <option value="">Select a category</option>
                            {bidCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={newBid.description}
                            onChange={handleBidInputChange}
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          ></textarea>
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={newBid.location}
                            onChange={handleBidInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deadline
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            id="deadline"
                            value={newBid.deadline}
                            onChange={handleBidInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-jansaathi-royalBlue text-base font-medium text-white hover:bg-jansaathi-royalBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jansaathi-royalBlue sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Create Bid
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCreateBidModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jansaathi-royalBlue sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
} 