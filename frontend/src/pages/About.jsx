import { Link } from 'react-router-dom';
import { 
  FiUsers, FiTarget, FiAward, FiHeart, 
  FiShield, FiZap, FiCheckCircle, FiGlobe
} from 'react-icons/fi';
import { organizationInfo, missionVisionValues } from '../data/siteContent';
import CTASection from '../components/CTASection';

const About = () => {
  return (
    <div className="bg-slate-50 space-y-16 lg:space-y-24 pb-12">
      
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Organizational Profile
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            About {organizationInfo.name}
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Empowering South Sudanese youth through education, skills development, peacebuilding, and community engagement.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Who We Are Overview */}
        <section className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-100 shadow-sm space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            <FiGlobe className="w-4 h-4" />
            <span>Serving South Sudan</span>
          </div>

          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Who We Are
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
            <p>
              Atar Youth Association is a youth-focused organization established in South Sudan to address the social, educational, and economic challenges confronting young people. Recognizing that youth constitute the majority of the population and represent the future foundation of the country, our organization provides a unified platform for positive youth action.
            </p>
            <p>
              Through structured programs in vocational capability development, ethical leadership training, and local peace initiatives, Atar Youth Association supports young women and men (ages 15–35) to become productive, peaceful, and active contributors to community welfare.
            </p>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
              <FiTarget className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              {missionVisionValues.mission}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <FiAward className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              {missionVisionValues.vision}
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="section-title">Our Guiding Values</h2>
            <p className="section-subtitle">
              The core principles that shape our work, culture, and community interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionVisionValues.values.map((val, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
                <div className="w-10 h-10 bg-slate-100 text-primary-600 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-navy-900 text-lg">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Beneficiaries & Focus Communities */}
        <section className="bg-navy-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
              Community Engagement
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              Target Communities & Participants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
              <FiUsers className="w-8 h-8 text-primary-400" />
              <h3 className="font-bold text-lg text-white">Youth (Ages 15–35)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Young people seeking leadership opportunities, educational support, digital skills, and vocational mentorship.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
              <FiHeart className="w-8 h-8 text-accent-400" />
              <h3 className="font-bold text-lg text-white">Vulnerable Groups</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritizing inclusion for young women, disabled youth, and displaced community members in capacity-building programs.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
              <FiShield className="w-8 h-8 text-emerald-400" />
              <h3 className="font-bold text-lg text-white">Local Stakeholders</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Engaging community elders, local institutions, and partner NGOs in Juba and across Central Equatoria, South Sudan.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* CTA */}
      <CTASection />

    </div>
  );
};

export default About;