import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  IndianRupee,
  Calendar,
  MapPin,
  User,
  Wrench,
  Sun,
  Moon,
  CheckCircle,
  XCircle
} from "lucide-react";

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

interface AdminBid {
  id: string;
  issueId: string;
  issueCategory: string;
  issueDescription: string;
  issueLocation: string;
  bidAmount: number;
  bidStatus: "Pending" | "Accepted" | "Rejected";
  bidDate: string;
  contractorId?: string;
}

export default function AdminIssueBidding() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [issue, setIssue] = useState<Issue | null>(null);
  const [adminBids, setAdminBids] = useState<AdminBid[]>([]);
  const [showCreateBidForm, setShowCreateBidForm] = useState(false);
  const [newBidAmount, setNewBidAmount] = useState("");

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

  // Load issue and admin bids data
  useEffect(() => {
    // Load issues from localStorage
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

    // Load admin bids from localStorage
    const savedAdminBids = localStorage.getItem('adminBids');
    if (savedAdminBids) {
      const allAdminBids: AdminBid[] = JSON.parse(savedAdminBids);
      // Filter bids for this specific issue
      const issueBids = allAdminBids.filter(bid => bid.issueId === issueId);
      setAdminBids(issueBids);
    }
  }, [issueId]);

  // Handle creating a new admin bid
  const handleCreateBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issue || !newBidAmount) return;
    
    // Create new admin bid
    const newBid: AdminBid = {
      id: `ADMIN-BID-${Date.now()}`,
      issueId: issue.id,
      issueCategory: issue.category,
      issueDescription: issue.description,
      issueLocation: issue.location,
      bidAmount: parseInt(newBidAmount),
      bidStatus: "Pending",
      bidDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    };
    
    // Add to existing admin bids
    const updatedBids = [...adminBids, newBid];
    setAdminBids(updatedBids);
    
    // Save to localStorage
    const allAdminBids = JSON.parse(localStorage.getItem('adminBids') || '[]');
    allAdminBids.push(newBid);
    localStorage.setItem('adminBids', JSON.stringify(allAdminBids));
    
    // Reset form
    setNewBidAmount("");
    setShowCreateBidForm(false);
  };

  // Handle accepting an admin bid
  const handleAcceptBid = (bidId: string) => {
    const updatedBids = adminBids.map(bid => {
      if (bid.id === bidId) {
        return { ...bid, bidStatus: "Accepted" as const };
      } else if (bid.bidStatus === "Accepted") {
        return { ...bid, bidStatus: "Rejected" as const };
      }
      return bid;
    });
    
    setAdminBids(updatedBids);
    
    // Save to localStorage
    const allAdminBids = JSON.parse(localStorage.getItem('adminBids') || '[]');
    const updatedAllBids = allAdminBids.map((bid: AdminBid) => {
      const updatedBid = updatedBids.find(b => b.id === bid.id);
      return updatedBid ? updatedBid : bid;
    });
    
    localStorage.setItem('adminBids', JSON.stringify(updatedAllBids));
    
    // Update issue status to "In Progress"
    if (issue) {
      const allIssues = JSON.parse(localStorage.getItem('adminIssues') || '[]');
      const updatedIssues = allIssues.map((i: Issue) => {
        if (i.id === issue.id) {
          return { ...i, status: "In Progress" as const };
        }
        return i;
      });
      
      localStorage.setItem('adminIssues', JSON.stringify(updatedIssues));
    }
  };

  // Handle rejecting an admin bid
  const handleRejectBid = (bidId: string) => {
    const updatedBids = adminBids.map(bid => {
      if (bid.id === bidId) {
        return { ...bid, bidStatus: "Rejected" as const };
      }
      return bid;
    });
    
    setAdminBids(updatedBids);
    
    // Save to localStorage
    const allAdminBids = JSON.parse(localStorage.getItem('adminBids') || '[]');
    const updatedAllBids = allAdminBids.map((bid: AdminBid) => {
      const updatedBid = updatedBids.find(b => b.id === bid.id);
      return updatedBid ? updatedBid : bid;
    });
    
    localStorage.setItem('adminBids', JSON.stringify(updatedAllBids));
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
                  Bid on Issue #{issue.id}
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
                      Total Admin Bids
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {adminBids.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Bid Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowCreateBidForm(true)}
              className="bg-jansaathi-royalBlue hover:bg-jansaathi-royalBlue/90 text-white"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Create New Bid for this Issue
            </Button>
          </div>

          {/* Create Bid Form Modal */}
          {showCreateBidForm && (
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
                              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Bid Amount (₹)
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <IndianRupee className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="number"
                                  name="bidAmount"
                                  id="bidAmount"
                                  value={newBidAmount}
                                  onChange={(e) => setNewBidAmount(e.target.value)}
                                  required
                                  className="focus:ring-jansaathi-royalBlue focus:border-jansaathi-royalBlue block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                  placeholder="0.00"
                                />
                              </div>
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
                                onClick={() => setShowCreateBidForm(false)}
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

          {/* Admin Bids Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Bids for this Issue
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review and manage bids created by admins for this issue
              </p>
            </div>
            
            {adminBids.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Admin
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
                    {adminBids.map((bid) => (
                      <tr key={bid.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-jansaathi-royalBlue/10 dark:bg-jansaathi-royalBlue/20 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Admin #{bid.id.split('-')[2]}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {bid.issueCategory}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {bid.issueDescription}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {bid.issueLocation}
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
                                onClick={() => handleAcceptBid(bid.id)}
                                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
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
                              Accepted
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
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No admin bids created</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create a bid for this issue to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}