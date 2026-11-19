import React from 'react';
import { Search } from 'lucide-react';

const SkillSearch = ({ keyword, setKeyword, category, setCategory, onSearch }) => {
  const categories = ['Technology', 'Languages', 'Music', 'Design', 'Cooking', 'Business', 'Fitness', 'Other'];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search skills, keywords, or topics..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="w-full md:w-48">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SkillSearch;