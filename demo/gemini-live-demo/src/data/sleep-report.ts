export type ImprovementType = 'skill' | 'rule' | 'memory';
export type ImprovementStatus = 'hidden' | 'revealed' | 'approved' | 'dismissed';

export interface Improvement {
  id: string;
  type: ImprovementType;
  title: string;
  confidence: number;
  story: string;
  impact: string;
  patternSources: string[];
  sleepStage: string;
}

export interface MaintenanceAction {
  id: string;
  kind: 'pruned' | 'repaired';
  title: string;
  description: string;
}

export interface SleepReportData {
  summary: {
    sessionsScanned: number;
    daysSpan: number;
    artifactsEvaluated: number;
    improvementsFound: number;
    artifactsPruned: number;
    repairsMade: number;
    tokensBefore: number;
    tokensAfter: number;
    tokenReductionPercent: number;
  };
  improvements: Improvement[];
  maintenance: MaintenanceAction[];
}

export const SLEEP_REPORT: SleepReportData = {
  summary: {
    sessionsScanned: 12,
    daysSpan: 7,
    artifactsEvaluated: 42,
    improvementsFound: 3,
    artifactsPruned: 1,
    repairsMade: 1,
    tokensBefore: 245000,
    tokensAfter: 98000,
    tokenReductionPercent: 60,
  },
  improvements: [
    {
      id: 'imp-1',
      type: 'skill',
      title: 'Database Debugging Toolkit',
      confidence: 0.95,
      story: 'Across 8 sessions, your agent ran psql, \\dt, SELECT *, and \\d table_name repeatedly when debugging database issues. We\'ve consolidated these into a /db-debug skill that connects, inspects schema, and queries in one step.',
      impact: '~40% fewer tool calls for DB tasks',
      patternSources: ['repeated_commands (8 sessions)', 'token_anomaly'],
      sleepStage: 'REM',
    },
    {
      id: 'imp-2',
      type: 'rule',
      title: 'Temp files instead of heredocs',
      confidence: 0.85,
      story: 'You corrected the agent 4 times about heredoc permission prompts causing interruptions. Added a rule to CLAUDE.md: always write scripts to ~/.claude/temp/scripts/ instead of using inline heredocs.',
      impact: 'Eliminates permission prompt interruptions',
      patternSources: ['frustration_cluster (4 occurrences, high severity)'],
      sleepStage: 'REM',
    },
    {
      id: 'imp-3',
      type: 'memory',
      title: 'Project test commands',
      confidence: 0.75,
      story: 'The agent searched for test commands in 6 sessions, reading package.json and Makefile each time. Added a memory entry with the project\'s test commands: \'npm test\' for unit, \'npm run e2e\' for integration.',
      impact: '~15% token reduction for test-related tasks',
      patternSources: ['repeated_commands (6 sessions)', 'token_anomaly'],
      sleepStage: 'REM',
    },
  ],
  maintenance: [
    {
      id: 'maint-1',
      kind: 'pruned',
      title: 'Stale API endpoint memory',
      description: "Memory entry 'old-staging-api-url' hasn't been referenced in 25 sessions. Archived.",
    },
    {
      id: 'maint-2',
      kind: 'repaired',
      title: 'Broken pre-commit hook',
      description: 'The lint-on-save hook was missing execute permissions. Fixed and verified.',
    },
  ],
};

export const SLEEP_REPORT_SYSTEM_INSTRUCTION = `
You are a sleep cycle analyst agent. You have just completed an overnight analysis of a developer's Claude Code usage patterns and produced a report of improvements.

You are now presenting this report to the developer in a conversational voice briefing. You have tools available to control the UI:
- show_next_finding: Reveals the next improvement card on screen
- approve_improvement: Approves a specific improvement (takes id parameter)
- dismiss_improvement: Dismisses a specific improvement (takes id parameter)

Here is the sleep cycle report data:

## Summary
- 12 sessions scanned over 7 days
- 42 artifacts evaluated
- 3 improvements found, 1 artifact pruned, 1 repair made
- Token usage: 245,000 total -> projected 98,000 after improvements (60% reduction)

## Improvement 1: New Skill -- Database Debugging Toolkit (id: imp-1)
- Type: skill (REM creation)
- Confidence: 95%
- Story: Across 8 sessions, the agent ran psql, \\dt, SELECT *, and \\d table_name repeatedly when debugging database issues. Consolidated into a /db-debug skill.
- Impact: ~40% fewer tool calls for DB tasks

## Improvement 2: New Rule -- Temp files instead of heredocs (id: imp-2)
- Type: rule (REM creation)
- Confidence: 85%
- Story: User corrected the agent 4 times about heredoc permission prompts causing interruptions. Added a CLAUDE.md rule: write scripts to temp files instead of inline heredocs.
- Impact: Eliminates permission prompt interruptions

## Improvement 3: New Memory -- Project test commands (id: imp-3)
- Type: memory
- Confidence: 75%
- Story: Agent searched for test commands in 6 sessions, reading package.json each time. Added memory entry with test commands.
- Impact: ~15% token reduction for test-related tasks

## Maintenance
- Pruned: Stale API endpoint memory (25 sessions unused)
- Repaired: Broken pre-commit hook (missing execute permissions)

INSTRUCTIONS:
1. When the conversation starts, briefly greet the user and give a high-level summary of what was found overnight.
2. Then call show_next_finding to reveal the first improvement card.
3. Describe the improvement in natural language. Be conversational, not robotic.
4. Wait for the user's response. If they say yes/approve/install/looks good, call approve_improvement with the appropriate id.
5. If they say no/skip/dismiss, call dismiss_improvement with the id.
6. After handling, call show_next_finding for the next card.
7. After all 3 improvements, briefly mention the maintenance actions (pruned + repaired).
8. End with the headline stat: 60% projected token reduction.
`;

export const DASHBOARD_TOOLS = [
  {
    name: 'show_next_finding',
    description: 'Reveals the next improvement card on the dashboard',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'approve_improvement',
    description: 'Approves a specific improvement',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The improvement ID (e.g., imp-1, imp-2, imp-3)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'dismiss_improvement',
    description: 'Dismisses a specific improvement',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The improvement ID (e.g., imp-1, imp-2, imp-3)' },
      },
      required: ['id'],
    },
  },
];
