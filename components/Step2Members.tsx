import React, { useState } from 'react';
import { Member, Tag, SUGGESTED_GROUPS, TAG_COLORS, UNTAGGED_COLOR } from '../types';
import { ArrowRight, Plus, X, ArrowLeft, Users, Tag as TagIcon, Trash2 } from 'lucide-react';

interface Props {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  onNext: () => void;
  onBack: () => void;
  maxCapacity: number;
}

export const Step2Members: React.FC<Props> = ({ members, setMembers, tags, setTags, onNext, onBack, maxCapacity }) => {
  // Input States
  const [groupNameInput, setGroupNameInput] = useState('');
  const [memberListInput, setMemberListInput] = useState('');

  // Helper to find or create a tag
  const getOrCreateTagId = (name: string): string => {
    const existing = tags.find(t => t.label === name);
    if (existing) return existing.id;

    // Create new
    const newId = Math.random().toString(36).substr(2, 9);
    // Cycle colors based on current tag count
    const color = TAG_COLORS[tags.length % TAG_COLORS.length];
    
    setTags(prev => [...prev, { id: newId, label: name, color }]);
    return newId;
  };

  const handleAddGroupAndMembers = () => {
    if (!memberListInput.trim()) return;

    let targetTagId: string | null = null;
    if (groupNameInput.trim()) {
        targetTagId = getOrCreateTagId(groupNameInput.trim());
    }

    const names = memberListInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newMembers: Member[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      tagId: targetTagId
    }));

    setMembers(prev => [...prev, ...newMembers]);
    
    // Reset inputs
    setMemberListInput('');
    setGroupNameInput('');
  };

  const removeMember = (id: string) => {
      setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* Header */}
        <div className="flex items-center px-6 pt-6 pb-2 z-20">
             <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-white/40 transition-all">
                <ArrowLeft size={24} />
             </button>
             <h2 className="ml-2 font-bold text-slate-700 text-lg">メンバー登録</h2>
             <div className="ml-auto bg-white/50 backdrop-blur-md border border-white/60 text-slate-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {members.length} / {maxCapacity} 名
             </div>
        </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

        {/* 1. Input Section (Glass Card) */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg shadow-indigo-500/5 border border-white/70">
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white flex items-center justify-center text-xs shadow-md">
                        <Plus size={16} />
                    </span>
                    メンバー追加
                </h3>
            </div>
            
            <div className="space-y-4">
                {/* Group Name Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">グループ・タグ（任意）</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={groupNameInput}
                            onChange={(e) => setGroupNameInput(e.target.value)}
                            placeholder="例: 高校友人, 親族"
                            className="w-full bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-700 font-bold focus:ring-2 focus:ring-indigo-400/50 outline-none placeholder:text-slate-400/70 transition-all focus:bg-white/80"
                        />
                         {groupNameInput && (
                            <button onClick={() => setGroupNameInput('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    {/* Suggestions */}
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_GROUPS.map(g => (
                            <button 
                                key={g}
                                onClick={() => setGroupNameInput(g)}
                                className="text-[10px] font-bold px-2.5 py-1.5 bg-white/40 border border-white/60 rounded-lg text-slate-500 hover:bg-white/80 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Members Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">名前リスト（改行区切り）</label>
                    <textarea 
                        value={memberListInput}
                        onChange={(e) => setMemberListInput(e.target.value)}
                        placeholder="佐藤&#13;&#10;鈴木&#13;&#10;高橋"
                        className="w-full h-28 bg-white/50 border border-white/60 rounded-xl px-4 py-3 text-slate-700 leading-relaxed resize-none focus:ring-2 focus:ring-indigo-400/50 outline-none placeholder:text-slate-400/70 transition-all focus:bg-white/80"
                    />
                </div>

                <button 
                    onClick={handleAddGroupAndMembers}
                    disabled={!memberListInput.trim()}
                    className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                >
                    <Plus size={18} />
                    リストに追加
                </button>
            </div>
        </div>

        {/* 2. List Section */}
        <div className="space-y-2 pb-20">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">登録済み ({members.length}名)</h3>
            
            {members.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm font-medium bg-white/20 rounded-3xl border border-white/30 backdrop-blur-sm">
                    メンバーがいません
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Group members by Tag for display */}
                    {tags.concat([{ id: 'untagged', label: 'グループなし', color: UNTAGGED_COLOR }]).map(tag => {
                        const groupMembers = members.filter(m => (m.tagId || 'untagged') === tag.id);
                        if (groupMembers.length === 0) return null;

                        return (
                            <div key={tag.id} className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${tag.color} bg-opacity-80 backdrop-blur-sm border-0`}>
                                        {tag.label}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold">{groupMembers.length}名</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {groupMembers.map(m => (
                                        <div key={m.id} className="group flex items-center bg-white/60 rounded-xl pl-3 pr-2 py-2 border border-white/60 shadow-sm hover:shadow-md transition-all">
                                            <span className="text-sm font-bold text-slate-700">{m.name}</span>
                                            <button 
                                                onClick={() => removeMember(m.id)}
                                                className="ml-2 p-1 text-slate-300 hover:text-red-400 transition-colors bg-slate-100 rounded-full opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>

      <div className="p-6 bg-white/10 backdrop-blur-md sticky bottom-0 z-20">
        <button
          onClick={onNext}
          disabled={members.length === 0}
          className="w-full bg-slate-900/90 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.98] transition-all text-lg disabled:bg-slate-400 disabled:shadow-none backdrop-blur-xl border border-white/10"
        >
          席順を決める
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};