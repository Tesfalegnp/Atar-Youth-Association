import { Link } from 'react-router-dom';
import { FiCalendar, FiArrowRight, FiFileText } from 'react-icons/fi';

const NewsCard = ({ item }) => {
  const formattedDate = item?.created_at
    ? new Date(item.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recent Announcement';

  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-xs font-medium text-primary-600 mb-3">
          <FiCalendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-semibold">Atar Youth Update</span>
        </div>

        <h3 className="text-lg font-bold text-navy-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {item.content}
        </p>
      </div>

      <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center space-x-1 text-xs text-slate-500">
          <FiFileText className="w-3.5 h-3.5" />
          <span>Official News</span>
        </span>
        <Link 
          to="/news" 
          className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center space-x-1"
        >
          <span>Read Story</span>
          <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default NewsCard;
