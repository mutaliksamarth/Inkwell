import { FullBlog } from "../components/FullBlog";
import FullBlogSkeleton from "../components/Skeletion";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom"


export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({
        id:id||"1"
    });
    if (loading) {
        return (
            <div>
                <FullBlogSkeleton/>
                
            </div>  
           
        )
    }
    return (
        <div>
            {blog ? (
                <FullBlog
                    blog={blog}
                />
            ) : (
                <div>
                    Blog not found.
                </div>
            )}
        </div>
    )
}