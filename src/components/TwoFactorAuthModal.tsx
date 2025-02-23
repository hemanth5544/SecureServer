import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TwoFactorAuthModalProps {
  qrCode: string;
  token: string;
  setToken: (token: string) => void;
  verify2FA: () => void;
  onClose: () => void;
}

export const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  qrCode,
  token,
  setToken,
  verify2FA,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-card-foreground">Enable Two-Factor Authentication</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-card-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Scan this QR code with your authenticator app:</p>
            <img src={qrCode} alt="2FA QR Code" className="mb-4" />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground">Enter verification code:</label>
            <div className="mt-1">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>
          </div>

          <button
            onClick={verify2FA}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Verify and Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
};