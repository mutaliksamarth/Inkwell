import { Link } from "react-router-dom";


interface BlogCardProps {
    autherName: string,
    title: string,
    content: string,
    publishDate: string,
    id: number
}

const BlogCard = ({
    id,
    autherName,
    title,
    content,
    publishDate
}: BlogCardProps) => {
    return (<Link to={`/blog/${id}`}>
        <div className="group p-6 border border-slate-200 rounded-lg hover:shadow-md transition-shadow duration-300 max-w-screen-md cursor-pointer bg-white ">
            <div className="flex items-center space-x-3">
                <Avatar name={autherName} />
                <div className="font-medium text-sm text-slate-800">{autherName}</div>
                <Circle />
                <div className="text-sm text-slate-500">
                    {publishDate}
                </div>
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors duration-200">
                {title}
            </h2>
            
            <p className="mt-3 text-slate-600 line-clamp-3">
                {content.slice(0, 200)}
                {content.length > 200 && "..."}
            </p>
            
            <div className="flex items-center mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center text-sm text-slate-500">
                    <ClockIcon />
                    <span className="ml-2">
                        {`${Math.ceil(content.length / 100)} minute read`}
                    </span>
                </div>
            </div>
        </div>
        </Link>
    );
};

const Circle = () => {
    return (
        <div className="h-1 w-1 rounded-full bg-slate-400" />
    );
};

export const Avatar = ({ name, size = "small" }: { name: string, size?: "small" | "big" }) => {
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden bg-slate-200 rounded-full ${size === "small" ? "w-8 h-8" : "w-12 h-12"}`}>
            <span className={`${size === "small" ? "text-sm" : "text-lg"} font-medium text-slate-700`}>
                {name[0].toUpperCase()}
            </span>
        </div>
    );
};

const ClockIcon = () => (
    <svg 
        className="w-4 h-4"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
    </svg>
);

export default BlogCard;