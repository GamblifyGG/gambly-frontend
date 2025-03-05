const LoadingSmall = ({ className }) => {
    return (
        // tailwind loading spinner with logo
        <div className={`flex justify-center items-center ${className}`}>
            <div className="flex flex-col items-center">
                <img src="/logo-letter.png" alt="G" className="block animate-pulse w-10 h-10" />
                <div className="text-md animate-pulse font-bold">Loading...</div>
            </div>
        </div>
    );
}

export default LoadingSmall;