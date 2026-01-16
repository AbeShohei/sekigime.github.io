import React, { useEffect, useState } from 'react';
import { Member, Table, AppConfig, Tag, UNTAGGED_COLOR } from '../types';
import { generateSeating } from '../utils/seatingLogic';
import { Shuffle, ArrowLeft } from 'lucide-react';

interface Props {
  members: Member[];
  tags: Tag[];
  config: AppConfig;
  onBack: () => void;
}

export const Step3Results: React.FC<Props> = ({ members, tags, config, onBack }) => {
  const [result, setResult] = useState<{ tables: Table[]; unassigned: Member[] } | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const runShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
        const res = generateSeating(members, config.tableDefinitions);
        setResult(res);
        setIsShuffling(false);
    }, 400);
  };

  useEffect(() => {
    runShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMemberStyle = (tagId: string | null) => {
    if (!tagId) return UNTAGGED_COLOR;
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.color : UNTAGGED_COLOR;
  };

  if (!result) return <div className="flex items-center justify-center h-full text-indigo-400 font-bold animate-pulse text-sm">作成中...</div>;

  const tableCount = result.tables.length;
  
  // Base Layout Mode: Use single column globally only if very few tables
  const isGlobalSingleColumn = tableCount <= 3;

  // Grid classes
  const gridClass = isGlobalSingleColumn 
    ? "grid grid-cols-1 gap-8 w-4/5 mx-auto" 
    : "grid grid-cols-2 gap-x-2 gap-y-6 content-start px-1";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 z-20 shrink-0">
        <div className="flex items-center">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-white/40 transition-all">
                <ArrowLeft size={20} />
            </button>
            <h2 className="ml-1 font-bold text-slate-700 text-base">席次表</h2>
        </div>
        
        {/* Shuffle Button (Compact in Header) */}
        <button 
            onClick={runShuffle}
            disabled={isShuffling}
            className="px-3 py-1.5 bg-slate-800/90 text-white rounded-full shadow-lg shadow-slate-900/20 flex items-center gap-2 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all backdrop-blur-xl border border-white/10"
        >
            <Shuffle size={14} className={isShuffling ? "animate-spin" : ""} />
            {isShuffling ? "..." : "再配置"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2 pb-20">
        {/* Unassigned Warning */}
        {result.unassigned.length > 0 && (
            <div className="mb-4 bg-red-100/60 backdrop-blur-md border border-red-200/60 rounded-xl p-3 mx-2">
                <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2 text-xs">
                    ⚠ 未割り当て ({result.unassigned.length}名)
                </h3>
                <div className="flex flex-wrap gap-1">
                    {result.unassigned.map(m => (
                        <span key={m.id} className="text-[10px] px-2 py-0.5 bg-white/60 border border-red-100 rounded text-gray-600 font-bold">
                            {m.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Tables Grid */}
        <div className={gridClass}>
            {result.tables.map((table) => {
                const hasMembers = table.members.length > 0;
                // If the table is large (>=9), span 2 columns (full width)
                const isLargeTable = table.capacity >= 9;
                const colSpanClass = (!isGlobalSingleColumn && isLargeTable) ? "col-span-2 w-[90%] mx-auto" : "col-span-1";
                
                // For rendering, decide sizes
                const renderAsLarge = isGlobalSingleColumn || isLargeTable;

                // Split members for Top/Bottom arrangement
                const half = Math.ceil(table.members.length / 2);
                const topMembers = table.members.slice(0, half);
                const bottomMembers = table.members.slice(half);

                // Styling constants
                const tableHeightClass = renderAsLarge ? "h-14" : "h-9";
                const dotSizeClass = renderAsLarge ? "w-5 h-5 border-2" : "w-3 h-3 border";
                const memberContainerClass = renderAsLarge ? "w-1/4 max-w-[80px]" : "w-1/4 max-w-[48px]";
                
                // Base text style
                const nameTextBase = "text-slate-900 font-bold text-center leading-none whitespace-nowrap transition-all";
                const baseTextSize = renderAsLarge ? "text-xs" : "text-[9px] scale-[0.85]";

                return (
                <div key={table.id} className={`flex flex-col items-center ${colSpanClass}`}>
                    
                    {/* Top Seats */}
                    <div className="flex justify-center gap-0.5 mb-0.5 min-h-[24px] items-end w-full px-1">
                         {topMembers.map((m, i) => {
                             // Stagger effect: Push odd indices up
                             const staggerClass = (i % 2 !== 0) ? "mb-4" : "mb-0.5";
                             
                             return (
                                <div key={m.id} className={`flex flex-col items-center justify-end ${memberContainerClass}`}>
                                    <span className={`${nameTextBase} ${baseTextSize} ${staggerClass}`}>
                                        {m.name}
                                    </span>
                                    <div className={`${dotSizeClass} rounded-full shadow-sm z-10 shrink-0 ${getMemberStyle(m.tagId)}`}></div>
                                </div>
                             );
                        })}
                    </div>

                    {/* Rectangular Table Surface */}
                    <div className={`relative w-[98%] ${tableHeightClass} bg-white/50 backdrop-blur-md rounded shadow-sm border border-white/60 flex flex-col items-center justify-center z-0 group hover:bg-white/70 transition-colors`}>
                        <div className="flex items-baseline gap-1">
                            <span className={`${renderAsLarge ? 'text-sm' : 'text-[10px]'} font-bold text-slate-600`}>{table.name}</span>
                            {hasMembers && (
                                <span className={`${renderAsLarge ? 'text-xs' : 'text-[8px]'} text-slate-400 font-bold opacity-70`}>
                                    {table.members.length}/{table.capacity}
                                </span>
                            )}
                        </div>
                        {!hasMembers && <span className={`${renderAsLarge ? 'text-[10px]' : 'text-[8px]'} text-slate-300 font-bold -mt-0.5`}>空席</span>}
                        
                        {/* Legs/Decor hints */}
                        <div className="absolute -bottom-0.5 left-1.5 w-0.5 h-1 bg-slate-300/50 rounded-full"></div>
                        <div className="absolute -bottom-0.5 right-1.5 w-0.5 h-1 bg-slate-300/50 rounded-full"></div>
                    </div>

                    {/* Bottom Seats */}
                    <div className="flex justify-center gap-0.5 mt-0.5 min-h-[24px] items-start w-full px-1">
                        {bottomMembers.map((m, i) => {
                            // Stagger effect: Push odd indices down
                             const staggerClass = (i % 2 !== 0) ? "mt-4" : "mt-0.5";

                            return (
                                <div key={m.id} className={`flex flex-col items-center justify-start ${memberContainerClass}`}>
                                    <div className={`${dotSizeClass} rounded-full shadow-sm z-10 shrink-0 ${getMemberStyle(m.tagId)}`}></div>
                                    <span className={`${nameTextBase} ${baseTextSize} ${staggerClass}`}>
                                        {m.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            )})}
        </div>
      </div>
    </div>
  );
};