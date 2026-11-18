
import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonRouterLink,
} from '@ionic/react';

import { useNavigate } from 'react-router-dom';

import Logo from '../../assets/Logo.png';
import { loginUser } from '../../services/authService';

import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await loginUser(
        email.trim(),
        password
      );


      sessionStorage.setItem(
        'access_token',
        result.access_token
      );

      sessionStorage.setItem(
        'token_type',
        result.token_type
      );

      console.log('Login successful');

  
      navigate('/home', { replace: true });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <main className="login-layout">

          <div className="login-brand">
            <img
              src={Logo}
              alt="Tododish Logo"
              className="login-logo"
            />

            <p>Your tasks are waiting for you.</p>
          </div>

      
          <section className="login-card">

            <div className="login-heading">
              <h1>Welcome</h1>
              <p>Sign in to continue your journey.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              <div className="login-field">
                <label htmlFor="login-email">
                  Email
                </label>

                <IonInput
                  id="login-email"
                  className="login-input"
                  type="email"
                  fill="outline"
                  placeholder="Enter your email"
                  value={email}
                  onIonInput={(event) =>
                    setEmail(event.detail.value || '')
                  }
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password">
                  Password
                </label>

                <IonInput
                  id="login-password"
                  className="login-input"
                  type="password"
                  fill="outline"
                  placeholder="Enter your password"
                  value={password}
                  onIonInput={(event) =>
                    setPassword(event.detail.value || '')
                  }
                  required
                />
              </div>

              <div className="forgot-password">
                Forgot Password?
              </div>

              
              {error && (
                <IonText color="danger">
                  <p className="login-message">
                    {error}
                  </p>
                </IonText>
              )}

              <IonButton
                type="submit"
                expand="block"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </IonButton>

            </form>
          </section>


          <div className="signup-link">
            <span>Don't have an account?</span>

            <IonRouterLink
              routerLink="/register"
              className="signup-text"
            >
              Sign Up
            </IonRouterLink>
          </div>

        </main>
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;
