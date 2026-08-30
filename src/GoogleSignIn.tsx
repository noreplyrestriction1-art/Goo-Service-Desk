import React from 'react';

export default function GoogleSignIn() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f9', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' }}>
        <div className="profile-section" style={{ marginBottom: '20px' }}>
          <img
            src="/bird.jpg"
            alt="Profile"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <h2>ไตรภาค</h2>
          <p style={{ color: '#5f6368', fontSize: '14px' }}>taiphak25442001@gmail.com</p>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <input
            type="password"
            placeholder="ป้อนรหัสผ่าน"
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #dadce0', boxSizing: 'border-box', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '14px', color: '#3c4043' }}>
            <input type="checkbox" id="show-pass" style={{ marginRight: '8px' }} />
            <label htmlFor="show-pass">แสดงรหัสผ่าน</label>
          </div>
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
