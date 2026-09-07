import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiLayers, FiBookOpen, FiAward, FiSmile, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';
import { keyPrograms, organizationInfo } from '../data/siteContent';
import CTASection from '../components/CTASection';

const iconMap = {
  FiBookOpen,
  FiAward,
  FiSmile,
  FiCheckCircle
};

const Programs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(keyPrograms.map(p => p.category))];

  const filteredPrograms = selectedCategory === 'All' 
    ? keyPrograms 
    : keyPrograms.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-slate-50 space-y-16 lg:space-y-24 pb-12">
      
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Areas of Work
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            Our Programs & Initiatives
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Delivering practical programs in education, youth leadership, peace sports, and community action in South Sudan.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Programs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPrograms.map((program) => {
            const IconComp = iconMap[program.iconName] || FiLayers;
            return (
              <div 
                key={program.id}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                      {program.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-navy-900 mb-3">
                    {program.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {program.fullDesc || program.shortDesc}
                  </p>

                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-xs font-bold text-navy-900 uppercase tracking-wider">Key Components:</div>
                    <ul className="space-y-2">
                      {program.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-center text-xs font-medium text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 flex-shrink-0"></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Target: Youth (15-35)
                  </span>
                  <Link
                    to="/register"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <span>Participate in Program</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <CTASection 
        title="Want to Propose or Support a Community Program?"
        description={`Connect with ${organizationInfo.name} to collaborate on educational, leadership, or peacebuilding initiatives.`}
      />

    </div>
  );
};

export default Programs;
