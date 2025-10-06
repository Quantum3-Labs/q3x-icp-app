"use client";
import { useCanisterStore } from "@/store";
import React, { useState } from "react";

interface WalletData {
  signers: string[];
  threshold: number;
  message_queue: any[];
  metadata: any[];
}

const TestCanister: React.FC = () => {
  const { setActor, getWallet } = useCanisterStore();

  const [canisterId, setCanisterId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!canisterId.trim()) {
      setError("Canister ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Connecting to canister:", canisterId);
      await setActor(canisterId);

      setIsConnected(true);
      console.log("Connected successfully!");
    } catch (err) {
      console.log("Failed to connect:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGetWallet = async () => {
    if (!walletId.trim()) {
      setError("Wallet ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Getting wallet data for:", walletId);
      const result = await getWallet(walletId);

      if (result && result.length > 0) {
        setWalletData(result[0]);
        console.log("Wallet data received:", result[0]);
      } else {
        setError("No wallet data found");
      }
    } catch (err) {
      console.log("Failed to get wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to get wallet data");
    } finally {
      setLoading(false);
    }
  };

  const decodeMessage = (msgBytes: any): string => {
    try {
      if (msgBytes instanceof Uint8Array) {
        return new TextDecoder().decode(msgBytes);
      }
      // Handle other formats if needed
      return String(msgBytes);
    } catch (error) {
      console.log("Failed to decode message:", error);
      return "Unable to decode message";
    }
  };

  const resetConnection = () => {
    setIsConnected(false);
    setWalletData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Canister Connection</h1>
            <p className="text-gray-600">Connect to a canister and retrieve wallet data</p>
          </div>

          {/* Connection Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Canister ID</label>
              <input
                type="text"
                value={canisterId}
                onChange={e => setCanisterId(e.target.value)}
                placeholder="Enter canister ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wallet ID</label>
              <input
                type="text"
                value={walletId}
                onChange={e => setWalletId(e.target.value)}
                placeholder="Enter wallet ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={loading || !canisterId.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Connecting...
                  </>
                ) : (
                  "Connect to Canister"
                )}
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Connected
                </div>

                <button
                  onClick={handleGetWallet}
                  disabled={loading || !walletId.trim()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    "Get Wallet Data"
                  )}
                </button>

                <button
                  onClick={resetConnection}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Wallet Data Display */}
          {walletData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Wallet Data</h2>

              {/* Signers Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Signers ({walletData.signers.length})</h3>
                <div className="space-y-2">
                  {walletData.signers.map((signer, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xs">{index + 1}</span>
                      </div>
                      <span className="font-mono text-sm text-gray-700 break-all leading-relaxed">{signer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold Section */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Threshold</h3>
                <div className="text-2xl font-bold text-green-600">
                  {walletData.threshold} of {walletData.signers.length} signatures required
                </div>
              </div>

              {/* Message Queue Section */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Message Queue ({walletData.message_queue.length})
                </h3>
                {walletData.message_queue.length === 0 ? (
                  <p className="text-gray-500 italic">No pending messages</p>
                ) : (
                  <div className="space-y-4">
                    {walletData.message_queue.map(([messageBytes, signers], index) => (
                      <div key={index} className="bg-white rounded border p-4">
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-800 mb-1">Message {index + 1}:</h4>
                          <p className="font-mono text-sm bg-gray-100 p-2 rounded">{decodeMessage(messageBytes)}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Signers ({signers.length}):</h4>
                          {signers.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">No signers yet</p>
                          ) : (
                            <div className="space-y-1">
                              {signers.map((signer: string, signerIndex: number) => (
                                <div
                                  key={signerIndex}
                                  className="font-mono text-xs text-gray-600 bg-gray-50 p-1 rounded break-all leading-relaxed"
                                >
                                  {signer}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCanister;
