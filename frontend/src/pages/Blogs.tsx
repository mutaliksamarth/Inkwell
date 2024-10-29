import { Appbar } from '../components/AppBar';
import BlogCard from '../components/BlogCard';
import { useBlogs } from '../hooks/index';
import {LoadingState} from  '../components/Skeletion';


export const Blogs = () => {
    const {loading, blogs} = useBlogs();
    if(loading) {
        return <div>
            <Appbar />
            <LoadingState/>
        </div>
    }

  return (
  <div>
    <Appbar />
   
  <div className="flex justify-center">
    
    <div >

        {blogs.map(blog => 
            
        
        
        <BlogCard
            autherName={blog.author.name}
            title={blog.title}
            content={blog.content}
            publishDate={"2/2/2022"}
        />

        )}
        
    </div>
    </div>
    </div>
  )
}
