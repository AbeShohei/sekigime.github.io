import React from 'react';
import { AppConfig, TableDefinition, Member } from '../types';
import { Users, LayoutGrid, ArrowRight, User, Edit3, Trash2, Plus, Minus, Check } from 'lucide-react';

interface Props {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  onNext: () => void;
  onLoadMock: () => void;
}

export const Step1Settings: React.FC<Props> = ({ config, setConfig, members, setMembers, onNext, onLoadMock }) => {
  const totalSeats = config.tableDefinitions.reduce((sum, t) => sum + t.capacity, 0);
  const memberCount = members.length;

  const increaseMembers = () => {
     const newMember: Member = {
        id: Math.random().toString(36).substr(2, 9),
        name: `参加者 ${members.length + 1}`,
        tagId: null
     };
     setMembers(prev => [...prev, newMember]);
  };

  const decreaseMembers = () => {
      setMembers(prev => {
          if (prev.length === 0) return prev;
          return prev.slice(0, -1);
      });
  };

  const addTable = (capacity: number) => {
    const newTable: TableDefinition = {
      id: Math.random().toString(36).substr(2, 9),
      capacity,
    };
    setConfig(prev => ({
      ...prev,
      tableDefinitions: [...prev.tableDefinitions, newTable]
    }));
  };

  const removeTable = (id: string) => {
    setConfig(prev => ({
      ...prev,
      tableDefinitions: prev.tableDefinitions.filter(t => t.id !== id)
    }));
  };

  const updateCapacity = (id: string, delta: number) => {
    setConfig(prev => ({
      ...prev,
      tableDefinitions: prev.tableDefinitions.map(t => {
        if (t.id === id) {
          return { ...t, capacity: Math.max(1, t.capacity + delta) };
        }
        return t;
      })
    }));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-6 pt-10 pb-32 space-y-6">
            
            {/* Stats Cards Row */}
            <div className="flex gap-4">
                {/* Participants Card */}
                <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-[2rem] shadow-lg shadow-indigo-500/5 flex flex-col items-center justify-between relative">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                        <User size={12} />
                        参加人数
                    </span>
                    <div className="text-5xl font-bold text-slate-700 my-3 font-mono tracking-tighter">{memberCount}</div>
                    
                    <div className="flex gap-3">
                         <button 
                            onClick={decreaseMembers}
                            className="w-9 h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-slate-500 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                         >
                            <Minus size={16} />
                         </button>
                         <button 
                            onClick={increaseMembers}
                            className="w-9 h-9 rounded-full bg-indigo-500/90 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all"
                         >
                            <Plus size={16} />
                         </button>
                    </div>
                </div>

                {/* Seats Card */}
                <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-[2rem] shadow-lg shadow-indigo-500/5 flex flex-col items-center justify-between relative overflow-hidden">
                     <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                        <LayoutGrid size={12} />
                        総席数
                     </span>
                     <div className={`text-5xl font-bold my-3 font-mono tracking-tighter ${totalSeats < memberCount ? 'text-pink-500' : 'text-slate-700'}`}>
                        {totalSeats}
                     </div>
                     <div className="flex flex-col items-center z-10">
                        <span className="text-[10px] font-bold text-slate-400">{config.tableDefinitions.length} テーブル</span>
                        {totalSeats >= memberCount && (
                            <div className="mt-2 bg-emerald-400/20 text-emerald-700 border border-emerald-400/30 text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                <Check size={10} strokeWidth={3} /> OK
                            </div>
                        )}
                     </div>
                     {/* Decorative corner */}
                     <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-indigo-100/30 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
                </div>
            </div>

            {/* Table Configuration Section */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-slate-600/80 text-sm uppercase tracking-widest">テーブル構成</h3>
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-4 gap-3">
                    {[2, 4, 6, 8].map((num) => (
                         <button 
                            key={num}
                            onClick={() => addTable(num)} 
                            className="group flex flex-col items-center gap-2 p-3 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/60 hover:border-white/80 active:scale-95 transition-all"
                         >
                            <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                {num === 8 ? <Edit3 size={18} /> : <Users size={18} />}
                            </div>
                            <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">{num === 8 ? '任意' : `${num}人`}</span>
                        </button>
                    ))}
                </div>

                {/* Table List */}
                <div className="space-y-3 mt-4">
                    {config.tableDefinitions.map((table) => (
                        <div key={table.id} className="bg-white/60 backdrop-blur-xl p-3 rounded-2xl shadow-sm border border-white/70 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/50 text-slate-400 shadow-inner">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">テーブル</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">定員: {table.capacity}名</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-white/50 rounded-xl p-1 border border-white/60 shadow-inner">
                                    <button 
                                        onClick={() => updateCapacity(table.id, -1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 text-slate-500 shadow-sm active:scale-95 transition-transform hover:text-indigo-500"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-slate-700 font-mono">{table.capacity}</span>
                                    <button 
                                        onClick={() => updateCapacity(table.id, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 text-slate-500 shadow-sm active:scale-95 transition-transform hover:text-indigo-500"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <div className="w-px h-8 bg-slate-200/50"></div>
                                <button 
                                    onClick={() => removeTable(table.id)}
                                    className="p-2 text-slate-300 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {config.tableDefinitions.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-slate-300/50 rounded-3xl bg-white/20">
                            <p className="text-sm font-bold text-slate-400">テーブルを追加してください</p>
                        </div>
                    )}
                </div>
            </div>

             {/* Mock Data Button */}
             <div className="pt-6 text-center">
                 <button 
                    onClick={onLoadMock}
                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest border-b border-transparent hover:border-indigo-300"
                 >
                     デモデータを読み込む
                 </button>
             </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 bg-white/10 backdrop-blur-md sticky bottom-0 z-20">
        <button
          onClick={onNext}
          disabled={config.tableDefinitions.length === 0}
          className="w-full bg-slate-900/90 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.98] transition-all text-lg disabled:bg-slate-400 disabled:shadow-none backdrop-blur-xl border border-white/10"
        >
          次へ進む
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};