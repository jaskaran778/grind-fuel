import React from "react";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function MobileFilters({
  isOpen,
  onClose,
  categories,
  activeCategory,
  setActiveCategory,
}: MobileFiltersProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-sm">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Filter Products</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                activeCategory === category
                  ? "bg-[#16db65] text-black font-bold"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveCategory(category);
                onClose();
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
