import React, { useState } from "react";
import { X, Lock, KeyRound, ShieldCheck, Eye, EyeOff, Check, LogOut } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (pin: string) => boolean;
  onLogout: () => void;
  onChangePin: (oldPin: string, newPin: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  onChangePin,
}) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Change PIN mode
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pin.trim()) {
      setError("Please enter the admin PIN/password.");
      return;
    }

    const ok = onLogin(pin.trim());
    if (ok) {
      setPin("");
      onClose();
    } else {
      setError("Incorrect Admin PIN! Please try again.");
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPin || !newPin) {
      setError("Please fill out both PIN fields.");
      return;
    }
    if (newPin.length < 4) {
      setError("New PIN must be at least 4 characters.");
      return;
    }

    const ok = onChangePin(currentPin.trim(), newPin.trim());
    if (ok) {
      setSuccess("Admin PIN changed successfully!");
      setCurrentPin("");
      setNewPin("");
      setTimeout(() => {
        setIsChangingPin(false);
        setSuccess("");
      }, 1500);
    } else {
      setError("Current PIN is incorrect.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#18181A] border border-white/15 text-[#FAF8F5] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D6C7B2]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close admin modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isAdmin ? (
          /* LOGGED IN VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Admin Access Active
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-0.5">
                  Logged in as Store Owner (farhankh1m@gmail.com)
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-[#D1D1D1] space-y-2">
              <div className="flex items-center justify-between text-[#FAF8F5] font-medium">
                <span>Admin Capabilities Enabled:</span>
                <span className="text-[#25D366] text-[11px] font-semibold">● ACTIVE</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-white/70">
                <li>&ldquo;+ Post Item&rdquo; button is visible only to you.</li>
                <li>&ldquo;📸 Tap to Set Your Exact Photo&rdquo; on Hero is visible only to you.</li>
                <li>Normal customers browsing the store cannot see or upload anything.</li>
              </ul>
            </div>

            {isChangingPin ? (
              <form onSubmit={handleChangePinSubmit} className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-wider text-[#D6C7B2] font-semibold">
                  Change Admin PIN / Password
                </h4>
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs rounded-lg">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{success}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-[#A3A3A3] mb-1">Current PIN</label>
                  <input
                    type="password"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="Enter current PIN"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6C7B2]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A3A3A3] mb-1">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new secure PIN"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6C7B2]"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-[#EBE7DF] text-[#1A1A1A] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Save New PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(false);
                      setError("");
                    }}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#D6C7B2]" />
                  <span>Change Admin PIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* LOGIN FORM VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D6C7B2]/20 border border-[#D6C7B2]/40 flex items-center justify-center text-[#D6C7B2]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Farnova Store Owner Login
                </h3>
                <p className="text-xs text-[#A3A3A3] mt-0.5">
                  Restricted to Farhan Khan (farhankh1m@gmail.com)
                </p>
              </div>
            </div>

            <p className="text-xs text-[#C5C5C5] leading-relaxed">
              Yeh portal sirf aapke liye hai. Login karne ke baad hi &ldquo;+ Post Item&rdquo; aur Hero Photo change karne ka button nazar aayega. Normal customers ke liye yeh feature 100% hidden hai.
            </p>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#FAF8F5] mb-1.5">
                  Admin PIN / Password
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter Admin PIN"
                    className="w-full pl-4 pr-11 py-3 bg-black/50 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D6C7B2] focus:ring-1 focus:ring-[#D6C7B2]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-[#A3A3A3]">
                  <span>Default PIN: <strong className="text-[#D6C7B2] font-mono">farnova2026</strong></span>
                  <span className="text-[10px] text-white/40">(Changeable inside)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FAF8F5] hover:bg-[#EBE7DF] text-[#1A1A1A] font-bold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-lg mt-2"
              >
                Unlock Admin Controls
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
