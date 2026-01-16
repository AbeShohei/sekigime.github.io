export type Tag = {
  id: string;
  label: string;
  color: string; // Tailwind color class
};

export type Member = {
  id: string;
  name: string;
  tagId: string | null;
};

export type TableDefinition = {
  id: string;
  capacity: number;
};

export type Table = {
  id: string; // Changed to string to match definition ID
  name: string;
  capacity: number;
  members: Member[];
};

export type AppConfig = {
  tableDefinitions: TableDefinition[];
};

// Expanded palette for dynamic tags
export const TAG_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-red-100 text-red-700 border-red-200',
  'bg-lime-100 text-lime-700 border-lime-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
];

export const UNTAGGED_COLOR = 'bg-gray-100 text-gray-600 border-gray-200';

export const SUGGESTED_GROUPS = ['会社', '親戚', 'テニス部', '高校友人', '大学友人', '地元'];