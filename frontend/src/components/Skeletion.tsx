const BlogSkeleton = () => {
    return (
        <div className="animate-pulse p-6 border border-slate-200 rounded-lg max-w-screen-md">
            <div className="flex items-center space-x-3">
                {/* Avatar skeleton */}
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                {/* Author name skeleton */}
                <div className="h-4 w-24 bg-slate-200 rounded-full" />
                {/* Circle */}
                <div className="h-1 w-1 bg-slate-200 rounded-full" />
                {/* Date skeleton */}
                <div className="h-4 w-32 bg-slate-200 rounded-full" />
            </div>
            
            {/* Title skeleton */}
            <div className="mt-4 space-y-2">
                <div className="h-6 w-3/4 bg-slate-200 rounded-full" />
            </div>
            
            {/* Content skeleton */}
            <div className="mt-3 space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded-full" />
                <div className="h-4 w-full bg-slate-200 rounded-full" />
                <div className="h-4 w-2/3 bg-slate-200 rounded-full" />
            </div>
            
            {/* Read time skeleton */}
            <div className="flex items-center mt-4 pt-4 border-t border-slate-100">
                <div className="h-4 w-24 bg-slate-200 rounded-full" />
            </div>
        </div>
    );
};

// Update your loading state to show multiple skeletons
export const LoadingState = () => {
    return (
        <div className="space-y-4 max-w-screen-md mx-auto p-4">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
        </div>
    );
};
