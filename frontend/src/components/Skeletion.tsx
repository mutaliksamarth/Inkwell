import Appbar from "./AppBar";

export const BlogSkeleton = () => {
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


const SkeletonPulse = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
  
  export const FullBlogSkeleton = () => {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div className="grid grid-cols-12 px-10 w-full pt-4 max-w-screen-xl">
            <div className="col-span-8 py-12 border-r border-slate-200 pr-12">
              {/* Title skeleton */}
              <SkeletonPulse className="h-16 w-3/4 mb-6" />
              
              {/* Date skeleton */}
              <SkeletonPulse className="h-4 w-40 mb-6" />
              
              {/* Content paragraphs skeleton */}
              <div className="space-y-4">
                <SkeletonPulse className="h-4 w-full" />
                <SkeletonPulse className="h-4 w-full" />
                <SkeletonPulse className="h-4 w-5/6" />
                <SkeletonPulse className="h-4 w-full" />
                <SkeletonPulse className="h-4 w-4/5" />
                <SkeletonPulse className="h-4 w-full" />
                <SkeletonPulse className="h-4 w-3/4" />
              </div>
            </div>
            
            <div className="col-span-4 py-12 pl-12">
              {/* Author section skeleton */}
              <SkeletonPulse className="h-4 w-16 mb-2" />
              
              <div className="flex items-center">
                {/* Avatar skeleton */}
                <div className="mr-4">
                  <SkeletonPulse className="h-16 w-16 rounded-full" />
                </div>
                
                <div className="flex-1">
                  {/* Author name skeleton */}
                  <SkeletonPulse className="h-5 w-32 mb-1" />
                  {/* Bio skeleton */}
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-4/5 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default FullBlogSkeleton;