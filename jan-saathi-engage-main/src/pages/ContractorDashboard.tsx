import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Bell, Sun, Moon, Gavel, ClipboardList, CheckCircle, IndianRupee, LogOut } from "lucide-react";

interface Bid {
  id: string;
  category: string;
  description: string;
  location: string;
  deadline: string;
}

// Add new interface for contractor's bids
interface ContractorBid {
  id: string;
  projectId: string;
  projectCategory: string;
  projectDescription: string;
  projectLocation: string;
  projectDeadline: string;
  bidAmount: number;
  bidStatus: "Pending" | "Accepted" | "Rejected";
  bidDate: string;
}

interface Project {
  id: string;
  category: string;
  description: string;
  status: string;
  deadline: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function ContractorDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("open-bids");
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const navigate = useNavigate();

  // Sample data
  const openBids: Bid[] = [
    {
      id: "12345",
      category: "Potholes",
      description: "Large pothole on Main Street",
      location: "Sector 12, New Delhi",
      deadline: "Jan 20, 2024"
    },
    {
      id: "12344",
      category: "Waterlogging",
      description: "Water accumulation in Park Area",
      location: "Central Park, New Delhi",
      deadline: "Jan 22, 2024"
    }
  ];

  // Add contractor's bids data
  const [contractorBids, setContractorBids] = useState<ContractorBid[]>(() => {
    const savedBids = localStorage.getItem('contractorBids');
    if (savedBids) {
      return JSON.parse(savedBids);
    }
    
    // Default contractor bids if none are saved
    return [
      {
        id: "BID-001",
        projectId: "12345",
        projectCategory: "Potholes",
        projectDescription: "Large pothole on Main Street",
        projectLocation: "Sector 12, New Delhi",
        projectDeadline: "Jan 20, 2024",
        bidAmount: 15000,
        bidStatus: "Pending",
        bidDate: "Jan 10, 2024"
      },
      {
        id: "BID-002",
        projectId: "12343",
        projectCategory: "Live Wires",
        projectDescription: "Exposed electrical wires hanging dangerously low",
        projectLocation: "Sunset Heights",
        projectDeadline: "Jan 25, 2024",
        bidAmount: 8000,
        bidStatus: "Accepted",
        bidDate: "Jan 8, 2024"
      }
    ];
  });

  // Effect to update bids when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedBids = localStorage.getItem('contractorBids');
      if (savedBids) {
        setContractorBids(JSON.parse(savedBids));
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const activeProjects: Project[] = [
    {
      id: "12343",
      category: "Broken Roads",
      description: "Major road damage causing traffic congestion",
      status: "In Progress",
      deadline: "Jan 25, 2024"
    }
  ];

  // Calculate stats based on actual data
  const [stats, setStats] = useState([
    { id: 1, name: "Open Bids", value: "0", icon: Gavel, color: "text-blue-600" },
    { id: 2, name: "My Bids", value: "0", icon: ClipboardList, color: "text-yellow-500" },
    { id: 3, name: "Active Projects", value: "0", icon: CheckCircle, color: "text-green-500" },
    { id: 4, name: "Total Revenue", value: "₹0", icon: IndianRupee, color: "text-blue-500" }
  ]);

  // Update stats when contractorBids or other data changes
  useEffect(() => {
    const totalBids = contractorBids.length;
    const acceptedBids = contractorBids.filter(bid => bid.bidStatus === "Accepted").length;
    const pendingBids = contractorBids.filter(bid => bid.bidStatus === "Pending").length;
    const totalRevenue = contractorBids
      .filter(bid => bid.bidStatus === "Accepted")
      .reduce((sum, bid) => sum + bid.bidAmount, 0);

    setStats([
      { id: 1, name: "Open Bids", value: openBids.length.toString(), icon: Gavel, color: "text-blue-600" },
      { id: 2, name: "My Bids", value: totalBids.toString(), icon: ClipboardList, color: "text-yellow-500" },
      { id: 3, name: "Active Projects", value: activeProjects.length.toString(), icon: CheckCircle, color: "text-green-500" },
      { id: 4, name: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-blue-500" }
    ]);
  }, [contractorBids, openBids, activeProjects]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Bid Available",
      message: "A new road maintenance project is available for bidding",
      time: "5 minutes ago",
      read: false
    },
    {
      id: "2",
      title: "Bid Accepted",
      message: "Your bid for the water supply project has been accepted",
      time: "1 hour ago",
      read: false
    },
    {
      id: "3",
      title: "Project Update",
      message: "New materials have been approved for your active project",
      time: "2 hours ago",
      read: true
    }
  ]);

  // Add contractor notifications state
  const [contractorNotifications, setContractorNotifications] = useState<Notification[]>(() => {
    // Get contractor notifications from localStorage or use empty array
    const savedNotifications = localStorage.getItem('contractorNotifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    return [];
  });

  // Effect to update notifications when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contractorNotifications') {
        const savedNotifications = localStorage.getItem('contractorNotifications');
        if (savedNotifications) {
          setContractorNotifications(JSON.parse(savedNotifications));
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
      const savedNotifications = localStorage.getItem('contractorNotifications');
      if (savedNotifications) {
        setContractorNotifications(JSON.parse(savedNotifications));
      }
    }, 1000); // Check every 1 second for faster updates
    
