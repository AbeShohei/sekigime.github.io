import React, { useState } from 'react';
import { Step1Settings } from './components/Step1Settings';
import { Step2Members } from './components/Step2Members';
import { Step3Results } from './components/Step3Results';
import { AppConfig, Member, Tag, TAG_COLORS, TableDefinition } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [config, setConfig] = useState<AppConfig>({
    tableDefinitions: [
      { id: '1', capacity: 4 },
      { id: '2', capacity: 4 },
      { id: '3', capacity: 4 },
    ],
  });
  
  const [members, setMembers] = useState<Member[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Mock Data Loader
  const loadMockData = () => {
    const mockTags: Tag[] = [
      { id: 't2nd', label: '2回生', color: TAG_COLORS[0] }, // Blue
      { id: 't3rd', label: '3回生', color: TAG_COLORS[3] }, // Green
      { id: 't4th', label: '4回生', color: TAG_COLORS[1] }, // Pink
    ];
    
    const names2nd = [
      '山田萌夏', '川﨑倭', '岩田要', '赤松はうら', '三宮稟乃', '石本瑛', '深田菜月', '平良裕香', '大水康生', '藤田真帆', 
      '土屋美央利', '高田愛子', '今井柚奈', '谷心那', '岸田凌', '山本彩智', '市川颯人', '川澄あすか', '森口明人', '藤井友貴', 
      '安樂真輝', '山地遥', '増井一輝', '苅田那々斗', '古海萌'
    ];
    const names3rd = [
      '中田実里', '丹羽健太', '山﨑桃子', '大塚優里奈', '市田日菜', '森田悠月', '平岡優希', '吉河秀峰', '佐川葵', '阿部翔平', 
      '佐々木小雪', '堂山知輝', '大田慶悟', '宇野慎一郎'
    ];
    const names4th = [
      '宮本海輝', '川口幸大', '稲井日葵梨', '室峰千帆里', '二宮ここな', '北野真琴', '福山圭輔', '長田了哉', '長谷川美登', 'ニパード恵理咲シラー', 
      '佐藤夕衣奈', '阿部悠人', '山本新', '大屋颯太', '藤井綜汰', '久原大和', '井坪そうた'
    ];

    const mockMembers: Member[] = [
        ...names2nd.map((name, i) => ({ id: `m2_${i}`, name, tagId: 't2nd' })),
        ...names3rd.map((name, i) => ({ id: `m3_${i}`, name, tagId: 't3rd' })),
        ...names4th.map((name, i) => ({ id: `m4_${i}`, name, tagId: 't4th' })),
    ];

    setTags(mockTags);
    setMembers(mockMembers);
    
    // Total 56 members. Create 10 tables of 6 (60 seats)
    setConfig({
      tableDefinitions: Array.from({ length: 10 }, (_, i) => ({
        id: `t_${i}`, 
        capacity: 6
      }))
    });
  };

  // Step Navigation
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="relative max-w-md mx-auto h-[100dvh] overflow-hidden font-sans bg-[#F8FAFC]">
      
      {/* Liquid Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[50%] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute top-[10%] right-[-20%] w-[70%] h-[50%] bg-cyan-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[80%] h-[50%] bg-pink-200/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content with Glass Effect Context */}
      <main className="flex-1 h-full overflow-hidden relative z-10 flex flex-col">
        {step === 1 && (
          <Step1Settings 
            config={config} 
            setConfig={setConfig} 
            members={members}
            setMembers={setMembers}
            onNext={nextStep}
            onLoadMock={loadMockData}
          />
        )}
        {step === 2 && (
          <Step2Members 
            members={members} 
            setMembers={setMembers} 
            tags={tags}
            setTags={setTags}
            onNext={nextStep}
            onBack={prevStep}
            maxCapacity={config.tableDefinitions.reduce((sum, t) => sum + t.capacity, 0)}
          />
        )}
        {step === 3 && (
          <Step3Results 
            members={members} 
            tags={tags}
            config={config} 
            onBack={prevStep} 
          />
        )}
      </main>
    </div>
  );
};

export default App;