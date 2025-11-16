import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  IndianRupee,
  Calendar,
  MapPin,
  User,
  Wrench,
  Sun,
  Moon
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Types
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

export default function AdminBidManagement() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [bids, setBids] = useState<ContractorBid[]>([]);
  const [issue, setIssue] = useState<Issue | null>(null);

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

  // Load bids and issue data
  useEffect(() => {
    // Load all bids from localStorage
    const savedBids = localStorage.getItem('contractorBids');
    if (savedBids) {
      const allBids: ContractorBid[] = JSON.parse(savedBids);
      // Filter bids for this specific issue
      const issueBids = allBids.filter(bid => bid.projectId === issueId);
      setBids(issueBids);
    }

    // Load issues from localStorage or use mock data
    const savedIssues = localStorage.getItem('adminIssues');
    if (savedIssues) {
      const allIssues: Issue[] = JSON.parse(savedIssues);
      const foundIssue = allIssues.find(i => i.id === issueId);
      setIssue(foundIssue || null);
    } else {
      // Mock issue data if not found
      const mockIssues: Issue[] = [
        {
          id: "ISS-001",
          category: "Potholes",
          description: "Large pothole on Main Street causing traffic disruption",
          location: "Main Street, Sector 5",
          status: "Pending",
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
        }
      ];
      
      const foundIssue = mockIssues.find(i => i.id === issueId);
      setIssue(foundIssue || null);
    }
  }, [issueId]);

  // Handle bid selection
  const handleSelectBid = (bidId: string) => {
    const updatedBids = bids.map(bid => {
      if (bid.id === bidId) {
        return { ...bid, bidStatus: "Accepted" as const };
      } else if (bid.bidStatus === "Accepted") {
        return { ...bid, bidStatus: "Rejected" as const };
      }
      return bid;
    });
    
    setBids(updatedBids);
    
    // Save to localStorage
    const allBids = JSON.parse(localStorage.getItem('contractorBids') || '[]');
    const updatedAllBids = allBids.map((bid: ContractorBid) => {
      const updatedBid = updatedBids.find(b => b.id === bid.id);
      return updatedBid ? updatedBid : bid;
    });
    
    localStorage.setItem('contractorBids', JSON.stringify(updatedAllBids));
    
    // Send notification to the contractor who placed the accepted bid
    const acceptedBid = updatedBids.find(bid => bid.id === bidId);
    if (acceptedBid) {
      // Get existing contractor notifications
      const contractorNotifications = JSON.parse(localStorage.getItem('contractorNotifications') || '[]');
      
      // Create notification for the contractor
      const notification = {
        id: `NOTIF-${Date.now()}`,
        title: "Bid Accepted",
        message: `Your bid for ${acceptedBid.projectCategory}: ${acceptedBid.projectDescription} has been accepted. Bid amount: ₹${acceptedBid.bidAmount.toLocaleString()}`,
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
    }
    
    // Send rejection notifications to other contractors
    const rejectedBids = updatedBids.filter(bid => bid.id !== bidId && bid.bidStatus === "Rejected");
    if (rejectedBids.length > 0) {
      // Get existing contractor notifications
      const contractorNotifications = JSON.parse(localStorage.getItem('contractorNotifications') || '[]');
      
      // Create notifications for contractors whose bids were rejected
      rejectedBids.forEach(rejectedBid => {
        const notification = {
          id: `NOTIF-${Date.now()}-${rejectedBid.id}`,
          title: "Bid Rejected",
          message: `Your bid for ${rejectedBid.projectCategory}: ${rejectedBid.projectDescription} has been rejected.`,
          time: new Date().toLocaleString(),
          read: false
        };
        
        contractorNotifications.push(notification);
      });
      
      localStorage.setItem('contractorNotifications', JSON.stringify(contractorNotifications));
      
      // Dispatch storage event to trigger immediate update in other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'contractorNotifications',
        newValue: JSON.stringify(contractorNotifications)
      }));
    }
  };

  // Handle bid rejection
  const handleRejectBid = (bidId: string) => {
    const updatedBids = bids.map(bid => {
      if (bid.id === bidId) {
        return { ...bid, bidStatus: "Rejected" as const };
      }
      return bid;
    });
    
    setBids(updatedBids);
    
    // Save to localStorage
    const allBids = JSON.parse(localStorage.getItem('contractorBids') || '[]');
    const updatedAllBids = allBids.map((bid: ContractorBid) => {
      const updatedBid = updatedBids.find(b => b.id === bid.id);
      return updatedBid ? updatedBid : bid;
    });
    
    localStorage.setItem('contractorBids', JSON.stringify(updatedAllBids));
    
    // Send notification to the contractor whose bid was rejected
    const rejectedBid = updatedBids.find(bid => bid.id === bidId);
    if (rejectedBid) {
      // Get existing contractor notifications
      const contractorNotifications = JSON.parse(localStorage.getItem('contractorNotifications') || '[]');
      
      // Create notification for the contractor
      const notification = {
        id: `NOTIF-${Date.now()}`,
        title: "Bid Rejected",
        message: `Your bid for ${rejectedBid.projectCategory}: ${rejectedBid.projectDescription} has been rejected.`,
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
    }
  };

  // Calculate bid statistics
  const acceptedBids = bids.filter(bid => bid.bidStatus === "Accepted");
  const pendingBids = bids.filter(bid => bid.bidStatus === "Pending");
  const rejectedBids = bids.filter(bid => bid.bidStatus === "Rejected");
  
  const lowestBid = bids.length > 0 
    ? Math.min(...bids.map(bid => bid.bidAmount)) 
    : 0;
    
  const highestBid = bids.length > 0 
    ? Math.max(...bids.map(bid => bid.bidAmount)) 
    : 0;

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

          {/* Right side - Dark mode toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-jansaathi-royalBlue to-jansaathi-saffronOrange text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-grow overflow-y-auto pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Issue Details Header */}
          {issue && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bid Management for Issue #{issue.id}
                </h1>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  issue.status === "In Progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                  issue.status === "Pending" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                )}>
                  {issue.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {issue.category}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {issue.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {issue.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Reported {issue.date}
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Priority:</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        issue.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        issue.priority === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      )}>
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Bids Received
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {bids.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bids Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contractor Bids
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review and select the best bid for this issue
              </p>
            </div>
            
            {bids.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contractor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Bid Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bids.map((bid) => (
                      <tr key={bid.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-jansaathi-royalBlue/10 dark:bg-jansaathi-royalBlue/20 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Contractor #{bid.id.split('-')[1]}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {bid.projectCategory}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {bid.projectDescription}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {bid.projectLocation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <IndianRupee className="h-4 w-4" />
                            {bid.bidAmount.toLocaleString()}
                          </div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {bid.bidStatus === "Pending" && (
                            <div className="flex space-x-2 justify-end">
                              <Button
                                onClick={() => handleSelectBid(bid.id)}
                                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Select</span>
                              </Button>
                              <Button
                                onClick={() => handleRejectBid(bid.id)}
                                variant="outline"
                                className="flex items-center space-x-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                size="sm"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                            </div>
                          )}
                          {bid.bidStatus === "Accepted" && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Selected
                            </span>
                          )}
                          {bid.bidStatus === "Rejected" && (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bids received</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No contractors have placed bids for this issue yet.
                </p>
              </div>
            )}
          </div>
          
          {/* Summary Section */}
          {bids.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Bid Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Bids</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bids.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Accepted</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {acceptedBids.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Pending</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {pendingBids.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Rejected</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {rejectedBids.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Cost Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lowest Bid</div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-gray-900 dark:text-white" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {lowestBid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Highest Bid</div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-gray-900 dark:text-white" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {highestBid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Bid</div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-gray-900 dark:text-white" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {bids.length > 0 
                          ? Math.round(bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / bids.length).toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Recommendation
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {acceptedBids.length > 0 ? (
                      <span>
                        Bid <strong>#{acceptedBids[0].id}</strong> has been selected for this project.
                      </span>
                    ) : bids.length > 0 ? (
                      <span>
                        Consider selecting the lowest bid <strong>₹{lowestBid.toLocaleString()}</strong> for cost efficiency.
                      </span>
                    ) : (
                      <span>No bids available for recommendation.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}