import { Appbar } from '../components/AppBar';
import BlogCard from '../components/BlogCard';
import { useBlogs } from '../hooks/index';
import { LoadingState } from '../components/Skeletion';
import { Home, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Blogs = () => {
    const [activeTab, setActiveTab] = useState<'bulk' | 'me'>('bulk');
    const { loading, blogs } = useBlogs(activeTab);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50">
                <Appbar />
                <LoadingState />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="sticky top-0 z-50">
                <Appbar />
                
                <div className="bg-white/80 backdrop-blur-sm border-b border-zinc-200 transition-colors">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="flex space-x-8">
                            <TabButton 
                                icon={<Home className="transition-colors" size={18} />}
                                label="All Blogs"
                                active={activeTab === 'bulk'}
                                onClick={() => setActiveTab('bulk')}
                            />
                            <TabButton 
                                icon={<UserCircle className="transition-colors" size={18} />}
                                label="Your Blogs"
                                active={activeTab === 'me'}
                                onClick={() => setActiveTab('me')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div key={blog.id} className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                                <BlogCard
                                    id={blog.id}
                                    autherName={blog.author.name || "Anonymous"}
                                    title={blog.title}
                                    content={blog.content}
                                    publishDate={"2nd Feb 2024"}
                                />
                            </div>
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center space-x-2 px-4 py-3.5 relative transition-all duration-200
                ${active 
                    ? 'text-zinc-900 font-medium' 
                    : 'text-zinc-500 hover:text-zinc-700'
                }`
            }
        >
            <div className="transition-transform duration-200 group-hover:scale-105">
                {icon}
            </div>
            <span>{label}</span>
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 transition-all duration-200" />
            )}
        </button>
    );
};

const EmptyState = () => (
    <div className="text-center py-32 px-4 rounded-xl bg-white border border-zinc-200">
        <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                No blogs found
            </h3>
            <p className="text-zinc-500 mb-6">
                Be the first one to write a blog and share your thoughts with the world!
            </p>
            <Link to="/publish">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all duration-200">
                Create a Blog
            </button>
            </Link>
        </div>
    </div>
);

export default Blogs;