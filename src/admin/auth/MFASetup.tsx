'use client';

import { useState, useEffect } from 'react';

export interface MFAStatus {
  enabled: boolean;
  methods: ('totp' | 'backup_codes')[];
  backup_codes_remaining?: number;
}

export interface MFASetupResponse {
  secret: string;
  qr_code: string; // Base64 encoded QR code image or otpauth:// URL
  backup_codes?: string[];
}

export interface MFASetupApi {
  getStatus: () => Promise<MFAStatus>;
  setup: () => Promise<MFASetupResponse>;
  verifyAndEnable: (code: string) => Promise<{ backup_codes?: string[] }>;
  disable: (code: string) => Promise<void>;
}

interface MFASetupProps {
  api: MFASetupApi;
  onComplete?: () => void;
}

type SetupStep = 'status' | 'setup' | 'verify' | 'backup-codes' | 'disable';

/**
 * MFA Setup Component
 * Full flow for setting up TOTP-based MFA. Consumer injects the
 * MFASetupApi (typically the admin's `lib/api/mfa` functions).
 */
export function MFASetup({ api, onComplete }: MFASetupProps) {
  const [step, setStep] = useState<SetupStep>('status');
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [setupData, setSetupData] = useState<MFASetupResponse | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch MFA status on mount
  useEffect(() => {
    fetchMFAStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMFAStatus = async () => {
    try {
      setLoading(true);
      const status = await api.getStatus();
      setMfaStatus(status);
    } catch (err) {
      // MFA might not be set up yet
      setMfaStatus({ enabled: false, methods: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleStartSetup = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.setup();
      setSetupData(data);
      setStep('setup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start MFA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await api.verifyAndEnable(code);
      setBackupCodes(result.backup_codes || []);
      setStep('backup-codes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.disable(code);
      setMfaStatus({ enabled: false, methods: [] });
      setStep('status');
      setCode('');
      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    setStep('status');
    fetchMFAStatus();
    onComplete?.();
  };

  if (loading && step === 'status') {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading MFA status...</p>
      </div>
    );
  }

  // Status view - show current MFA status
  if (step === 'status') {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add an extra layer of security to your account by requiring a code from your authenticator app.
            </p>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${mfaStatus?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {mfaStatus?.enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {mfaStatus?.enabled ? (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              MFA is currently enabled. You will be asked for a verification code when logging in.
              {mfaStatus.backup_codes_remaining !== undefined && (
                <span className="block mt-1 text-gray-500">
                  Backup codes remaining: {mfaStatus.backup_codes_remaining}
                </span>
              )}
            </p>
            <button
              onClick={() => { setStep('disable'); setCode(''); setError(''); }}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
            >
              Disable MFA
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={handleStartSetup}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Enable MFA'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Setup view - show QR code
  if (step === 'setup' && setupData) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Set Up Authenticator</h3>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Step 1:</strong> Install an authenticator app</p>
            <p className="text-gray-500">
              Download Google Authenticator, Authy, or Microsoft Authenticator on your phone.
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Step 2:</strong> Scan this QR code</p>
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
              {setupData.qr_code.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={setupData.qr_code} alt="MFA QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm text-center p-4">
                  QR Code will appear here
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Can&apos;t scan? Enter this key manually: <code className="bg-gray-100 px-1 rounded">{setupData.secret}</code>
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Step 3:</strong> Enter the 6-digit code</p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('status'); setCode(''); setError(''); }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Backup codes view
  if (step === 'backup-codes') {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-2">MFA Enabled Successfully!</h3>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">Save Your Backup Codes</h4>
          <p className="text-sm text-yellow-700 mb-3">
            If you lose access to your authenticator app, you can use these backup codes to sign in.
            Each code can only be used once.
          </p>
          <div className="bg-white rounded p-3 font-mono text-sm grid grid-cols-2 gap-2">
            {backupCodes.map((c, index) => (
              <div key={index} className="text-gray-800">{c}</div>
            ))}
          </div>
          <button
            onClick={copyBackupCodes}
            className="mt-3 w-full px-4 py-2 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-100 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Codes
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleComplete}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    );
  }

  // Disable MFA view
  if (step === 'disable') {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Disable Two-Factor Authentication</h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-700">
            <strong>Warning:</strong> Disabling MFA will make your account less secure.
            You will no longer need a verification code to sign in.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your current authentication code to confirm:
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
          />
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { setStep('status'); setCode(''); setError(''); }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDisableMFA}
            disabled={loading || code.length !== 6}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Disabling...' : 'Disable MFA'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default MFASetup;
