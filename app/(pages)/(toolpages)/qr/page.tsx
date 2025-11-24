'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import css from './qr.module.css';

export default function Qr() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const generateQR = async () => {
    if (!text) return;
    
    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className={css.container}>
      <p>QR Code Generator</p>
      <p>Generate QR codes for your RSO events, social media, or links</p>

      <div className={css.inputSection}>
        <label>Enter URL or Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://instagram.com/your_rso"
          className={css.input}
        />
        <button onClick={generateQR} className={css.generateBtn}>
          Generate QR Code
        </button>
      </div>

      {qrDataUrl && (
        <div className={css.qrSection}>
          <img src={qrDataUrl} alt="QR Code" className={css.qrImage} />
          <button onClick={downloadQR} className={css.downloadBtn}>
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}