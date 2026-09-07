import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/api';
import { organizationInfo } from '../data/siteContent';

const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

const ForgotPassword = () => {
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSubmittedMessage('');
      const response = await authAPI.forgotPassword(values.email);
      if (response.success) {
        setSubmittedMessage(response.message || 'If an account matches the email provided, password reset instructions have been sent.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-navy-900 to-primary-600 rounded-xl flex items-center justify-center shadow-md p-1">
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
            <span className="font-extrabold text-xl text-navy-900 tracking-tight">
              {organizationInfo.shortName}
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-sm text-slate-600">
            Enter your registered email address below. If an account is found, password reset instructions will be sent.
          </p>
        </div>

        {submittedMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiCheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!submittedMessage && (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registered Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`input-field pl-10 ${errors.email && touched.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                      placeholder="member@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 flex items-center justify-center font-bold"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link to="/login" className="inline-flex items-center space-x-1 text-sm font-bold text-slate-600 hover:text-slate-900">
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
