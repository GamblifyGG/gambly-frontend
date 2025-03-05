const Loading = () => {
    return (
        // tailwind loading spinner with logo
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
                <img src="/logo-letter.png" alt="G" className="block w-20 h-20" />
                <div className="text-2xl font-bold">Loading...</div>
            </div>
        </div>
    );
}




export default Loading;