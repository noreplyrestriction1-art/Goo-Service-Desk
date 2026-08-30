import React from 'react';
import './GoogleSignIn.css';

export default function GoogleSignIn() {
  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="profile-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="./bird.jpg" 
            alt="Profile" 
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              objectFit: 'cover' 
            }} 
          />
          <h2>ไตรภาค</h2>
          <p>taiphak25442001@gmail.com</p>
        </div>

        <div className="form-group">
          <input 
            type="password" 
            placeholder="ป้อนรหัสผ่าน" 
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <label style={{ display: 'block', marginBottom: '20px' }}>
            <input type="checkbox" /> แสดงรหัสผ่าน
          </label>
          <button style={{ width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px' }}>
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
