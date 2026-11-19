import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Star } from 'lucide-react';

const SkillCard = ({ skill }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <div>
        {skill.images && skill.images.length > 0 ? (
          <img src={skill.images[0]} alt={skill.title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-indigo-50 flex items-center justify-center text-indigo-400 font-semibold text-lg">
            {skill.category}
          </div>
        )}
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
              {skill.category}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {skill.proficiencyLevel}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{skill.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{skill.description}</p>
        </div>
      </div>
      <div className="px-5 pb-5 pt-0 border-t border-gray-50 flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2 pt-4">
          {skill.owner?.avatar ? (
            <img src={skill.owner.avatar} alt={skill.owner.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-xs">
              {skill.owner?.name?.charAt(0) || 'U'}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">{skill.owner?.name || 'Anonymous'}</span>
        </div>
        <Link
          to={`/skills/${skill._id}`}
          className="mt-4 inline-block bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;