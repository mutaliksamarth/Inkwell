import { Blog } from "../hooks";
import { Appbar } from "./AppBar";
import { Avatar } from "./BlogCard";
import {  Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  id: number; 
  name: string;
  email: string;
}

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get<UserInfo>(`${BACKEND_URL}/api/v1/user/me`, {
          headers: { Authorization: `Barer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Convert author.id to number if it's a string, for proper comparison
  const isAuthor = userInfo?.id === (
    typeof blog.authorId=== 'string' ? parseInt(blog.authorId) : blog.authorId
  );

  // const handleEdit = () => {
  //   if (blog.id) {
  //     navigate(`/update/${blog.id}`);
  //   }
  // };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });// Add this new endpoint to your blogRouter

        navigate("/");
      } catch (error) {
        console.error("Error deleting blog:", error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-4 w-full pt-4 max-w-screen-xl">
          <div className="col-span-12 lg:col-span-8 py-12 lg:border-r border-zinc-200 lg:pr-12">
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900">{blog.title}</div>
              
              {!loading && isAuthor && (
                <div className="flex gap-2">
                  {/* <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    <Pencil size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button> */}
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-zinc-500 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Avatar size="small" name={blog.author.name || "Anonymous"} />
                <span className="font-medium text-zinc-700">{blog.author.name || "Anonymous"}</span>
              </div>
              <span>•</span>
              <time dateTime={""}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            <div className="prose prose-zinc max-w-none">
              <div className="text-base text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4 py-12 pl-12">
            <div className="sticky top-24">
              <div className="text-zinc-600 text-sm font-medium mb-4">
                About the author
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                <div className="flex items-center">
                  <div className="mr-4">
                    <Avatar size="big" name={blog.author.name || "Anonymous"} />
                  </div>
                  <div>
                    <div className="text-base font-bold text-zinc-800 mb-1">
                      {blog.author.name || "Anonymous"}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {"Random catch phrase about the author's ability to grab the user's attention"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBlog;
