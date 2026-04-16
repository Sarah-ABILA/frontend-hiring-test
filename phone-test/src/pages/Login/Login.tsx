import * as React from 'react';
import { useToast } from '@aircall/tractor';
import { FormState } from './Login.decl';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const LOGIN_REJECTED = 'LOGIN_REJECTED';

export const LoginPage = () => {
  const { login } = useAuth();
  const [formState, setFormState] = React.useState<FormState>('Idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast, removeToast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormState('Pending');
      await login({ username: email, password });
      removeToast(LOGIN_REJECTED);
    } catch (error) {
      setFormState('Idle');
      showToast({
        id: LOGIN_REJECTED,
        message: 'Invalid email or password',
        variant: 'error'
      });
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Panneau gauche vert */}
      <div style={{
        flex: 1,
        backgroundColor: '#00B388',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        color: 'white'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>A</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px', textAlign: 'center' }}>
          Aircall
        </h1>
        <p style={{ fontSize: '16px', opacity: 1, textAlign: 'center', maxWidth: '280px', lineHeight: 1.6, margin: '0 0 48px' }}>
          The phone system for modern business. Connect your team, delight your customers.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '280px' }}>
          {[
            { icon: '📞', text: 'Crystal clear calls' },
            { icon: '📊', text: 'Real-time analytics' },
            { icon: '🔗', text: '100+ integrations' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                {icon}
              </div>
              <span style={{ fontSize: '14px', opacity: 1 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit blanc */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>
            Sign in to your Aircall account
          </p>

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="job@aircall.io"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#00B388'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#00B388'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'Pending'}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: formState === 'Pending' ? '#7dd9c4' : '#00B388',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: formState === 'Pending' ? 'not-allowed' : 'pointer'
              }}
            >
              {formState === 'Pending' ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
            Any username and password will work for this demo.
          </p>
        </div>
      </div>
    </div>
  );
};
