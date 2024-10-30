import  { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Appbar } from "../components/AppBar";
import { useBlog } from "../hooks/index";

// Types
interface BlogResponse {
  id: number;
}

interface CreateBlogInput {
  title: string;
  content: string;
}

interface UpdateBlogInput extends CreateBlogInput {
  id: number;
}

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { loading: blogLoading, blog } = useBlog({
    id: id || ""
  });

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  const handleChange = (field: "title" | "content", value: string) => {
    if (field === "title") setTitle(value);
    if (field === "content") setContent(value);
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please provide both title and content for your blog post");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Your session has expired. Please log in again");
      navigate("/signin");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let response;

      if (id) {
        response = await axios.put<BlogResponse>(
          `${BACKEND_URL}/api/v1/blog/update`,
          {
            id: Number(id),
            title,
            content,
          } as UpdateBlogInput,
          {
            headers: { Authorization: token }
          }
        );
      } else {
        response = await axios.post<BlogResponse>(
          `${BACKEND_URL}/api/v1/blog/create`,
          {
            title,
            content,
          } as CreateBlogInput,
          {
            headers: { Authorization: token }
          }
        );
      }

      setIsDirty(false);
      navigate(`/blog/${response.data.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Failed to save blog post";
        setError(Array.isArray(err.response?.data?.error) 
          ? err.response?.data?.error[0]?.message 
          : message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (id && blogLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded-lg w-3/4" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <input
              value={title}
              onChange={(e) => handleChange("title", e.target.value)}
              type="text"
              className="w-full bg-transparent text-4xl font-bold mb-8 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg p-2 -ml-2"
              placeholder="Enter your title..."
            />

            <TextEditor
              value={content}
              onChange={(e) => handleChange("content", e.target.value)}
            />

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                {isDirty ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    Unsaved changes
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    All changes saved
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : id ? (
                    'Update post'
                  ) : (
                    'Publish post'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TextEditor = ({
  value,
  onChange
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        rows={12}
        className="block w-full text-gray-700 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg p-2 -ml-2 resize-none"
        placeholder="Start writing your story..."
      />
    </div>
  );
};

export default Publish;