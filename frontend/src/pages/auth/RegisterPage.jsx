import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonRouterLink,
} from '@ionic/react';

import Logo from '../../assets/Logo.png';
import { registerUser } from '../../services/authService';

import './RegisterPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
      };

      const result = await registerUser(userData);

      console.log('Register successful:', result);

      setSuccess('Account created successfully! Please login.');

      setName('');
      setEmail('');
      setPassword('');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="register-content">
        <main className="register-layout">

          {/* Logo */}
          <div className="register-brand">
            <img
              src={Logo}
              alt="Tododish Logo"
              className="register-logo"
            />
          </div>

          <section className="register-card">

            <div className="register-heading">
              <h1>CREATE ACCOUNT</h1>
              <p>Let's make your days more organized.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >

              <div className="register-field">
                <label htmlFor="register-name">
                  Name
                </label>

                <IonInput
                  id="register-name"
                  className="register-input"
                  type="text"
                  fill="outline"
                  placeholder="Enter Your Name"
                  value={name}
                  onIonInput={(event) =>
                    setName(event.detail.value || '')
                  }
                  minlength={4}
                  maxlength={50}
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="register-email">
                  Email
                </label>

                <IonInput
                  id="register-email"
                  className="register-input"
                  type="email"
                  fill="outline"
                  placeholder="Enter Your Email"
                  value={email}
                  onIonInput={(event) =>
                    setEmail(event.detail.value || '')
                  }
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <IonInput
                  id="register-password"
                  className="register-input"
                  type="password"
                  fill="outline"
                  placeholder="Enter Your Password"
                  value={password}
                  onIonInput={(event) =>
                    setPassword(event.detail.value || '')
                  }
                  minlength={6}
                  maxlength={20}
                  required
                />
              </div>

              {error && (
                <IonText color="danger">
                  <p className="register-error">
                    {error}
                  </p>
                </IonText>
              )}

              {success && (
                <IonText color="success">
                  <p className="register-success">
                    {success}
                  </p>
                </IonText>
              )}

              <IonButton
                type="submit"
                expand="block"
                className="register-button"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </IonButton>

            </form>
          </section>

          <div className="register-login-link">
            <IonRouterLink
              routerLink="/login"
              className="register-login-text"
            >
              Login Account
            </IonRouterLink>
          </div>

        </main>
      </IonContent>
    </IonPage>
  );
}

export default RegisterPage;
