'use client';

import React, { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import {
  Scissors,
  DollarSign,
  Calendar,
  Clock,
  Plus,
  Play,
  Square,
  Sparkles,
  AlertCircle,
  CheckSquare,
  Square as SquareIcon,
  Download,
  Upload,
  User,
  ArrowLeft,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useTimerStore } from '@/store/useStore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/billing/InvoicePDF';

interface Garment {
  id: string;
  name: string;
  description: string | null;
  designFiles: string[];
  fabricType: string | null;
  color: string | null;
  pattern: string | null;
  measurements: any;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  timeSpent: number | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  priority: string;
  totalAmount: number | null;
  depositPaid: number | null;
  balanceDue: number | null;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  garments: Garment[];
  tasks: Task[];
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Financial logging
  const [isFinModalOpen, setIsFinModalOpen] = useState(false);
  const [finForm, setFinForm] = useState({ totalAmount: '', depositPaid: '' });

  // Task creation
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', garmentId: '' });

  // Timer store variables
  const { activeTaskId, isRunning, startTimer, elapsedSeconds } = useTimerStore();

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error('Order profile not found');
      }
      const data = await res.json();
      setOrder(data);
      setFinForm({
        totalAmount: (data.totalAmount || 0).toString(),
        depositPaid: (data.depositPaid || 0).toString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Connect active ticking update
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        useTimerStore.getState().tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: isCompleted }),
      });
      if (res.ok) {
        fetchOrder();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimerAction = async (task: Task) => {
    if (isRunning && activeTaskId === task.id) {
      // Stop and log timer
      const result = useTimerStore.getState().stopTimer();
      if (result) {
        const { elapsedHours, taskId } = result;
        try {
          await fetch('/api/tasks', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, addTime: elapsedHours }),
          });
          alert(`Logged ${elapsedHours} hours tracked!`);
          fetchOrder();
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // Start timer
      startTimer(task.id, task.title);
    }
  };

  const handleUpdateFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: parseFloat(finForm.totalAmount) || 0,
          depositPaid: parseFloat(finForm.depositPaid) || 0,
        }),
      });

      if (res.ok) {
        setIsFinModalOpen(false);
        fetchOrder();
      } else {
        alert('Failed to log payment details');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          orderId: id,
        }),
      });

      if (res.ok) {
        setIsTaskModalOpen(false);
        setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', garmentId: '' });
        fetchOrder();
      } else {
        alert('Failed to log task');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatHours = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-[#d4af37]">Retrieving Order Details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/60 text-red-200 p-5 rounded-lg text-xs">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span>{error || 'Order record not found'}</span>
      </div>
    );
  }

  const isClientSide = typeof window !== 'undefined';

  return (
    <div className="space-y-8">
      {/* Back button and title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1b12]/50 pb-5">
        <div className="space-y-1">
          <Link href="/orders" className="flex items-center gap-1.5 text-xs text-[#8e8e88] hover:text-[#d4af37] transition-all uppercase tracking-wider font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3 pt-2">
            <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">{order.orderNumber}</h1>
            <span className="px-2 py-0.5 border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] rounded text-[10px] uppercase font-bold tracking-widest">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#8e8e88] uppercase tracking-widest">
            Client: <span className="text-[#f5f5f0] font-semibold">{order.client.firstName} {order.client.lastName}</span>
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsFinModalOpen(true)}
            className="flex items-center gap-1 bg-[#161616] hover:bg-[#d4af37]/5 border border-[#1f1b12] text-[#d4af37] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <DollarSign className="w-4 h-4" /> Log Payments
          </button>
          
          {/* Dynamic Invoice PDF Link */}
          {isClientSide && (
            <PDFDownloadLink
              document={<InvoicePDF order={order} />}
              fileName={`invoice-${order.orderNumber}.pdf`}
              className="flex items-center gap-1 bg-[#d4af37] hover:opacity-95 text-[#050505] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
            >
              {({ loading: pdfLoading }) =>
                pdfLoading ? (
                  <span>Compiling PDF...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-black" />
                    <span>Download Invoice</span>
                  </>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {/* Grid: Garments and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Garments Detail & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Garments List Section */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] flex items-center gap-1.5 border-b border-[#1f1b12]/50 pb-2">
              <Scissors className="w-4 h-4" /> Customized Garment Lineup
            </h3>
            {order.garments.length === 0 ? (
              <p className="text-xs text-[#8e8e88] italic">No garments mapped to this order.</p>
            ) : (
              <div className="space-y-6">
                {order.garments.map((garment) => (
                  <div key={garment.id} className="luxury-card p-5 bg-[#111] space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#f5f5f0]">
                          {garment.name}
                        </h4>
                        {garment.description && (
                          <p className="text-xs text-[#8e8e88] italic mt-1">{garment.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Fabric Base</span>
                        <p className="font-semibold text-[#f5f5f0] mt-0.5">{garment.fabricType || 'Bespoke Sourced'}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Color Target</span>
                        <p className="font-semibold text-[#f5f5f0] mt-0.5">{garment.color || 'Custom Dyed'}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Pattern Link</span>
                        <p className="font-semibold text-[#d4af37] mt-0.5 truncate">{garment.pattern || 'Draped Freeform'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks checklist section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#1f1b12]/50 pb-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> Production Task Checklist
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            {order.tasks.length === 0 ? (
              <p className="text-xs text-[#8e8e88] italic py-4">No tasks configured for this order.</p>
            ) : (
              <div className="divide-y divide-[#1f1b12]/50">
                {order.tasks.map((task) => {
                  const isTaskRunning = isRunning && activeTaskId === task.id;
                  const isCompleted = task.status === 'DONE';
                  return (
                    <div key={task.id} className="py-4 flex items-center justify-between gap-4">
                      {/* Checkbox + Title */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id, !isCompleted)}
                          className="text-[#d4af37] hover:opacity-90 cursor-pointer"
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <SquareIcon className="w-5 h-5 text-[#8e8e88]" />
                          )}
                        </button>
                        <div>
                          <p className={`text-xs font-semibold uppercase tracking-wider text-[#f5f5f0] ${isCompleted ? 'line-through text-[#8e8e88]' : ''}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[10px] text-[#8e8e88] mt-0.5 italic">{task.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Action & timer */}
                      <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                        {/* Time spent */}
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] block">Hours Logged</span>
                          <span className="font-mono text-[#f5f5f0] font-bold">{(task.timeSpent || 0).toFixed(2)}h</span>
                        </div>

                        {/* Live Timer control */}
                        {!isCompleted && (
                          <button
                            onClick={() => handleTimerAction(task)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest border transition-all cursor-pointer ${
                              isTaskRunning
                                ? 'bg-red-950/60 border-red-800 text-red-200 animate-pulse'
                                : 'bg-[#161616] border-[#1f1b12] text-[#8e8e88] hover:text-[#d4af37] hover:border-[#d4af37]/35'
                            }`}
                          >
                            {isTaskRunning ? (
                              <>
                                <Square className="w-3 h-3 fill-red-200" />
                                <span>{formatHours(elapsedSeconds)}</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-[#8e8e88]" />
                                <span>Start Timer</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Logistics and Finances */}
        <div className="space-y-8">
          {/* Logistics summary */}
          <div className="luxury-card p-6 space-y-4 bg-[#111]">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2">
              Logistics
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] block">Target Delivery</span>
                <p className="font-semibold text-[#f5f5f0] flex items-center gap-1.5 mt-1 font-mono">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'No deadline set'}
                </p>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] block">Designer Log Notes</span>
                <p className="text-[#8e8e88] mt-1 leading-relaxed italic">{order.notes || 'No instructions written.'}</p>
              </div>
            </div>
          </div>

          {/* Finances */}
          <div className="luxury-card p-6 space-y-4 bg-[#111]">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2">
              Order Ledger
            </h4>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-[#1f1b12]/30 pb-2">
                <span className="text-[#8e8e88] uppercase tracking-widest text-[9px] font-semibold">Total Price</span>
                <span className="font-bold text-[#f5f5f0]">${(order.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f1b12]/30 pb-2">
                <span className="text-[#8e8e88] uppercase tracking-widest text-[9px] font-semibold">Deposit Paid</span>
                <span className="font-bold text-emerald-400">-${(order.depositPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f1b12]/30 pb-2">
                <span className="text-[#8e8e88] uppercase tracking-widest text-[9px] font-semibold">Balance Due</span>
                <span className="font-bold text-amber-500 font-mono text-sm">${(order.balanceDue || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY MODAL: EDIT FINANCES */}
      {isFinModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsFinModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">Record Payments</h3>
            <form onSubmit={handleUpdateFinance} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Total Garment Cost ($)</label>
                <input
                  type="number"
                  required
                  value={finForm.totalAmount}
                  onChange={(e) => setFinForm({ ...finForm, totalAmount: e.target.value })}
                  className="w-full luxury-input"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Deposits Logged ($)</label>
                <input
                  type="number"
                  required
                  value={finForm.depositPaid}
                  onChange={(e) => setFinForm({ ...finForm, depositPaid: e.target.value })}
                  className="w-full luxury-input"
                />
              </div>
              <button type="submit" className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2">Log Ledgers</button>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY MODAL: ADD TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#111] border border-[#1f1b12] rounded-xl p-6 relative">
            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-4 right-4 text-[#8e8e88] hover:text-[#f5f5f0] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-serif text-[#f5f5f0] mb-4 uppercase tracking-widest border-b border-[#1f1b12] pb-2">Configure Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full luxury-input"
                  placeholder="e.g. Draping pattern, Cutting lining"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full luxury-input"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Select Garment (Optional)</label>
                <select
                  value={taskForm.garmentId}
                  onChange={(e) => setTaskForm({ ...taskForm, garmentId: e.target.value })}
                  className="w-full luxury-input"
                >
                  <option value="">-- General Order Task --</option>
                  {order.garments.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#8e8e88] mb-1">Task Details</label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full luxury-input resize-none"
                />
              </div>
              <button type="submit" className="w-full luxury-btn-primary uppercase tracking-widest py-3 mt-2">Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
