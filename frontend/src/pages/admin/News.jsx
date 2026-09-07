import { useState, useEffect } from 'react';
import { 
  FiFileText, FiPlus, FiEdit2, FiTrash2, 
  FiGlobe, FiCheckCircle, FiXCircle, FiRefreshCw, FiEye
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', status: 'draft' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getNews();
      setNews(data.news || []);
    } catch (err) {
      console.error('Fetch news error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData({ title: '', content: '', status: 'draft' });
    setModalOpen(true);
  };

  const handleOpenEditModal = (article) => {
    setEditingArticle(article);
    setFormData({ title: article.title, content: article.content, status: article.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        const res = await adminAPI.updateNews(editingArticle.id, formData);
        if (res.success) {
          setMessage(res.message);
          setModalOpen(false);
          fetchNews();
        }
      } else {
        const res = await adminAPI.createNews(formData);
        if (res.success) {
          setMessage(res.message);
          setModalOpen(false);
          fetchNews();
        }
      }
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('News submit error:', err);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const res = await adminAPI.togglePublishNews(id, newStatus);
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => setMessage(''), 4000);
        fetchNews();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    try {
      const res = await adminAPI.deleteNews(id);
      if (res.success) {
        setMessage('News article deleted successfully');
        setTimeout(() => setMessage(''), 4000);
        fetchNews();
      }
    } catch (err) {
      console.error('Delete news error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 flex items-center space-x-2">
            <FiFileText className="text-primary-600" />
            <span>News & Announcements Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, publish, or draft official organization news posts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchNews}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button 
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 font-medium">Loading news articles...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <FiFileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-sm">No news articles found. Click "Create Article" to publish news.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-navy-900 max-w-xs truncate">
                      {item.title}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.author_name || 'Admin'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleTogglePublish(item.id, item.status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          item.status === 'published' 
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                        }`}
                      >
                        {item.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Article"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Article"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-lg">
                {editingArticle ? 'Edit Article' : 'Create News Article'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiXCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Youth Empowerment Workshop Announced in Juba"
                  className="input-field text-xs py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Content *</label>
                <textarea
                  required
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write article details here..."
                  className="input-field text-xs py-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Publication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field text-xs py-2.5"
                >
                  <option value="draft">Save as Draft (Private)</option>
                  <option value="published">Publish (Publicly Visible)</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold"
                >
                  {editingArticle ? 'Save Changes' : 'Submit Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default News;
