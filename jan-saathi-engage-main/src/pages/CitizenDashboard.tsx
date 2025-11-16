import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  Sun, 
  Moon, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus,
  MapPin,
  Calendar,
  Construction,
  Droplets,
  Zap,
  LogOut,
  X,
  Lightbulb,
  Trash2,
  Wifi,
  Eye,
  Trophy,
  IndianRupee
} from "lucide-react";
import Footer from "@/components/Footer";

interface Complaint {
  id: string;
  title: string;
  category: string;
  location: string;
  status: "Pending" | "In Progress" | "Resolved";
  date: string;
  timestamp: number;
  points?: number;
}

interface Notification {
  message: string;
  time: string;
  read: boolean;
}

interface Stat {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
}

export default function CitizenDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      message: "Your complaint #123 has been resolved",
      time: "2 hours ago",
      read: false,
    },
    {
      message: "New update on your complaint #124",
      time: "1 day ago",
      read: false,
    },
  ]);
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, bank, wallet
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [cashoutProcessing, setCashoutProcessing] = useState(false);
  // Validation error states
  const [upiIdError, setUpiIdError] = useState("");
  const [bankAccountError, setBankAccountError] = useState("");
  const [ifscCodeError, setIfscCodeError] = useState("");
  const [walletNumberError, setWalletNumberError] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    // Get complaints from localStorage or use default complaints
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      return JSON.parse(savedComplaints);
    }
    
    // Default complaints if none are saved
    return [
      {
        id: "CMP-001",
        title: "Large Pothole on Main Street",
        category: "Potholes",
        location: "Sector 12, New Delhi",
        status: "In Progress",
        date: "Jan 15, 2024",
        timestamp: Date.now() - 172800000,
        points: 50
      },
      {
        id: "CMP-002",
        title: "Severe Waterlogging in Park Area",
        category: "Waterlogging",
        location: "Central Park, New Delhi",
        status: "Resolved",
        date: "Jan 10, 2024",
        timestamp: Date.now() - 604800000,
        points: 100
      },
      {
        id: "CMP-003",
        title: "Exposed Live Wires Near School",
        category: "Live Wires",
        location: "Sector 8, New Delhi",
        status: "Pending",
        date: "Jan 18, 2024",
        timestamp: Date.now() - 86400000,
        points: 50
      },
      {
        id: "CMP-004",
        title: "Broken Road Surface in Residential Area",
        category: "Broken Roads",
        location: "Green Valley, New Delhi",
        status: "In Progress",
        date: "Jan 17, 2024",
        timestamp: Date.now() - 129600000,
        points: 75
      }
    ];
  });
  const [civicScore, setCivicScore] = useState(0); // Initialize to 0, will be calculated

  // Calculate civic score based on complaints
  useEffect(() => {
    const calculatedScore = complaints.reduce((total, complaint) => {
      return total + (complaint.points || 0);
    }, 0);
    setCivicScore(calculatedScore);
  }, [complaints]);

  const navigate = useNavigate();

  // Calculate statistics
  const stats: Stat[] = [
    { 
      title: "Total Complaints", 
      value: complaints.length,
      icon: AlertCircle, 
      color: "text-jansaathi-royalBlue dark:text-jansaathi-royalBlue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    { 
      title: "Pending Complaints", 
      value: complaints.filter(c => c.status === "Pending").length,
      icon: Clock, 
      color: "text-jansaathi-saffronOrange dark:text-jansaathi-saffronOrange",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    { 
      title: "Resolved Complaints", 
      value: complaints.filter(c => c.status === "Resolved").length,
      icon: CheckCircle2, 
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Civic Score",
      value: civicScore,
      icon: Trophy,
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

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

  useEffect(() => {
    // Update complaints from localStorage when component mounts
    const savedComplaints = localStorage.getItem('complaints');
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Broken Roads":
        return <Construction className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Live Wires":
        return <Zap className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Potholes":
        return <Construction className="w-5 h-5 text-jansaathi-royalBlue" />;
      case "Waterlogging":
        return <Droplets className="w-5 h-5 text-jansaathi-royalBlue" />;
      default:
        return <AlertCircle className="w-5 h-5 text-jansaathi-royalBlue" />;
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
  };

  // Validation functions for payment methods
  const validateUpiId = (upiId: string): boolean => {
    // UPI ID format: username@bank or username@upi
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const validateBankAccount = (account: string): boolean => {
    // Bank account should be 9-18 digits
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(account);
  };

  const validateIfscCode = (ifsc: string): boolean => {
    // IFSC code format: 4 letters + 1 digit + 6 alphanumeric
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase());
  };

  const validateMobileNumber = (mobile: string): boolean => {
    // Indian mobile number: 10 digits starting with 6-9
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleCashout = async () => {
    // Validate payment information based on selected method
    if (civicScore < 100) {
      alert("You need at least 100 points to cash out. Your current score is " + civicScore + " points.");
      return;
    }

    if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID.");
        return;
      }
      if (!validateUpiId(upiId)) {
        alert("Please enter a valid UPI ID (e.g., username@bank).");
        return;
      }
    }

    if (paymentMethod === "bank") {
      if (!bankAccount) {
        alert("Please enter your bank account number.");
        return;
      }
      if (!validateBankAccount(bankAccount)) {
        alert("Please enter a valid bank account number (9-18 digits).");
        return;
      }
      if (!ifscCode) {
        alert("Please enter your IFSC code.");
        return;
      }
      if (!validateIfscCode(ifscCode)) {
        alert("Please enter a valid IFSC code (e.g., SBIN0002499).");
        return;
      }
    }

    if (paymentMethod === "wallet") {
      if (!walletNumber) {
        alert("Please enter your mobile number for wallet transfer.");
        return;
      }
      if (!validateMobileNumber(walletNumber)) {
        alert("Please enter a valid Indian mobile number (10 digits starting with 6-9).");
        return;
      }
    }

    // Simulate processing
    setCashoutProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Process cashout
    const cashoutAmount = Math.floor(civicScore / 10); // 10 points = ₹1
    
    // In a real app, you would make an API call here to process the payment
    console.log("Processing cashout:", {
      amount: cashoutAmount,
      method: paymentMethod,
      upiId: paymentMethod === "upi" ? upiId : undefined,
      bankAccount: paymentMethod === "bank" ? bankAccount : undefined,
      ifscCode: paymentMethod === "bank" ? ifscCode : undefined,
      walletNumber: paymentMethod === "wallet" ? walletNumber : undefined
    });
    
    // Update civic score (set to 0 after cashout)
    setCivicScore(0);
    
    // Clear complaints points since they've been cashed out
    const updatedComplaints = complaints.map(complaint => ({
      ...complaint,
      points: 0
    }));
    setComplaints(updatedComplaints);
    
    // Save updated complaints to localStorage
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    // Send notification to admin
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      title: "User Cashout Request",
      message: `A user has requested to cash out ₹${cashoutAmount} via ${paymentMethod}`,
      time: new Date().toLocaleString(),
      read: false
    };
    adminNotifications.push(newNotification);
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
    
    setCashoutProcessing(false);
    setShowCashoutModal(false);
    
    // Show success message
    alert(`Successfully cashed out ₹${cashoutAmount}! The amount will be transferred to your ${paymentMethod === "upi" ? "UPI ID" : paymentMethod === "bank" ? "bank account" : "wallet"} within 24 hours.`);
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
                Citizen Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Track and manage your complaints
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex flex-wrap gap-2">
              <Button
                onClick={() => navigate("/community-complaints")}
                className="flex items-center space-x-2 bg-jansaathi-saffronOrange dark:bg-jansaathi-royalBlue hover:bg-jansaathi-saffronOrange/90 dark:hover:bg-jansaathi-royalBlue/90 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                <Eye className="h-4 w-4" />
                <span>View Community Complaints</span>
              </Button>
              <Button
                onClick={() => {
                  setShowCashoutModal(true);
                  // Clear any previous validation errors
                  setUpiIdError("");
                  setBankAccountError("");
                  setIfscCodeError("");
                  setWalletNumberError("");
                }}
                className="flex items-center space-x-2 bg-jansaathi-royalBlue dark:bg-jansaathi-saffronOrange hover:bg-jansaathi-royalBlue/90 dark:hover:bg-jansaathi-saffronOrange/90 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                <IndianRupee className="h-4 w-4" />
                <span>Cash Out Points</span>
              </Button>
              <Button
                onClick={() => navigate("/submit-complaint")}
                className="flex items-center space-x-2 bg-jansaathi-royalBlue dark:bg-jansaathi-saffronOrange hover:bg-jansaathi-royalBlue/90 dark:hover:bg-jansaathi-saffronOrange/90 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Submit New Complaint</span>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 transition-all duration-300",
                  "hover:shadow-lg transform hover:-translate-y-1",
                  "border border-gray-100 dark:border-gray-700"
                )}
              >
                <div className="flex items-center">
                  <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Complaints */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Recent Complaints
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getCategoryIcon(complaint.category)}
                      <p className="ml-3 text-sm font-medium text-jansaathi-royalBlue dark:text-jansaathi-royalBlue">
                        {complaint.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center space-x-4">
                      <span className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        complaint.status === "In Progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        complaint.status === "Pending" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      )}>
                        {complaint.status}
                      </span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">
                        +{complaint.points} points
                      </span>
                      <Button
                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                        {complaint.location}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Submitted on <time dateTime={complaint.date}>{complaint.date}</time>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cashout Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cash Out Civic Points
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You have {civicScore} points available. Each 10 points can be converted to ₹1.
            </p>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
              Cashout Amount: ₹{Math.floor(civicScore / 10)}
            </p>
            
            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`py-2 px-3 text-sm rounded-md border ${
                    paymentMethod === "upi"
                      ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200"
                      : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  }`}
                >
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`py-2 px-3 text-sm rounded-md border ${
                    paymentMethod === "bank"
                      ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200"
                      : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  }`}
                >
                  Bank
                </button>
                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className={`py-2 px-3 text-sm rounded-md border ${
                    paymentMethod === "wallet"
                      ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200"
                      : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  }`}
                >
                  Wallet
                </button>
              </div>
            </div>
            
            {/* Payment Details */}
            {paymentMethod === "upi" && (
              <div className="mb-4">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    // Clear error when user types
                    if (upiIdError) setUpiIdError("");
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !validateUpiId(e.target.value)) {
                      setUpiIdError("Please enter a valid UPI ID (e.g., username@bank).");
                    } else {
                      setUpiIdError("");
                    }
                  }}
                  placeholder="yourname@upi"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 ${upiIdError ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:text-white`}
                />
                {upiIdError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{upiIdError}</p>
                )}
              </div>
            )}
            
            {paymentMethod === "bank" && (
              <div className="mb-4">
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  value={bankAccount}
                  onChange={(e) => {
                    setBankAccount(e.target.value);
                    // Clear error when user types
                    if (bankAccountError) setBankAccountError("");
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !validateBankAccount(e.target.value)) {
                      setBankAccountError("Please enter a valid bank account number (9-18 digits).");
                    } else {
                      setBankAccountError("");
                    }
                  }}
                  placeholder="Enter account number"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 ${bankAccountError ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:text-white mb-3`}
                />
                {bankAccountError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{bankAccountError}</p>
                )}
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  value={ifscCode}
                  onChange={(e) => {
                    setIfscCode(e.target.value);
                    // Clear error when user types
                    if (ifscCodeError) setIfscCodeError("");
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !validateIfscCode(e.target.value)) {
                      setIfscCodeError("Please enter a valid IFSC code (e.g., SBIN0002499).");
                    } else {
                      setIfscCodeError("");
                    }
                  }}
                  placeholder="Enter IFSC code"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 ${ifscCodeError ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:text-white`}
                />
                {ifscCodeError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{ifscCodeError}</p>
                )}
              </div>
            )}
            
            {paymentMethod === "wallet" && (
              <div className="mb-4">
                <label htmlFor="walletNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="walletNumber"
                  value={walletNumber}
                  onChange={(e) => {
                    setWalletNumber(e.target.value);
                    // Clear error when user types
                    if (walletNumberError) setWalletNumberError("");
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !validateMobileNumber(e.target.value)) {
                      setWalletNumberError("Please enter a valid Indian mobile number (10 digits starting with 6-9).");
                    } else {
                      setWalletNumberError("");
                    }
                  }}
                  placeholder="Enter mobile number"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 ${walletNumberError ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:text-white`}
                />
                {walletNumberError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{walletNumberError}</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => {
                  setShowCashoutModal(false);
                  // Reset form fields
                  setUpiId("");
                  setBankAccount("");
                  setIfscCode("");
                  setWalletNumber("");
                  // Reset validation errors
                  setUpiIdError("");
                  setBankAccountError("");
                  setIfscCodeError("");
                  setWalletNumberError("");
                }}
                variant="outline"
                className="text-gray-600 dark:text-gray-400"
                disabled={cashoutProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCashout}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={cashoutProcessing}
              >
                {cashoutProcessing ? "Processing..." : "Confirm Cashout"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating shapes - visual flair */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-jansaathi-royalBlue/10 dark:bg-jansaathi-royalBlue/5 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70"></div>
      <div className="absolute bottom-1/3 -right-20 w-60 h-60 bg-jansaathi-saffronOrange/10 dark:bg-jansaathi-saffronOrange/5 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-1000 opacity-70"></div>
      <Footer />
    </div>
  );
} 