import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = () => {
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
                    <div className="hover:opacity-80 transition-opacity duration-200">
                        <Avatar size="small" name="harkirat" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlusIcon = ({ className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2} 
        stroke="currentColor" 
        className={className}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 4.5v15m7.5-7.5h-15" 
        />
    </svg>
);

export default Appbar;
