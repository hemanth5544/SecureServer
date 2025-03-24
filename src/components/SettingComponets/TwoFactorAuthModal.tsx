import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, Smartphone } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const inputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  

  const handleVerify = () => {
    setIsLoading(true);
    const combinedToken = verificationCode.join('');
    setToken(combinedToken);
    
    setTimeout(() => {
      verify2FA();
      setIsLoading(false);
    }, 500);
  };

  // Handle input changes in the verification code fields
  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);
      setToken(newVerificationCode.join(''));
      
      // Auto-focus next input when current one is filled
      if (value.length === 1 && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  // Handle backspace key to move to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && verificationCode[index] === '') {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle pasting the entire code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setVerificationCode(digits);
      setToken(pastedData);
      inputRefs[5].current?.focus();
    }
  };

  useEffect(() => {
    setToken(verificationCode.join(''));
  }, [verificationCode, setToken]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md border border-border animate-in fade-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            Enable Two-Factor Authentication
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-6">
              <div className={`flex-1 flex flex-col items-center ${activeStep === 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${activeStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>1</div>
                <span className="text-xs">Scan</span>
              </div>
              <div className={`flex-1 flex flex-col items-center ${activeStep === 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${activeStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</div>
                <span className="text-xs">Verify</span>
              </div>
            </div>
          </div>

          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="text-sm text-foreground mb-4">
                <p className="mb-2">Scan the QR code with an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.</p>
                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <Smartphone className="h-4 w-4 mr-1" />
                  <span>Recommended apps: Google Authenticator, Authy, Microsoft Authenticator</span>
                </div>
              </div>

              <div className="flex justify-center bg-white p-4 rounded-lg border">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>

             

              <button
                onClick={() => setActiveStep(2)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="text-sm text-foreground mb-4">
                <p>Enter the 6-digit verification code from your authenticator app to enable 2FA on your account.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Verification code:</label>
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 text-center px-0 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-mono"
                      aria-label={`digit ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  The verification code changes every 30 seconds
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setActiveStep(1)}
                  className="flex-1 px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verificationCode.join('').length !== 6 || isLoading}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify and Enable 2FA"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};