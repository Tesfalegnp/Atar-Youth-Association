import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiMail, FiPhone, FiMapPin, FiSend, FiArrowUpRight, FiHeart
} from 'react-icons/fi';
import { organizationInfo } from '../data/siteContent';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/60">
          
          {/* Col 1 & 2: Organization Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md overflow-hidden p-1">
                <img 
                  src="/uploads/thumbnails/logo.png" 
                  alt={organizationInfo.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {organizationInfo.name}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A community-driven youth movement in South Sudan dedicated to empowering young people (ages 15–35) through education, leadership development, peacebuilding, and sustainable local community initiatives.
            </p>

            {/* Newsletter Subscription (Frontend Ready) */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Stay Updated With Atar Youth
              </h4>
              {subscribed ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-medium">
                  Thank you for subscribing to our newsletter update!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-3.5 py-2.5 bg-navy-900 border border-navy-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-grow"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center shadow-xs"
                    aria-label="Subscribe to newsletter"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors flex items-center space-x-1.5">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors flex items-center space-x-1.5">
                  <span>About Atar Youth</span>
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-primary-400 transition-colors flex items-center space-x-1.5">
                  <span>Key Programs</span>
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-primary-400 transition-colors flex items-center space-x-1.5">
                  <span>News & Updates</span>
                </Link>
              </li>
              <li>
                <Link to="/get-involved" className="hover:text-primary-400 transition-colors flex items-center space-x-1.5">
                  <span>Get Involved</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors flex items-center space-x-1.5">
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Key Focus Areas */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Areas of Focus
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400 flex items-center space-x-1.5">
                <span>Education & Vocational Training</span>
              </li>
              <li className="text-slate-400 flex items-center space-x-1.5">
                <span>Youth Leadership & Mentorship</span>
              </li>
              <li className="text-slate-400 flex items-center space-x-1.5">
                <span>Peacebuilding & Reconciliation</span>
              </li>
              <li className="text-slate-400 flex items-center space-x-1.5">
                <span>Community Action Projects</span>
              </li>
              <li className="text-slate-400 flex items-center space-x-1.5">
                <span>Civic Engagement</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Verified Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3 text-slate-300">
                <FiMapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>{organizationInfo.location}</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-300">
                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href={`mailto:${organizationInfo.email}`} className="hover:text-primary-400 transition-colors">
                  {organizationInfo.email}
                </a>
              </li>
              <li className="flex items-center space-x-3 text-slate-300">
                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>{organizationInfo.phonePrimary}</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-navy-800/80">
              <Link 
                to="/register" 
                className="inline-flex items-center space-x-1 text-xs font-semibold text-accent-400 hover:text-accent-300 transition-colors"
              >
                <span>Register as a Youth Member</span>
                <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {organizationInfo.name}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Building a resilient future for youth in South Sudan</span>
            <FiHeart className="w-3.5 h-3.5 text-red-500 inline" />
          </p>
          <div className="flex space-x-4">
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Privacy Notice</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
