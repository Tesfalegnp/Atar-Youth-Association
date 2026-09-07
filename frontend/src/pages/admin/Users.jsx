import { useState, useEffect } from 'react';
import { 
  FiUsers, FiSearch, FiFilter, FiRefreshCw, 
  FiCheckCircle, FiXCircle, FiKey, FiShield, FiUserCheck, FiEye
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const data = await adminAPI.getUsers(params);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await adminAPI.updateUserStatus(userId, newStatus);
      if (res.success) {
        setActionMessage(res.message);
        setTimeout(() => setActionMessage(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      if (res.success) {
        setActionMessage(res.message);
        setTimeout(() => setActionMessage(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Role change error:', err);
    }
  };

  const handleAdminResetPassword = async (user) => {
    try {
      setSelectedUser(user);
      const res = await adminAPI.resetUserPassword(user.id);
      if (res.success) {
        setTempPasswordResult(res.temporaryPassword || 'Reset initiated');
        setResetModalOpen(true);
        fetchUsers();
      }
    } catch (err) {
      console.error('Admin password reset error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 flex items-center space-x-2">
            <FiUsers className="text-primary-600" />
            <span>Member Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View, approve, filter, update member roles, and manage credentials.
          </p>
        </div>

        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-2 self-start md:self-auto"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="input-field pl-10 text-xs py-2.5"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center space-x-2">
          <FiShield className="text-slate-400 text-sm" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field text-xs py-2.5"
          >
            <option value="">All Roles</option>
            <option value="user">User / Member</option>
            <option value="officer">Officer</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <FiFilter className="text-slate-400 text-sm" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-xs py-2.5"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 font-medium">Loading member directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <FiUsers className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-sm">No member accounts match your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-navy-900">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          <img
                            src={u.profile_photo_url ? (u.profile_photo_url.startsWith('http') ? u.profile_photo_url : `/uploads${u.profile_photo_url}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name || 'U')}&background=0284c7&color=fff`}
                            alt={u.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.full_name || 'No Profile Name'}</div>
                          <div className="text-[11px] text-slate-400">ID #{u.id} • Registered {new Date(u.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>{u.email}</div>
                      <div className="text-slate-400">{u.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>{u.county || 'N/A'}</div>
                      <div className="text-slate-400">{u.payam || 'N/A'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="officer">Officer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={u.status}
                        onChange={(e) => handleStatusChange(u.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none border ${
                          u.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : u.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setDetailModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleAdminResetPassword(u)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <FiKey className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-lg">Member Details</h3>
              <button onClick={() => setDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiXCircle size={22} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border">
                  <img
                    src={selectedUser.profile_photo_url ? (selectedUser.profile_photo_url.startsWith('http') ? selectedUser.profile_photo_url : `/uploads${selectedUser.profile_photo_url}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.full_name || 'U')}&background=0284c7&color=fff`}
                    alt={selectedUser.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-base text-navy-900">{selectedUser.full_name}</div>
                  <div className="text-slate-500">{selectedUser.email}</div>
                  <div className="text-slate-500">{selectedUser.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div><strong>County:</strong> {selectedUser.county || 'N/A'}</div>
                <div><strong>Payam:</strong> {selectedUser.payam || 'N/A'}</div>
                <div><strong>Gender:</strong> {selectedUser.gender || 'N/A'}</div>
                <div><strong>DOB:</strong> {selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Must Change Password:</strong> {selectedUser.must_change_password ? 'Yes (True)' : 'No (False)'}</div>
                <div><strong>Last Login:</strong> {selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString() : 'Never'}</div>
              </div>

              {selectedUser.bio && (
                <div>
                  <strong className="block mb-1">Bio:</strong>
                  <p className="bg-slate-50 p-2.5 rounded-lg border text-slate-600">{selectedUser.bio}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Result Modal */}
      {resetModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-900 text-base">Password Reset Result</h3>
              <button onClick={() => setResetModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiXCircle size={22} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              The password for <strong>{selectedUser.full_name || selectedUser.email}</strong> has been reset.
            </p>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1">
              <div className="font-bold text-amber-900">New Temporary Password:</div>
              <code className="text-sm font-extrabold text-amber-800 bg-amber-100 px-2 py-1 rounded block text-center">
                {tempPasswordResult}
              </code>
              <p className="text-[11px] text-amber-700 pt-1">
                A notification email has been dispatched. The member will be required to change this password upon their next login.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
