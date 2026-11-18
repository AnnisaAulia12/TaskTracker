
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IonPage,
  IonContent,
} from '@ionic/react';

import ProfileHeader from '../../components/account/ProfileHeader';
import AccountInformation from '../../components/account/AccountInformation';

import {
  getCurrentUser,
  deleteAccount,
} from '../../services/authService';

import './AccountPage.css';

function AccountPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Load Profile
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const token = sessionStorage.getItem('access_token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const result = await getCurrentUser();

        if (isMounted) {
          setUser(result);
          setError('');
        }
      } catch (err) {
        if (!isMounted) return;

        if (err.status === 401) {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('token_type');

          navigate('/login', { replace: true });
        } else {
          setError(err.message || 'Failed to load profile.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    const confirmed = window.confirm(
      'Are you sure you want to logout?'
    );

    if (!confirmed) return;

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('token_type');

    navigate('/login', { replace: true });
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? All your tasks will also be deleted. This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError('');

      await deleteAccount();

      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('token_type');

      navigate('/login', { replace: true });
    } catch (err) {
      if (err.status === 401) {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('token_type');

        navigate('/login', { replace: true });
      } else {
        setError(err.message || 'Failed to delete account.');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="account-content"
      >
        <main className="account-layout">

          <h1 className="account-title">
            Profile
          </h1>

          {loading ? (
            <div className="account-message">
              Loading profile...
            </div>
          ) : error && !user ? (
            <div className="account-message account-error">
              {error}
            </div>
          ) : user ? (
            <>
              <ProfileHeader user={user} />

              <AccountInformation user={user} />

              {error && (
                <p className="account-error">
                  {error}
                </p>
              )}

              <div className="account-actions">
                <button
                  type="button"
                  className="account-logout-button"
                  onClick={handleLogout}
                  disabled={deleting}
                >
                  Logout
                </button>

                <button
                  type="button"
                  className="account-delete-button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </>
          ) : null}

        </main>
      </IonContent>
    </IonPage>
  );
}

export default AccountPage;
