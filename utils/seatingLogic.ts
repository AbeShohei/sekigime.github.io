import { Member, Table, TableDefinition } from '../types';

/**
 * Fisher-Yates Shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * Generates seating arrangement.
 * Mode: 'dispersion' tries to separate members with same tags.
 * New Logic: Prioritize filling tables sequentially to minimize empty seats in used tables.
 */
export const generateSeating = (
  members: Member[],
  tableDefinitions: TableDefinition[]
): { tables: Table[]; unassigned: Member[] } => {
  
  // Initialize empty tables based on definitions
  const tables: Table[] = tableDefinitions.map((def, i) => ({
    id: def.id,
    name: `Table ${String.fromCharCode(65 + i)}`, // Table A, B, C...
    capacity: def.capacity,
    members: [],
  }));

  // 1. Group members by tag
  const groupedMembers: Record<string, Member[]> = {};
  const untaggedMembers: Member[] = [];

  members.forEach((m) => {
    if (m.tagId) {
      if (!groupedMembers[m.tagId]) {
        groupedMembers[m.tagId] = [];
      }
      groupedMembers[m.tagId].push(m);
    } else {
      untaggedMembers.push(m);
    }
  });

  // 2. Shuffle internally within groups to ensure randomness
  Object.keys(groupedMembers).forEach((key) => {
    groupedMembers[key] = shuffleArray(groupedMembers[key]);
  });
  const shuffledUntagged = shuffleArray(untaggedMembers);

  // 3. Create a master list for distribution (Dispersion List).
  // Strategy: Pick one from each group in round-robin fashion to create a well-mixed single line.
  let dispersionList: Member[] = [];
  const groups = Object.values(groupedMembers);
  // Sort groups by length descending to handle largest groups first if needed, 
  // but for simple mixing, we just need to interleave them.
  
  let maxLen = 0;
  groups.forEach(g => maxLen = Math.max(maxLen, g.length));

  for (let i = 0; i < maxLen; i++) {
    groups.forEach(group => {
      if (group[i]) {
        dispersionList.push(group[i]);
      }
    });
  }

  // Add untagged members dispersed or at the end? 
  // To mix untagged members well, we can insert them randomly or just append.
  // Let's shuffle dispersionList slightly? No, that ruins the interleaving.
  // Just append untagged for now, or interleave them if we treat them as a group.
  // Let's treat untagged as just another group for the interleaving process above?
  // No, untagged don't conflict with each other. Appending is safer, or distribute them.
  dispersionList = [...dispersionList, ...shuffledUntagged];


  // 4. Distribute Sequentially (Fill one table, then next)
  // This satisfies "Use half or more capacity priority" and "Allow empty tables".
  const unassigned: Member[] = [];
  let currentTableIndex = 0;

  dispersionList.forEach((member) => {
    // Find current available table
    while (
      currentTableIndex < tables.length && 
      tables[currentTableIndex].members.length >= tables[currentTableIndex].capacity
    ) {
      currentTableIndex++;
    }

    if (currentTableIndex < tables.length) {
      tables[currentTableIndex].members.push(member);
    } else {
      unassigned.push(member);
    }
  });

  return { tables, unassigned };
};