import { useState } from 'react';
import { 
  FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiCheckCircle, FiHelpCircle
} from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { organizationInfo } from '../data/siteContent';

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  subject: Yup.string()
    .min(3, 'Subject must be at least 3 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message content is required'),
});

const Contact = () => {
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Simulate form submission feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubmittedSuccess(true);
      resetForm();
      setTimeout(() => setSubmittedSuccess(false), 6000);
    } catch (error) {
      console.error('Contact submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Who can join Atar Youth Association?',
      a: 'Any young person aged 15 to 35 in South Sudan interested in educational workshops, community leadership, and peacebuilding can register as a member.'
    },
    {
      q: 'Where is the main office located?',
      a: `${organizationInfo.address.street}, ${organizationInfo.address.city}, ${organizationInfo.address.state}, ${organizationInfo.address.country}.`
    },
    {
      q: 'How can our NGO or company partner with Atar Youth Association?',
      a: 'We welcome collaborative partnerships in education, skills development, and civic programs. Send us a message via the form above or email info@ataryouth.org.'
    }
  ];

  return (
    <div className="bg-slate-50 space-y-16 lg:space-y-24 pb-12">
      
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            Contact Atar Youth
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions about our programs, membership, or partnership opportunities? Send us a message below.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Form Area (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">
              Send Us a Message
            </h2>

            {submittedSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-sm font-medium">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Thank you! Your message has been sent successfully. Our team will get back to you shortly.</span>
              </div>
            )}

            <Formik
              initialValues={{ name: '', email: '', subject: '', message: '' }}
              validationSchema={ContactSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`input-field ${
                        errors.name && touched.name ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      placeholder="e.g. Deng Mabior"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`input-field ${
                        errors.email && touched.email ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      placeholder="name@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      id="subject"
                      name="subject"
                      className={`input-field ${
                        errors.subject && touched.subject ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      placeholder="e.g. Program Inquiry / Membership"
                    />
                    <ErrorMessage
                      name="subject"
                      component="div"
                      className="text-red-500 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows="5"
                      className={`input-field ${
                        errors.message && touched.message ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      placeholder="Write your message details here..."
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-500 text-xs mt-1 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-3.5"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Contact Details Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">
                Verified Contact Info
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Head Office</h3>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      {organizationInfo.address.street}<br />
                      {organizationInfo.address.city}, {organizationInfo.address.state}<br />
                      {organizationInfo.address.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Email Addresses</h3>
                    <p className="text-slate-600 mt-0.5">{organizationInfo.email}</p>
                    <p className="text-slate-600">{organizationInfo.adminEmail}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Phone Contact</h3>
                    <p className="text-slate-600 mt-0.5">{organizationInfo.phonePrimary}</p>
                    <p className="text-slate-600">{organizationInfo.phoneSecondary}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">Office Working Hours</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mt-0.5">
                      {organizationInfo.officeHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Box */}
            <div className="bg-navy-900 text-white rounded-3xl p-6 border border-navy-800 shadow-md space-y-4">
              <div className="flex items-center space-x-2 text-accent-400 font-bold text-sm">
                <FiHelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs space-y-1">
                    <div className="font-bold text-white">{faq.q}</div>
                    <div className="text-slate-300 leading-relaxed">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;