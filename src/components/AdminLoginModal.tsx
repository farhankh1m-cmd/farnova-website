import React, { useState } from "react";
import { X, Lock, KeyRound, ShieldCheck, Eye, EyeOff, Check, LogOut } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  onChangePassword: (oldPassword: string, newPassword: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  onChangePassword,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Change Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setError("");
    setSuccess("");
    setPassword("");
    setOldPassword("");
    setNewPassword("");
    setIsChangingPassword(false);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    const ok = onLogin(password.trim());
    if (ok) {
      setPassword("");
      handleClose();
    } else {
      setError("Incorrect Admin Password! Please try again.");
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword) {
      setError("Please fill out both password fields.");
      return;
    }
    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }

    const ok = onChangePassword(oldPassword.trim(), newPassword.trim());
    if (ok) {
      setSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setIsChangingPassword(false);
        setSuccess("");
      }, 1500);
    } else {
      setError("Old password is incorrect");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#18181A] border border-white/15 text-[#FAF8F5] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D6C7B2]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
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

            {isChangingPassword ? (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-wider text-[#D6C7B2] font-semibold">
                  Change Admin Password
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
                  <label className="block text-xs text-[#A3A3A3] mb-1">Old Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6C7B2]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#A3A3A3] mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new secure password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6C7B2]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-[#EBE7DF] text-[#1A1A1A] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Save New Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setError("");
                      setOldPassword("");
                      setNewPassword("");
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
                  onClick={() => setIsChangingPassword(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#D6C7B2]" />
                  <span>Change Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    handleClose();
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
              Yeh portal sirf aapke liye hai. Login karne ke baad hi &ldquo;+ Post Item&rdquo; aur Hero Photo change karne ke options open honge. Normal customers ke liye yeh feature 100% hidden hai.
            </p>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#FAF8F5] mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Password"
                    className="w-full pl-4 pr-11 py-3 bg-black/50 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D6C7B2] focus:ring-1 focus:ring-[#D6C7B2]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
