/** Collect all checklist items under headings that are *exactly* "## To-Do". */
export function buildTodoMap(md: string): Record<string, boolean> | null {
  const headingRE = /^##\s+to-do\s*$/i; // "## To-Do" ONLY
  const checklistRE = /^\s*-\s*\[([ xX])\]\s+(.*)$/; // "- [ ] Task" or "- [x] Task"

  const lines = md.split(/\r?\n/);
  const map: Record<string, boolean> = {};

  for (let i = 0; i < lines.length; i++) {
    if (!headingRE.test(lines[i])) continue; // skip non-exact headings

    for (i = i + 1; i < lines.length && !/^##\s+/.test(lines[i]); i++) {
      const m = lines[i].match(checklistRE);
      if (m) map[m[2].trim()] = m[1].toLowerCase() === "x";
    }
  }

  return Object.keys(map).length ? map : null;
}
