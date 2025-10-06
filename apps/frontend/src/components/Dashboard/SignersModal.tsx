"use client";
import React, { useState } from "react";
import { WalletData } from "./DashboardContainer";
import { useAuthStore, useCanisterStore } from "@/store";

interface SignersModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletData: WalletData;
  walletId: string;
  onUpdate: () => void; // Callback to refresh wallet data
}

// TODO: rework this modal UI
const SignersModal: React.FC<SignersModalProps> = ({ isOpen, onClose, walletData, walletId, onUpdate }) => {
  const { identity } = useAuthStore();
  const { addSigner, removeSigner, setThreshold } = useCanisterStore(); 

  const [showAddForm, setShowAddForm] = useState(false);
  const [showThresholdForm, setShowThresholdForm] = useState(false);
  const [newSignerAddress, setNewSignerAddress] = useState("");
  const [newThreshold, setNewThreshold] = useState(walletData?.threshold);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
  const handleAddSigner = async () => {
    if (!newSignerAddress.trim()) return;

    setLoading(true);
    try {
      await addSigner(walletId, newSignerAddress.trim());
      setNewSignerAddress("");
      setShowAddForm(false);
      onUpdate(); // Refresh wallet data
      onClose();
    } catch (error) {
      console.log("Failed to add signer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSigner = async (signerAddress: string) => {
    if (walletData.signers.length <= 1) {
      alert("Cannot remove last signer");
      return;
    }

    const currentPrincipal = identity?.getPrincipal().toString() || "";
    if (!walletData?.signers.includes(currentPrincipal)) {
      throw new Error("Current user is not authorized to remove signers");
    }

    if (!confirm(`Remove signer: ${signerAddress}?`)) return;

    setLoading(true);
    try {
      await removeSigner(walletId, signerAddress);
      onUpdate(); // Refresh wallet data
      onClose();
    } catch (error) {
      console.log("Failed to remove signer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateThreshold = async () => {
    if (newThreshold < 1 || newThreshold > walletData.signers.length) {
      alert("Invalid threshold value");
      return;
    }

    if (!confirm(`Change threshold to ${newThreshold} of ${walletData.signers.length}?`)) return;

    setLoading(true);
    try {
      await setThreshold(walletId, newThreshold);
      setShowThresholdForm(false);
      onUpdate(); // Refresh wallet data
      onClose();
    } catch (error) {
      console.log("Failed to update threshold:", error);
    } finally {
      setLoading(false);
    }
  };

  // use modal to show
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Manage Signers</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {/* Threshold Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">Threshold</h3>
              <p className="text-sm text-text-secondary">
                {walletData.threshold} of {walletData.signers.length} signatures required
              </p>
            </div>
            <button
              onClick={() => setShowThresholdForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              Change
            </button>
          </div>

          {showThresholdForm && (
            <div className="mt-4 p-4 border rounded">
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={newThreshold}
                  onChange={e => setNewThreshold(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {Array.from({ length: walletData.signers.length }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} of {walletData.signers.length}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateThreshold}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowThresholdForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Signers List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-text-primary">Signers ({walletData.signers.length})</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              Add Signer
            </button>
          </div>

          {/* Add Signer Form */}
          {showAddForm && (
            <div className="mb-4 p-4 border rounded">
              <input
                type="text"
                placeholder="Enter signer principal address"
                value={newSignerAddress}
                onChange={e => setNewSignerAddress(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddSigner}
                  disabled={loading || !newSignerAddress.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSignerAddress("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Signers List */}
          <div className="space-y-2">
            {walletData.signers.map((signer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <p className="font-mono text-sm text-text-primary">
                    {signer.length > 50 ? `${signer.substring(0, 50)}...` : signer}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSigner(signer)}
                  disabled={loading || walletData.signers.length <= 1}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignersModal;
