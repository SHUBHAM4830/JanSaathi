import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import { Camera, Upload, X } from "lucide-react";
// @ts-ignore
import EXIF from "exif-js";
import { gps } from "exifr";

interface ComplaintForm {
  category: string;
  description: string;
  location: string;
  priority: string;
  photo: File | null;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: "Pending";
  priority: string;
  date: string;
  timestamp: number;
  points: number;
}

export default function SubmitComplaint() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<ComplaintForm>({
    category: "",
    description: "",
    location: "",
    priority: "",
    photo: null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locationAutoFilled, setLocationAutoFilled] = useState(false);
  const [locationFetchFailed, setLocationFetchFailed] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [newComplaint, setNewComplaint] = useState<Complaint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      // Clean up preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset location states when user manually enters location
    if (name === "location" && value) {
      setLocationAutoFilled(false);
      setLocationFetchFailed(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Reset location states when new image is uploaded
      setLocationAutoFilled(false);
      setLocationFetchFailed(false);
      
      // Extract GPS coordinates from image
      extractGPSFromImage(file);
    }
  };

  const extractGPSFromImage = async (file: File) => {
    console.log("Extracting GPS data from image...");
    
    try {
      // First, try with exif-js
      // @ts-ignore
      if (typeof EXIF !== 'undefined' && EXIF.getData) {
        // @ts-ignore
        EXIF.getData(file, function() {
          console.log("EXIF data retrieved with exif-js");
          
          try {
            // @ts-ignore
            const lat = EXIF.getTag(this, "GPSLatitude");
            // @ts-ignore
            const latRef = EXIF.getTag(this, "GPSLatitudeRef");
            // @ts-ignore
            const lon = EXIF.getTag(this, "GPSLongitude");
            // @ts-ignore
            const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
            
            console.log("GPS Data from exif-js:", { lat, latRef, lon, lonRef });
            
            if (lat && lon && latRef && lonRef) {
              const latitude = convertDMSToDD(lat, latRef);
              const longitude = convertDMSToDD(lon, lonRef);
              
              console.log("Coordinates extracted:", { latitude, longitude });
              
              // Reset failure state
              setLocationFetchFailed(false);
              
              // Reverse geocode to get address
              reverseGeocode(latitude, longitude);
              return;
            }
          } catch (exifError) {
            console.error("Error reading EXIF tags with exif-js:", exifError);
          }
        });
      }
      
      // If exif-js fails or doesn't find data, try with exifr
      console.log("Trying with exifr as fallback");
      const gpsData = await gps(file);
      
      if (gpsData) {
        console.log("GPS Data from exifr:", gpsData);
        
        const { latitude, longitude } = gpsData;
        
        if (latitude && longitude) {
          console.log("Coordinates extracted with exifr:", { latitude, longitude });
          
          // Reset failure state
          setLocationFetchFailed(false);
          
          // Reverse geocode to get address
          reverseGeocode(latitude, longitude);
          return;
        }
      }
      
      // If we reach here, no GPS data was found
      console.log("No GPS data found in image with either library");
      
      // Set failure state
      setLocationFetchFailed(true);
      setLocationAutoFilled(false);
      
      // Show alert popup
      alert("Location could not be fetched from the image. Please enter the location manually.");
    } catch (error) {
      console.error("Error extracting GPS data:", error);
      
      // Set failure state
      setLocationFetchFailed(true);
      setLocationAutoFilled(false);
      
      // Show alert popup
      alert("Error fetching location from image. Please enter the location manually.");
    }
  };

  const convertDMSToDD = (dms: any, ref: string) => {
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];
    
    let dd = degrees + minutes/60 + seconds/3600;
    
    if (ref === "S" || ref === "W") {
      dd = dd * -1;
    }
    
    return dd;
  };

  const reverseGeocode = (lat: number, lon: number) => {
    // In a real application, you would use a service like Google Maps API or similar
    // For this demo, we'll just show a message that location was detected
    const location = `Approximately at ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    
    // Update the location field in the form
    setFormData(prev => ({
      ...prev,
      location: location
    }));
    
    // Set the auto-filled flag
    setLocationAutoFilled(true);
    
    // Show notification to user
    console.log(`Location auto-filled from image: ${location}`);
    
    // Show alert popup
    alert(`Location successfully fetched from image: ${location}`);
  };

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      location: "" // Reset location field when photo is removed
    }));
    setPreviewUrl(null);
    
    // Reset location states
    setLocationAutoFilled(false);
    setLocationFetchFailed(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define points based on category
    const getCategoryPoints = (category: string): number => {
      switch (category) {
        case "waterlogging":
          return 100;
        case "broken-roads":
          return 75;
        case "potholes":
          return 50;
        case "live-wires":
          return 50;
        default:
          return 25; // Default points for unknown categories
      }
    };
    
    // Create a new complaint object
    const complaintData = {
      id: `CMP-${Date.now()}`, // Generate unique ID
      title: formData.description.substring(0, 50) + (formData.description.length > 50 ? '...' : ''),
      description: formData.description,
      category: formData.category,
      location: formData.location,
      status: "Pending" as const,
      priority: formData.priority,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      points: getCategoryPoints(formData.category)
    };
    
    // Get existing complaints from localStorage
    const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    
    // Add new complaint to the beginning of the array
    const updatedComplaints = [complaintData, ...existingComplaints];
    
    // Save updated complaints to localStorage
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    // Set the new complaint and show share popup
    setNewComplaint(complaintData);
    setShowSharePopup(true);
  };

  // Function to post complaint to X (formerly Twitter)
  const postToTwitter = () => {
    if (!newComplaint) return;
    
    // Determine relevant authorities based on complaint category
    const getRelevantAuthorities = (category: string): string => {
      switch (category) {
        case "waterlogging":
          return "@MCDelhi @MoHUAIndia #WaterLogging";
        case "broken-roads":
        case "potholes":
          return "@MCDelhi @MoRTHIndia #RoadMaintenance";
        case "live-wires":
          return "@TPDDL @PowerMinIndia #Electricity";
        default:
          return "@MCDelhi @MoHUAIndia";
      }
    };
    
    // Create tweet content
    const tweetContent = `🚨 New Civic Issue Reported 🚨
    
Issue: ${newComplaint.description}
Location: ${newComplaint.location}
Category: ${newComplaint.category}
Priority: ${newComplaint.priority}

@JanSaathiOfficial is tracking this issue. 
Relevant Authorities: ${getRelevantAuthorities(newComplaint.category)}

#CivicEngagement #JanSaathi #CitizenVoice`;
    
    // In a real implementation, you would integrate with X API here
    // For now, we'll simulate the posting and show a success message
    console.log("Posting to X:", tweetContent);
    
    // Show success notification
    alert("Complaint successfully posted to X!");
    
    // Close the popup and navigate to citizen dashboard
    setShowSharePopup(false);
    navigate("/citizen");
  };

  // Function to close the X popup and navigate to dashboard
  const closeTwitterPopup = () => {
    setShowSharePopup(false);
    navigate("/citizen");
  };

  const categories = [
    { value: "broken-roads", label: "Broken Roads" },
    { value: "live-wires", label: "Live Wires" },
    { value: "potholes", label: "Potholes" },
    { value: "waterlogging", label: "Waterlogging" }
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  return (
    <section className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Background Elements */}
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

      {/* Main content container */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-start px-4 sm:px-6 py-8 pb-48">
        <div className="max-w-2xl w-full space-y-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl mt-16 mb-32">
          <div className={cn(
            "text-center space-y-1",
            isVisible ? "animate-fade-in" : "opacity-0"
          )}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Submit a Complaint
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Please provide detailed information about the issue you're reporting
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Please describe the issue in detail..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Photo
              </label>
              
              {previewUrl ? (
                <div className="mt-1 relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                  >
                    <img 
                      src="/Xlogo.jpg" 
                      alt="Remove" 
                      className="h-4 w-4 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/logo.png"; // Fallback to existing logo
                      }}
                    />
                  </button>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Click the X to remove the image
                  </p>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="photo"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-jansaathi-royalBlue dark:text-jansaathi-saffronOrange hover:text-jansaathi-royalBlue/80 dark:hover:text-jansaathi-saffronOrange/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-jansaathi-royalBlue dark:focus-within:ring-jansaathi-saffronOrange"
                      >
                        <span>Upload a photo</span>
                        <input
                          ref={fileInputRef}
                          id="photo"
                          name="photo"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter the location of the issue"
              />
              {locationAutoFilled && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  Location auto-filled from image metadata
                </p>
              )}
              {locationFetchFailed && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Location could not be fetched from image. Please enter manually.
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-jansaathi-royalBlue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select priority level</option>
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="w-full flex justify-center py-1.5 px-4 text-sm border border-transparent rounded-lg text-white bg-jansaathi-royalBlue dark:bg-jansaathi-saffronOrange hover:bg-jansaathi-royalBlue/90 dark:hover:bg-jansaathi-saffronOrange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jansaathi-royalBlue dark:focus:ring-jansaathi-saffronOrange"
              >
                Submit Complaint
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Twitter Popup Modal */}
      {showSharePopup && newComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <img 
                      src="/Xlogo.jpg" 
                      alt="X Logo" 
                      className="h-8 w-8 object-contain sm:h-6 sm:w-6"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/logo.png"; // Fallback to existing logo
                      }}
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Share on X
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your complaint has been submitted successfully. Would you like to share it on X to raise awareness?
                      </p>
                      
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white">Complaint Details</h4>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <p><span className="font-medium">Issue:</span> {newComplaint.description}</p>
                          <p><span className="font-medium">Location:</span> {newComplaint.location}</p>
                          <p><span className="font-medium">Category:</span> {newComplaint.category}</p>
                          <p><span className="font-medium">Priority:</span> {newComplaint.priority}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={postToTwitter}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Share on X
                </button>
                <button
                  type="button"
                  onClick={closeTwitterPopup}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jansaathi-royalBlue dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
