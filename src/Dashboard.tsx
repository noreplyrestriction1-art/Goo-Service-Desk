import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state?.account;

  return (
    <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '28px', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ fontSize: '24px', color: '#1f1f1f' }}>เข้าสู่ระบบสำเร็จ!</h1>
      <p style={{ color: '#444746' }}>ยินดีต้อนรับคุณ {account?.name || 'ผู้ใช้งาน'}</p>
      <p style={{ fontSize: '14px', color: '#5f6368' }}>{account?.email}</p>
      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '20px', background: '#0b57d0', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '20px', cursor: 'pointer' }}
      >
        ออกจากระบบ
      </button>
    </div>
  );
};
