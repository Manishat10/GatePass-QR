import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLabourById, verifyLabour, isAdmin } from '../services/api';

const VerificationPage = () => {
  const { labourId } = useParams();
  const navigate = useNavigate();
  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Check admin status on component mount
  useEffect(() => {
    /**
     * Admin Verification Check
     * 
     * This checks if an admin token exists in localStorage.
     * Note: This is a frontend check for UI purposes only.
     * The backend ALWAYS validates the token and role when verifying labour.
     * 
     * Security: Even if someone modifies localStorage, backend will reject
     * the request if token is invalid or user is not admin.
     */
    setIsAdminUser(isAdmin());
  }, []);

  // Fetch labour details on component mount
  useEffect(() => {
    const fetchLabourDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getLabourById(labourId);
        
        if (response.success) {
          setLabour(response.data);
        } else {
          setError('Failed to fetch labour details');
        }
      } catch (err) {
        setError(err.message || 'Labour not found');
      } finally {
        setLoading(false);
      }
    };

    if (labourId) {
      fetchLabourDetails();
    } else {
      setError('Invalid labour ID');
      setLoading(false);
    }
  }, [labourId]);

  // Handle verification
  const handleVerify = async () => {
    if (!labourId) return;

    // Confirm action
    if (!window.confirm('Are you sure you want to mark this labour as verified?')) {
      return;
    }

    try {
      setVerifying(true);
      setError('');
      setSuccessMessage('');

      const response = await verifyLabour(labourId);

      if (response.success) {
        setSuccessMessage('Labour verified successfully!');
        // Update local state
        setLabour((prev) => ({
          ...prev,
          verificationStatus: 'VERIFIED',
          verifiedAt: response.data.verifiedAt,
        }));
      } else {
        setError('Failed to verify labour');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify labour');
    } finally {
      setVerifying(false);
    }
  };

  // Get photo URL (handle both relative and absolute paths)
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${photoUrl}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="verify-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading labour details...</p>
        </div>
      </div>
    );
  }

  if (error && !labour) {
    return (
      <div className="verify-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-primary"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <div className="verify-card">
        {/* Header Section */}
        <div className="verify-header">
          <div className="verify-title-section">
            <h1 className="verify-title">Labour Verification</h1>
            <p className="verify-subtitle">Identity Verification Portal</p>
          </div>
          <div className={`status-badge-large ${labour.verificationStatus === 'VERIFIED' ? 'status-verified' : 'status-pending'}`}>
            <span className="status-icon">
              {labour.verificationStatus === 'VERIFIED' ? '✓' : '⏳'}
            </span>
            <span className="status-text">{labour.verificationStatus}</span>
          </div>
        </div>

        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-wrapper">
            {labour.photoUrl ? (
              <img
                src={getPhotoUrl(labour.photoUrl)}
                alt={labour.name}
                className="verify-photo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="photo-placeholder"
              style={{ display: labour.photoUrl ? 'none' : 'flex' }}
            >
              <span className="photo-icon">👤</span>
            </div>
            <div className="photo-ring"></div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <div className="info-label">Full Name</div>
              <div className="info-value">{labour.name}</div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📱</div>
            <div className="info-content">
              <div className="info-label">Phone Number</div>
              <div className="info-value">{labour.phone}</div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <div className="info-content">
              <div className="info-label">Email ID</div>
              <div className="info-value">
                {labour.email || <span className="empty-value">Not provided</span>}
              </div>
            </div>
          </div>

          {labour.governmentId && (
            <div className="info-card">
              <div className="info-icon">🆔</div>
              <div className="info-content">
                <div className="info-label">Government ID</div>
                <div className="info-value">{labour.governmentId}</div>
              </div>
            </div>
          )}

          <div className="info-card">
            <div className="info-icon">📅</div>
            <div className="info-content">
              <div className="info-label">Registration Date</div>
              <div className="info-value">{formatDate(labour.createdAt)}</div>
            </div>
          </div>

          {labour.verifiedAt && (
            <div className="info-card">
              <div className="info-icon">✅</div>
              <div className="info-content">
                <div className="info-label">Verified At</div>
                <div className="info-value">{formatDate(labour.verifiedAt)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="action-section">
          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠</span>
              {error}
            </div>
          )}

          {/* 
            Conditional Verification Button Rendering
            - Only show "Mark as Verified" button if user is admin
            - Backend enforces this - even if button is shown, backend will reject non-admin requests
            - For non-admins, status is read-only
          */}
          {labour.verificationStatus === 'PENDING' && isAdminUser && (
            <button
              onClick={handleVerify}
              className="btn btn-verify"
              disabled={verifying}
            >
              {verifying ? (
                <>
                  <span className="btn-spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <span className="btn-icon">✓</span>
                  Mark as Verified
                </>
              )}
            </button>
          )}

          {labour.verificationStatus === 'PENDING' && !isAdminUser && (
            <div className="read-only-notice">
              <span className="notice-icon">ℹ️</span>
              <span>Verification requires admin access. Please contact an administrator.</span>
            </div>
          )}

          {labour.verificationStatus === 'VERIFIED' && (
            <div className="verified-banner">
              <span className="verified-icon">✓</span>
              <span>This labour has been verified</span>
            </div>
          )}

          {/* Admin Login Link for Non-Admins */}
          {!isAdminUser && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                onClick={() => navigate('/admin/login')}
                className="btn btn-admin-link"
              >
                Admin Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;