    return () => clearInterval(interval);
  }, []);

  // Function to mark contractor notification as read
  const markContractorNotificationAsRead = (id: string) => {
    const updatedNotifications = contractorNotifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setContractorNotifications(updatedNotifications);
    // Save to localStorage
    localStorage.setItem('contractorNotifications', JSON.stringify(updatedNotifications));
  };

  // Update unread count to include contractor notifications
  const unreadContractorCount = contractorNotifications.filter(n => !n.read).length;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

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

  const handlePlaceBid = (bid: Bid) => {
    setSelectedBid(bid);
    setShowBidModal(true);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to submit the bid
    if (selectedBid) {
      // Get form data
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const estimatedCost = formData.get('estimated-cost') as string;
      const notes = formData.get('notes') as string;
      
      // Create a new contractor bid
      const newBid: ContractorBid = {
        id: `BID-${Date.now()}`,
        projectId: selectedBid.id,
        projectCategory: selectedBid.category,
        projectDescription: selectedBid.description,
        projectLocation: selectedBid.location,
        projectDeadline: selectedBid.deadline,
        bidAmount: parseInt(estimatedCost) || 0,
        bidStatus: "Pending",
        bidDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
      
      // Add to contractor bids
      const updatedBids = [...contractorBids, newBid];
      setContractorBids(updatedBids);
      
      // Save to localStorage
      localStorage.setItem('contractorBids', JSON.stringify(updatedBids));
      
      // Send notification to admin
      const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      const notification = {
        id: `NOTIF-${Date.now()}`,
        title: "New Bid Placed",
        message: `A new bid has been placed for ${selectedBid.category}: ${selectedBid.description}. Bid amount: ₹${parseInt(estimatedCost) || 0}`,
        time: new Date().toLocaleString(),
        read: false
      };
      adminNotifications.push(notification);
      localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
      
      // Dispatch storage event to trigger immediate update in other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'adminNotifications',
        newValue: JSON.stringify(adminNotifications)
      }));
    }
    
    setShowBidModal(false);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
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
                className="h-8 w-auto"
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
                {(notifications.length + contractorNotifications.length) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-jansaathi-royalBlue text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length + contractorNotifications.length}
                  </span>
                )}
              </button>
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  {notifications.length > 0 || contractorNotifications.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {/* System notifications */}
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
                      {/* Contractor-specific notifications */}
                      {contractorNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border-t border-gray-100 dark:border-gray-700"
                          onClick={() => markContractorNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                              Bid Update
                            </span>
                          </div>
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
      <div className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 mt-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className={`${stat.color} text-3xl`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("open-bids")}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "open-bids"
                  ? "border-jansaathi-royalBlue text-jansaathi-royalBlue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Open Bids
            </button>
            <button
              onClick={() => setActiveTab("my-bids")}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "my-bids"
                  ? "border-jansaathi-royalBlue text-jansaathi-royalBlue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              My Bids
            </button>
            <button
              onClick={() => setActiveTab("active-projects")}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "active-projects"
                  ? "border-jansaathi-royalBlue text-jansaathi-royalBlue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Active Projects
            </button>
            <button
              onClick={() => setActiveTab("completed-projects")}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "completed-projects"
                  ? "border-jansaathi-royalBlue text-jansaathi-royalBlue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Completed Projects
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="mt-8">
          {activeTab === "open-bids" && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Open Bids
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {openBids.map((bid) => (
                      <tr key={bid.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{bid.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Gavel className="text-blue-500 mr-2" />
                            {bid.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {bid.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {bid.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {bid.deadline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handlePlaceBid(bid)}
                            className="text-jansaathi-royalBlue hover:text-jansaathi-royalBlue/80 dark:text-jansaathi-saffronOrange dark:hover:text-jansaathi-saffronOrange/80"
                          >
                            Place Bid
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "my-bids" && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  My Bids
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Projects you have submitted bids for
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bid ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Project
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bid Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bid Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {contractorBids.map((bid) => (
                      <tr key={bid.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {bid.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="font-medium text-gray-900 dark:text-white">{bid.projectCategory}</div>
                          <div className="text-gray-500 dark:text-gray-400">{bid.projectDescription}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {bid.projectLocation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{bid.bidAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            bid.bidStatus === "Accepted" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                              : bid.bidStatus === "Rejected" 
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          )}>
                            {bid.bidStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {bid.bidDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contractorBids.length === 0 && (
                  <div className="text-center py-12">
                    <Gavel className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bids found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      You haven't placed any bids yet.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab("open-bids")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-jansaathi-royalBlue hover:bg-jansaathi-royalBlue/90 focus:outline-none"
                      >
                        Browse Open Bids
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "active-projects" && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Active Projects
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {activeProjects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{project.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <ClipboardList className="text-blue-500 mr-2" />
                            {project.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {project.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {project.deadline}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-jansaathi-royalBlue hover:text-jansaathi-royalBlue/80 dark:text-jansaathi-saffronOrange dark:hover:text-jansaathi-saffronOrange/80">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "completed-projects" && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Completed Projects
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No completed projects</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Projects you complete will appear here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedBid && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Place Bid
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4" onSubmit={handleSubmitBid}>
                        <div>
                          <label htmlFor="estimated-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estimated Time (days)
                          </label>
                          <input
                            type="number"
                            name="estimated-time"
                            id="estimated-time"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="estimated-cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estimated Cost (₹)
                          </label>
                          <input
                            type="number"
                            name="estimated-cost"
                            id="estimated-cost"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Notes
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-jansaathi-royalBlue focus:ring-jansaathi-royalBlue dark:bg-gray-700 dark:text-white sm:text-sm"
                          ></textarea>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-jansaathi-royalBlue text-base font-medium text-white hover:bg-jansaathi-royalBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jansaathi-royalBlue sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Submit Bid
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBidModal(false)}
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