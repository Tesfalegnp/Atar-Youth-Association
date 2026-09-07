import { FiCheckCircle } from 'react-icons/fi';

const ImpactCard = ({ pillar }) => {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-primary-100/80 text-primary-700 rounded-xl">
          <FiCheckCircle className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-accent-50 text-accent-700 border border-accent-200 rounded-full">
          {pillar.badge}
        </span>
      </div>

      <h4 className="text-lg font-bold text-navy-900 mb-2">
        {pillar.title}
      </h4>

      <p className="text-slate-600 text-sm leading-relaxed">
        {pillar.description}
      </p>
    </div>
  );
};

export default ImpactCard;
