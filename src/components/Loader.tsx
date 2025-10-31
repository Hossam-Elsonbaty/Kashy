const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">
        Loading, please wait...
      </h2>
    </div>
  );
};

export default Loader;
