import { Appbar } from "../components/AppBar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useState, useEffect } from "react";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the blog ID from URL if it exists
    
    useEffect(() => {
        // If we have an ID, fetch the blog data
        const fetchBlog = async () => {
            if (!id) return;
            
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token") || ""
                    }
                });
                setTitle(response.data.title);
                setDescription(response.data.content);
            } catch (error) {
                console.error("Error fetching blog:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        
        fetchBlog();
    }, [id, navigate]);

    const handleSubmit = async () => {
        try {
            if (id) {
                // Update existing blog
                await axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    title,
                    content: description,
                }, {
                    headers: {
                        Authorization: localStorage.getItem("token") || ""
                    }
                });
                navigate(`/blog/${id}`);
            } else {
                // Create new blog
                const response = await axios.post(`${BACKEND_URL}/api/v1/blog/create`, {
                    title,
                    content: description,
                }, {
                    headers: {
                        Authorization: localStorage.getItem("token") || ""
                    }
                });
                navigate(`/blog/${response.data.id}`);
            }
        } catch (error) {
            console.error("Error saving blog:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50">
                <Appbar />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
                        <div className="animate-pulse">
                            <div className="h-12 bg-zinc-200 rounded w-3/4 mb-6"></div>
                            <div className="h-64 bg-zinc-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="p-8">
                        {/* Title Input */}
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="w-full bg-transparent text-zinc-800 text-4xl font-bold mb-6 focus:outline-none placeholder-zinc-300 transition-colors"
                            placeholder="Enter your title..."
                        />
                        
                        {/* Text Editor */}
                        <TextEditor 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                        
                        {/* Publishing Options */}
                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-100">
                            <div className="text-sm text-zinc-500">
                                {id ? "Changes save automatically" : "Draft saves automatically"}
                            </div>
                            <div className="flex gap-4">
                                {id && (
                                    <button
                                        onClick={() => navigate(`/blog/${id}`)}
                                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all duration-200 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all duration-200 ease-in-out"
                                >
                                    {id ? "Update post" : "Publish post"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ 
    value, 
    onChange 
}: { 
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
    return (
        <div className="relative">
            <textarea
                value={value}
                onChange={onChange}
                id="editor"
                rows={12}
                className="block w-full text-zinc-700 text-lg leading-relaxed focus:outline-none placeholder-zinc-300 bg-transparent resize-none"
                placeholder="Start writing your story..."
                required
            />
            <div className="absolute bottom-0 right-0 p-4 text-sm text-zinc-400">
                Type / to add content
            </div>
        </div>
    );
}

export default Publish;