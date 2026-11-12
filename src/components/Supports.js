import React from 'react';

export const Supports = ({
  step, // 'betting' or 'answering'
  usedPreview,
  usedInsurance,
  usedHint,
  onUsePreview,
  onUseInsurance,
  onUseHint,
}) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>Quyền trợ giúp:</strong>
      <button
        type="button"
        disabled={step !== 'betting' || usedPreview}
        onClick={onUsePreview}
        style={{
          padding: '6px 12px',
          backgroundColor: usedPreview ? '#ccc' : '#ff9800',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: step === 'betting' && !usedPreview ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
        }}
      >
        {usedPreview ? 'Đã xem trước' : 'Xem trước'}
      </button>

      <button
        type="button"
        disabled={usedInsurance}
        onClick={onUseInsurance}
        style={{
          padding: '6px 12px',
          backgroundColor: usedInsurance ? '#ccc' : '#9c27b0',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: !usedInsurance ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
        }}
      >
        {usedInsurance ? 'Đã bảo hiểm' : 'Bảo hiểm'}
      </button>

      <button
        type="button"
        disabled={step !== 'answering' || usedHint}
        onClick={onUseHint}
        style={{
          padding: '6px 12px',
          backgroundColor: usedHint ? '#ccc' : '#03a9f4',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: step === 'answering' && !usedHint ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
        }}
      >
        {usedHint ? 'Đã gợi ý' : 'Gợi ý'}
      </button>
    </div>
  );
};