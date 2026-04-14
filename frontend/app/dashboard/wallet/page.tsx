'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { walletApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { ArrowDownLeft, ArrowUpRight, Send } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string;
  createdAt: string;
}

export default function WalletPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchWalletData();
  }, [user, router]);

  const fetchWalletData = async () => {
    try {
      const balanceRes = await walletApi.getBalance();
      setBalance(balanceRes.data.walletBalance);

      const transRes = await walletApi.getTransactions();
      setTransactions(transRes.data.transactions);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !walletAddress) return;

    setWithdrawing(true);
    try {
      await walletApi.requestWithdrawal({
        amount: parseFloat(withdrawAmount),
        walletAddress,
      });

      setWithdrawAmount('');
      setWalletAddress('');
      await fetchWalletData();
      alert('Withdrawal request submitted');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8">Wallet & Withdrawals</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-8">
                <p className="text-gray-400 text-sm mb-2">Current Balance</p>
                <h2 className="text-5xl font-bold text-accent mb-4">
                  ${balance.toFixed(2)} USDC
                </h2>
                <p className="text-gray-400 text-sm">On Base Network</p>
              </div>

              {/* Transactions */}
              <div className="bg-darker border border-accent/10 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4">Transaction History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <p className="text-gray-400">Loading...</p>
                  ) : transactions.length === 0 ? (
                    <p className="text-gray-400">No transactions yet</p>
                  ) : (
                    transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 bg-dark rounded-lg border border-accent/5 hover:border-accent/20"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              tx.type === 'EARNING'
                                ? 'bg-green-500/20'
                                : tx.type === 'WITHDRAWAL'
                                ? 'bg-red-500/20'
                                : 'bg-blue-500/20'
                            }`}
                          >
                            {tx.type === 'EARNING' ? (
                              <ArrowDownLeft className="text-green-400" size={24} />
                            ) : (
                              <ArrowUpRight className="text-red-400" size={24} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{tx.description || tx.type}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-lg font-bold ${
                            tx.type === 'EARNING' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {tx.type === 'EARNING' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Withdrawal Form */}
            <div>
              <div className="bg-darker border border-accent/10 rounded-lg p-6 sticky top-20">
                <h3 className="text-2xl font-bold mb-4">Request Withdrawal</h3>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (USDC)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={balance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Min: $1 USDC | Available: ${balance.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Wallet Address (Base)
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                      className="w-full bg-dark border border-accent/20 rounded-lg px-4 py-2 text-white focus:border-accent outline-none text-sm"
                      placeholder="0x..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={withdrawing || !withdrawAmount || !walletAddress}
                    className="w-full bg-accent text-dark py-2 rounded-lg font-bold hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    {withdrawing ? 'Processing...' : 'Request Withdrawal'}
                  </button>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300">
                    <p className="font-medium mb-1">Network: Base (Ethereum L2)</p>
                    <p>USDC will be sent to your wallet address</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
