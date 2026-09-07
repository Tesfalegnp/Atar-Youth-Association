import { useState, useEffect } from 'react';
import { FiGlobe, FiCalendar, FiFileText } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import NewsCard from '../components/NewsCard';
import CTASection from '../components/CTASection';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/news`);
      setNews(response.data?.news || []);
    } catch (error) {
      console.warn('News API fetch error:', error.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 space-y-16 lg:space-y-24 pb-12">
      
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Official Media & Press
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            News & Announcements
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Stay informed with official updates, program releases, and community stories from Atar Youth Association.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-600">Loading publications...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
              <FiFileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">No Published Announcements</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              There are currently no public news posts. Check back soon as administrators publish new articles and activity updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <CTASection />

    </div>
  );
};

export default News;
