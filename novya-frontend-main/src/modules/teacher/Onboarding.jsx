import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_CONFIG, djangoAPI } from '../../config/api';
import { toast } from 'react-toastify';
import './Onboarding.css';

const AccountOnboarding = () => {
  const { t } = useTranslation();

  // State for accounts - will be loaded from API
  const [accounts, setAccounts] = useState([]);

  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage, setAccountsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending registrations from API
  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setIsLoading(true);
      const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.ONBOARDING_PENDING);
      
      console.log('📋 Onboarding API Response:', response);
      
      // Check for debug info
      if (response.debug) {
        console.log('🔍 Debug Info:', response.debug);
        console.log(`   Teacher School: ${response.debug.teacher_school}`);
        console.log(`   Teacher Grade: ${response.debug.teacher_grade}`);
        console.log(`   Total Pending Students: ${response.debug.total_pending_students}`);
        console.log(`   Matching Students: ${response.debug.matching_students}`);
      }
      
      // Transform API response to match component structure
      const transformedAccounts = (response.registrations || []).map(reg => ({
        id: reg.id,
        name: reg.name,
        email: reg.email,
        phone: reg.phone || '',
        scholar: reg.school || '',
        registrationDate: reg.registrationDate,
        status: reg.status,
        type: reg.type
      }));
      
      console.log(`✅ Loaded ${transformedAccounts.length} registrations`);
      
      setAccounts(transformedAccounts);
      setFilteredAccounts(transformedAccounts);
      
      // Show warning if no registrations but there are pending students
      if (transformedAccounts.length === 0 && response.debug && response.debug.total_pending_students > 0) {
        toast.warning(`No registrations match your school/grade. Found ${response.debug.total_pending_students} pending students total.`);
      }
    } catch (error) {
      console.error('❌ Error fetching pending registrations:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load pending registrations';
      const debugInfo = error.response?.data?.debug;
      
      if (debugInfo) {
        console.error('Debug Info:', debugInfo);
        if (errorMessage.includes('incomplete')) {
          toast.error(`${errorMessage} Please update your teacher profile.`);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
      
      setAccounts([]);
      setFilteredAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats calculation
  const pendingCount = accounts.filter(acc => acc.status === 'pending').length;
  const approvedCount = accounts.filter(acc => acc.status === 'approved').length;
  const rejectedCount = accounts.filter(acc => acc.status === 'rejected').length;
  const studentCount = accounts.filter(acc => acc.type === 'student').length;
  const parentCount = accounts.filter(acc => acc.type === 'parent').length;

  // Filter accounts based on search, type, and status
  useEffect(() => {
    let result = accounts;

    if (searchTerm) {
      result = result.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.scholar.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(account => account.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      result = result.filter(account => account.status === selectedStatus);
    }

    setFilteredAccounts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedType, selectedStatus, accounts]);

  // Handle account approval
  const handleApprove = async (id, type) => {
    try {
      const response = await djangoAPI.post(API_CONFIG.DJANGO.AUTH.ONBOARDING_APPROVE, {
        id: id,
        type: type
      });
      
      toast.success(response.message || 'Registration approved successfully');
      
      // Update the account status to 'approved' instead of removing it
      setAccounts(accounts.map(account => 
        account.id === id ? { ...account, status: 'approved' } : account
      ));
      setSelectedAccounts(selectedAccounts.filter(accId => accId !== id));
      
      // Refresh the list to get updated data
      fetchPendingRegistrations();
    } catch (error) {
      console.error('Error approving registration:', error);
      toast.error(error.response?.data?.error || 'Failed to approve registration');
    }
  };

  // Handle account rejection
  const handleReject = async (id, type) => {
    try {
      const response = await djangoAPI.post(API_CONFIG.DJANGO.AUTH.ONBOARDING_REJECT, {
        id: id,
        type: type
      });
      
      toast.success(response.message || 'Registration rejected and deleted');
      
      // Remove from accounts list (it's deleted)
      setAccounts(accounts.filter(account => account.id !== id));
      setSelectedAccounts(selectedAccounts.filter(accId => accId !== id));
      
      // Refresh the list
      fetchPendingRegistrations();
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast.error(error.response?.data?.error || 'Failed to reject registration');
    }
  };

  // Handle bulk approval
  const handleBulkApprove = async () => {
    try {
      const approvePromises = selectedAccounts.map(accId => {
        const account = accounts.find(acc => acc.id === accId);
        if (account) {
          return djangoAPI.post(API_CONFIG.DJANGO.AUTH.ONBOARDING_APPROVE, {
            id: accId,
            type: account.type
          });
        }
        return Promise.resolve();
      });
      
      await Promise.all(approvePromises);
      toast.success('All selected registrations approved successfully');
      
      // Refresh the list
      setSelectedAccounts([]);
      fetchPendingRegistrations();
    } catch (error) {
      console.error('Error bulk approving registrations:', error);
      toast.error('Failed to approve some registrations');
    }
  };

  // Handle bulk rejection
  const handleBulkReject = async () => {
    try {
      const rejectPromises = selectedAccounts.map(accId => {
        const account = accounts.find(acc => acc.id === accId);
        if (account) {
          return djangoAPI.post(API_CONFIG.DJANGO.AUTH.ONBOARDING_REJECT, {
            id: accId,
            type: account.type
          });
        }
        return Promise.resolve();
      });
      
      await Promise.all(rejectPromises);
      toast.success('All selected registrations rejected and deleted');
      
      // Refresh the list
      setSelectedAccounts([]);
      fetchPendingRegistrations();
    } catch (error) {
      console.error('Error bulk rejecting registrations:', error);
      toast.error('Failed to reject some registrations');
    }
  };

  // Toggle select all accounts on current page
  const toggleSelectAll = () => {
    const currentPageAccountIds = currentAccounts.map(account => account.id);

    if (selectedAccounts.length === currentPageAccountIds.length) {
      // Deselect all
      setSelectedAccounts([]);
    } else {
      // Select all on current page
      setSelectedAccounts([...new Set([...selectedAccounts, ...currentPageAccountIds])]);
    }
  };

  // Toggle individual account selection
  const toggleAccountSelection = (id) => {
    if (selectedAccounts.includes(id)) {
      setSelectedAccounts(selectedAccounts.filter(accountId => accountId !== id));
    } else {
      setSelectedAccounts([...selectedAccounts, id]);
    }
  };

  // Pagination logic
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      case 'pending': return 'status-badge status-pending';
      default: return 'status-badge';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return t('accountOnboarding.actions.approved');
      case 'rejected': return t('accountOnboarding.actions.rejected');
      case 'pending': return t('accountOnboarding.filters.pending');
      default: return status;
    }
  };

  return (
    <div className="account-onboarding">
      <header className="page-header">
        <h1>{t('accountOnboarding.title')}</h1>
        <p>{t('accountOnboarding.subtitle')}</p>
      </header>

      <div className="stats-container">
        <div className="stat-card stat-pending">
          <h3>{t('accountOnboarding.stats.pending')}</h3>
          <p className="stat-count">{pendingCount}</p>
        </div>
        <div className="stat-card stat-approved">
          <h3>{t('accountOnboarding.stats.approved')}</h3>
          <p className="stat-count">{approvedCount}</p>
        </div>
        <div className="stat-card stat-rejected">
          <h3>{t('accountOnboarding.stats.rejected')}</h3>
          <p className="stat-count">{rejectedCount}</p>
        </div>
        <div className="stat-card stat-total">
          <h3>{t('accountOnboarding.stats.totalAccounts')}</h3>
          <p className="stat-count">{accounts.length}</p>
          <div className="stat-sub">
            <span className="student-count">{studentCount} {t('accountOnboarding.stats.students')}</span>
            <span className="parent-count">{parentCount} {t('accountOnboarding.stats.parents')}</span>
          </div>
        </div>
      </div>

      <div className="controls-container">
        <div className="search-box">
          <i className="search-icon">🔍</i>
          <input
            type="text"
            placeholder={t('accountOnboarding.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>{t('accountOnboarding.filters.type')}:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">{t('accountOnboarding.filters.allTypes')}</option>
              <option value="student">{t('accountOnboarding.filters.student')}</option>
              <option value="parent">{t('accountOnboarding.filters.parent')}</option>
            </select>
          </div>

          <div className="filter-group">
            <label>{t('accountOnboarding.filters.status')}:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">{t('accountOnboarding.filters.allStatus')}</option>
              <option value="pending">{t('accountOnboarding.filters.pending')}</option>
              <option value="approved">{t('accountOnboarding.filters.approved')}</option>
              <option value="rejected">{t('accountOnboarding.filters.rejected')}</option>
            </select>
          </div>

          <div className="show-entries">
            <label>{t('accountOnboarding.filters.show')}:</label>
            <select
              value={accountsPerPage}
              onChange={(e) => setAccountsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {selectedAccounts.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedAccounts.length} {t('accountOnboarding.bulkActions.selected')}</span>
          <button className="btn-approve" onClick={handleBulkApprove}>
            {t('accountOnboarding.bulkActions.approve')}
          </button>
          <button className="btn-reject" onClick={handleBulkReject}>
            {t('accountOnboarding.bulkActions.reject')}
          </button>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell select-cell">
              <input
                type="checkbox"
                checked={currentAccounts.length > 0 && selectedAccounts.length === currentAccounts.length}
                onChange={toggleSelectAll}
              />
            </div>
            <div className="table-cell name-cell">{t('accountOnboarding.table.nameRole')}</div>
            <div className="table-cell contact-cell">{t('accountOnboarding.table.contactInfo')}</div>
            <div className="table-cell scholar-cell">{t('accountOnboarding.table.school')}</div>
            <div className="table-cell date-cell">{t('accountOnboarding.table.registrationDate')}</div>
            <div className="table-cell status-cell">{t('accountOnboarding.table.status')}</div>
            <div className="table-cell actions-cell">{t('accountOnboarding.table.actions')}</div>
          </div>
        </div>

        <div className="table-body">
          {isLoading ? (
            <div className="no-results">
              <p>Loading registrations...</p>
            </div>
          ) : currentAccounts.length > 0 ? (
            currentAccounts.map(account => (
              <div className="table-row" key={account.id}>
                <div className="table-cell select-cell">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => toggleAccountSelection(account.id)}
                  />
                </div>
                <div className="table-cell name-cell">
                  <div className="account-name">{account.name}</div>
                  <div className="account-role">
                    {account.type === 'student' ? t('accountOnboarding.filters.student') : 
                     account.type === 'parent' ? t('accountOnboarding.filters.parent') : 
                     'Teacher'}
                  </div>
                </div>
                <div className="table-cell contact-cell">
                  <div className="account-email">{account.email}</div>
                  <div className="account-phone">{account.phone}</div>
                </div>
                <div className="table-cell scholar-cell">
                  <div className="account-scholar">{account.scholar}</div>
                </div>
                <div className="table-cell date-cell">
                  {formatDate(account.registrationDate)}
                </div>
                <div className="table-cell status-cell">
                  <span className={getStatusBadgeClass(account.status)}>
                    {getStatusText(account.status)}
                  </span>
                </div>
                <div className="table-cell actions-cell">
                  {account.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-approve"
                        onClick={() => handleApprove(account.id, account.type)}
                      >
                        {t('accountOnboarding.actions.approve')}
                      </button>
                      <button
                        className="btn-action btn-reject"
                        onClick={() => handleReject(account.id, account.type)}
                      >
                        {t('accountOnboarding.actions.reject')}
                      </button>
                    </div>
                  )}
                  {account.status === 'approved' && (
                    <span className="action-text">{t('accountOnboarding.actions.approved')}</span>
                  )}
                  {account.status === 'rejected' && (
                    <span className="action-text">{t('accountOnboarding.actions.rejected')}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>{t('accountOnboarding.messages.noResults')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          {t('accountOnboarding.pagination.showing')} {indexOfFirstAccount + 1} {t('accountOnboarding.pagination.to')} {Math.min(indexOfLastAccount, filteredAccounts.length)} {t('accountOnboarding.pagination.of')} {filteredAccounts.length} {t('accountOnboarding.pagination.accounts')}
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {t('accountOnboarding.pagination.previous')}
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first, last, current, and pages around current
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                return false;
              })
              .map((page, index, array) => {
                // Add ellipsis for skipped pages
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="ellipsis">...</span>
                      <button
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {t('accountOnboarding.pagination.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountOnboarding;

