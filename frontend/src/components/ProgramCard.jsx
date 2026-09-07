import { Link } from 'react-router-dom';
import { 
  FiBookOpen, FiAward, FiSmile, FiCheckCircle, FiArrowRight, FiZap
} from 'react-icons/fi';

const iconMap = {
  FiBookOpen,
  FiAward,
  FiSmile,
  FiCheckCircle,
  FiZap
};

const ProgramCard = ({ program }) => {
  const IconComponent = iconMap[program.iconName] || FiZap;

  return (
    <div className="group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-xs">
            <IconComponent className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            {program.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-primary-600 transition-colors">
          {program.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-5">
          {program.shortDesc}
        </p>

        {program.highlights && program.highlights.length > 0 && (
          <ul className="space-y-2 mb-6">
            {program.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center text-xs font-medium text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 flex-shrink-0"></span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
          {program.status || 'Active'}
        </span>
        <Link 
          to="/programs" 
          className="text-xs font-bold text-primary-600 group-hover:text-primary-700 flex items-center space-x-1"
        >
          <span>Learn More</span>
          <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;
