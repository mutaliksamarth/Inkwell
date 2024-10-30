import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { LogOut, PlusIcon } from "lucide-react";
import axios from "axios";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

import { BACKEND_URL } from "../config";

export const Appbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Fetch user info from backend
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/signin");
                    return;
                }

                const response = await axios.get(
                    `${BACKEND_URL}/api/v1/user/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem("token");
                    navigate("/signin");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
                <Link 
                    to={'/blogs'} 
                    className="text-xl font-bold text-slate-800 hover:text-slate-600 transition-colors duration-200"
                >
                    InkWell
                </Link>
                
                <div className="flex items-center space-x-4">
                    <Link to={`/publish`}>
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded-full transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        >
                            <PlusIcon className="w-3 h-3 mr-0.5" />
                            New
                        </button>
                    </Link>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="hover:opacity-80 transition-opacity duration-200 focus:outline-none"
                        >
                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                            ) : (
                                <Avatar size="small" name={userInfo?.name || "User"} />
                            )}
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                                {loading ? (
                                    <div className="px-4 py-2 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                                        <div className="h-3 bg-slate-200 rounded animate-pulse" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 border-b border-slate-200">
                                            <p className="text-sm font-medium text-slate-900">
                                                {userInfo?.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {userInfo?.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors duration-200"
                                        >
                                            <LogOut size={16} />
                                            <span>Sign out</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// PlusIcon component remains the same...

export default Appbar;