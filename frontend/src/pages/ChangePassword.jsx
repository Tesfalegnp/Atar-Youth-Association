import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiKey } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/api';
import { organizationInfo } from '../data/siteContent';

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current/temporary password is required'),
  newPassword: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Confirm new password'),
});

const ChangePassword = ({ user }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const isMandatory = user?.mustChangePassword;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      const response = await authAPI.updatePassword(values);

      if (response.success) {
        setSuccess('Your password has been changed successfully!');
        setTimeout(() => {
          if (user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/profile', { replace: true });
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed. Please verify your current password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <FiKey className="w-7 h-7" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            {isMandatory ? 'Mandatory Password Change' : 'Update Your Password'}
          </h1>
          
          <p className="text-sm text-slate-600">
            {isMandatory 
              ? 'You logged in using a temporary password. Please create a new secure password before continuing.'
              : 'Choose a strong password for your Atar Youth Association account.'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-5">
              
              <div>
                <label htmlFor="currentPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current / Temporary Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Field
                    type={showCurrent ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    className={`input-field pl-10 pr-10 ${errors.currentPassword && touched.currentPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    placeholder="Enter current or temporary password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Field
                    type={showNew ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    className={`input-field pl-10 pr-10 ${errors.newPassword && touched.newPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Field
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`input-field pl-10 pr-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 flex items-center justify-center font-bold"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Save & Continue'
                )}
              </button>
            </Form>
          )}
        </Formik>

        {!isMandatory && (
          <div className="text-center pt-2 border-t border-slate-100">
            <Link to="/profile" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Return to Profile
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChangePassword;
