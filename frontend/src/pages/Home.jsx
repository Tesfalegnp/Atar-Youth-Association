import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiUsers, FiAward, FiShield, 
  FiZap, FiGlobe, FiCheckCircle, FiBookOpen
} from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import { 
  organizationInfo, 
  missionVisionValues, 
  keyPrograms, 
  impactPillars 
} from '../data/siteContent';
import ProgramCard from '../components/ProgramCard';
import ImpactCard from '../components/ImpactCard';
import NewsCard from '../components/NewsCard';
import CTASection from '../components/CTASection';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/news?limit=3`);
      setNews(response.data?.news || []);
    } catch (error) {
      console.warn('Backend news unavailable or empty:', error.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 space-y-16 lg:space-y-24 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow & Mesh Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
          <div className="absolute top-10 left-10 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Country Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-primary-200">
                <FiGlobe className="w-4 h-4 text-accent-400" />
                <span>{organizationInfo.name} • {organizationInfo.country}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Empowering Youth.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-sky-300 to-amber-300">
                  Building Futures.
                </span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                {organizationInfo.tagline} We equip young people across South Sudan with education, leadership tools, vocational skills, and peacebuilding opportunities.
              </p>

              {/* Call-to-action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/30 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Join Our Youth Network</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/about"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                >
                  <span>Learn About Us</span>
                </Link>
              </div>

              {/* Verified Key Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-slate-300 text-xs sm:text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <FiUsers className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span>Youth Aged 15–35</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiBookOpen className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  <span>Skills & Education</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiShield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Peacebuilding</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Section */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Glass Box */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  
                  <div className="flex items-center space-x-4 pb-4 border-b border-white/10">
                    <div className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-sky-400 rounded-2xl flex items-center justify-center shadow-md">
                      <img 
                        src="/uploads/thumbnails/logo.png" 
                        alt={organizationInfo.name} 
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-lg">
                        {organizationInfo.shortName}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {organizationInfo.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <FiZap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Our Core Purpose</div>
                        <div className="text-xs text-slate-300">Empowering youth for community growth and sustainable development.</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <FiAward className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Leadership Development</div>
                        <div className="text-xs text-slate-300">Nurturing young, responsible leaders in South Sudan.</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/get-involved"
                      className="w-full block text-center py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
                    >
                      Get Involved Today
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* MISSION, VISION & VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
            About Our Organization
          </span>
          <h2 className="section-title mt-3">
            Guided by Purpose and Community Values
          </h2>
          <p className="section-subtitle">
            Atar Youth Association operates with transparent values and a clear mandate to serve young people in South Sudan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">
              <FiZap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {missionVisionValues.mission}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">
              <FiAward className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {missionVisionValues.vision}
            </p>
          </div>

        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionVisionValues.values.map((val, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="font-bold text-navy-900 text-lg">{val.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* KEY PROGRAMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
            What We Do
          </span>
          <h2 className="section-title mt-3">
            Our Core Programs & Focus Areas
          </h2>
          <p className="section-subtitle">
            Initiatives designed to provide real opportunities, skills, and community dialogue for youth across South Sudan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>


      {/* QUALITATIVE IMPACT PILLARS */}
      <section className="bg-navy-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
              Community Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Pillars of Youth Transformation
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto mt-2">
              Our holistic approach focuses on sustainable youth growth, civic unity, and leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactPillars.map((pillar, idx) => (
              <ImpactCard key={idx} pillar={pillar} />
            ))}
          </div>
        </div>
      </section>


      {/* LATEST NEWS & ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
              Updates
            </span>
            <h2 className="section-title mt-3 mb-0">
              Latest News & Announcements
            </h2>
          </div>
          
          <Link 
            to="/news" 
            className="mt-4 md:mt-0 text-sm font-bold text-primary-600 hover:text-primary-700 inline-flex items-center space-x-1"
          >
            <span>View All News & Announcements</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading organization updates...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center max-w-2xl mx-auto space-y-3">
            <FiGlobe className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-navy-900 text-lg">No News Publications Yet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official news items and project announcements will be displayed here as they are published by organization administrators.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>


      {/* CALL TO ACTION */}
      <CTASection />

    </div>
  );
};

export default Home;