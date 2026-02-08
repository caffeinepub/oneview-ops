/**
 * Star-schema sample data module for OneView Ops analytics.
 * Provides fact and dimension tables with deterministic master join logic.
 * 
 * Master Join Logic:
 * - Primary join key: recruiter_email (consistent across all systems)
 * - Secondary: recruiter_id (fallback when email not available)
 * - Time-series joins: via date fields
 * - Job-level joins: via job_id
 */

// ============ DIMENSION TABLES ============

export interface DimRecruiter {
  recruiter_id: string;
  recruiter_email: string;
  recruiter_name: string;
  recruiter_role: string;
  is_active: boolean;
  team?: string;
}

export interface DimJob {
  job_id: string;
  job_title: string;
  client_name: string;
  job_status: 'open' | 'closed' | 'filled';
  job_open_date: Date;
  job_close_date?: Date;
  owner_recruiter_id: string;
}

export interface DimClient {
  client_id: string;
  client_name: string;
  industry?: string;
}

export interface DimDate {
  date: Date;
  year: number;
  quarter: number;
  month: number;
  week: number;
  day_of_week: number;
}

// ============ FACT TABLES ============

export interface FactCall {
  call_id: string;
  recruiter_email: string;
  call_direction: 'inbound' | 'outbound';
  call_duration_sec: number;
  call_datetime: Date;
  is_missed: boolean;
}

export interface FactHours {
  timesheet_id: string;
  recruiter_email: string;
  work_date: Date;
  hours_logged: number;
  is_billable: boolean;
  client_name?: string;
  job_id?: string;
}

export interface FactPipeline {
  pipeline_id: string;
  candidate_id: string;
  job_id: string;
  recruiter_id: string;
  pipeline_stage: 'sourced' | 'submitted' | 'interview' | 'offer' | 'placed';
  stage_start_date: Date;
  stage_end_date?: Date;
}

export interface FactPlacement {
  placement_id: string;
  placement_date: Date;
  recruiter_id: string;
  job_id: string;
  candidate_id: string;
  revenue_amount?: number; // Agency only
  time_to_fill_days: number;
}

// ============ SAMPLE DATA ============

const today = new Date();
const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
const last90Days = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

export const dimRecruiters: DimRecruiter[] = [
  {
    recruiter_id: 'rec-001',
    recruiter_email: 'sarah.johnson@company.com',
    recruiter_name: 'Sarah Johnson',
    recruiter_role: 'Senior Recruiter',
    is_active: true,
    team: 'Team Alpha',
  },
  {
    recruiter_id: 'rec-002',
    recruiter_email: 'mike.chen@company.com',
    recruiter_name: 'Mike Chen',
    recruiter_role: 'Recruiter',
    is_active: true,
    team: 'Team Alpha',
  },
  {
    recruiter_id: 'rec-003',
    recruiter_email: 'emily.rodriguez@company.com',
    recruiter_name: 'Emily Rodriguez',
    recruiter_role: 'Lead Recruiter',
    is_active: true,
    team: 'Team Beta',
  },
  {
    recruiter_id: 'rec-004',
    recruiter_email: 'david.kim@company.com',
    recruiter_name: 'David Kim',
    recruiter_role: 'Recruiter',
    is_active: true,
    team: 'Team Beta',
  },
  {
    recruiter_id: 'rec-005',
    recruiter_email: 'lisa.patel@company.com',
    recruiter_name: 'Lisa Patel',
    recruiter_role: 'Senior Recruiter',
    is_active: true,
    team: 'Team Alpha',
  },
];

export const dimJobs: DimJob[] = [
  {
    job_id: 'job-001',
    job_title: 'Senior Software Engineer',
    client_name: 'TechCorp Inc',
    job_status: 'open',
    job_open_date: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000),
    owner_recruiter_id: 'rec-001',
  },
  {
    job_id: 'job-002',
    job_title: 'Product Manager',
    client_name: 'Finance Co',
    job_status: 'filled',
    job_open_date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
    job_close_date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
    owner_recruiter_id: 'rec-003',
  },
  {
    job_id: 'job-003',
    job_title: 'Data Analyst',
    client_name: 'Health Systems',
    job_status: 'open',
    job_open_date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    owner_recruiter_id: 'rec-002',
  },
  {
    job_id: 'job-004',
    job_title: 'UX Designer',
    client_name: 'TechCorp Inc',
    job_status: 'open',
    job_open_date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000),
    owner_recruiter_id: 'rec-004',
  },
  {
    job_id: 'job-005',
    job_title: 'DevOps Engineer',
    client_name: 'Finance Co',
    job_status: 'filled',
    job_open_date: new Date(today.getTime() - 75 * 24 * 60 * 60 * 1000),
    job_close_date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
    owner_recruiter_id: 'rec-005',
  },
];

export const dimClients: DimClient[] = [
  { client_id: 'client-001', client_name: 'TechCorp Inc', industry: 'Technology' },
  { client_id: 'client-002', client_name: 'Finance Co', industry: 'Finance' },
  { client_id: 'client-003', client_name: 'Health Systems', industry: 'Healthcare' },
];

// Generate fact data
export const factCalls: FactCall[] = [];
export const factHours: FactHours[] = [];
export const factPipeline: FactPipeline[] = [];
export const factPlacements: FactPlacement[] = [];

// Generate calls (deterministic)
let callIdCounter = 1;
dimRecruiters.forEach((recruiter, idx) => {
  const callsPerDay = 8 + (idx * 3);
  for (let day = 0; day < 30; day++) {
    const date = new Date(today.getTime() - day * 24 * 60 * 60 * 1000);
    for (let i = 0; i < callsPerDay; i++) {
      factCalls.push({
        call_id: `call-${callIdCounter++}`,
        recruiter_email: recruiter.recruiter_email,
        call_direction: i % 3 === 0 ? 'inbound' : 'outbound',
        call_duration_sec: Math.floor(180 + (idx * 60) + (i * 30)),
        call_datetime: new Date(date.getTime() + i * 60 * 60 * 1000),
        is_missed: i % 15 === 0,
      });
    }
  }
});

// Generate hours (deterministic)
let timesheetIdCounter = 1;
dimRecruiters.forEach((recruiter, idx) => {
  const hoursPerDay = 7 + idx;
  for (let day = 0; day < 30; day++) {
    const date = new Date(today.getTime() - day * 24 * 60 * 60 * 1000);
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Weekdays only
      factHours.push({
        timesheet_id: `ts-${timesheetIdCounter++}`,
        recruiter_email: recruiter.recruiter_email,
        work_date: date,
        hours_logged: hoursPerDay + (Math.sin(day) * 0.5),
        is_billable: true,
        client_name: dimClients[idx % dimClients.length].client_name,
      });
    }
  }
});

// Generate pipeline movements (deterministic)
let pipelineIdCounter = 1;
let candidateIdCounter = 1;
dimRecruiters.forEach((recruiter, idx) => {
  const stages: FactPipeline['pipeline_stage'][] = ['sourced', 'submitted', 'interview', 'offer', 'placed'];
  for (let c = 0; c < 5 + idx * 2; c++) {
    const candidateId = `cand-${candidateIdCounter++}`;
    const jobId = dimJobs[c % dimJobs.length].job_id;
    
    stages.forEach((stage, stageIdx) => {
      if (stageIdx <= 2 + idx) { // Different recruiters progress candidates differently
        const daysAgo = 30 - (c * 2) - (stageIdx * 3);
        factPipeline.push({
          pipeline_id: `pipe-${pipelineIdCounter++}`,
          candidate_id: candidateId,
          job_id: jobId,
          recruiter_id: recruiter.recruiter_id,
          pipeline_stage: stage,
          stage_start_date: new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000),
          stage_end_date: stageIdx < 2 + idx ? new Date(today.getTime() - (daysAgo - 2) * 24 * 60 * 60 * 1000) : undefined,
        });
      }
    });
  }
});

// Generate placements (deterministic)
let placementIdCounter = 1;
dimRecruiters.forEach((recruiter, idx) => {
  const placementsCount = 2 + Math.floor(idx / 2);
  for (let p = 0; p < placementsCount; p++) {
    const daysAgo = 10 + (p * 8) + (idx * 3);
    const jobIdx = (idx + p) % dimJobs.length;
    factPlacements.push({
      placement_id: `place-${placementIdCounter++}`,
      placement_date: new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000),
      recruiter_id: recruiter.recruiter_id,
      job_id: dimJobs[jobIdx].job_id,
      candidate_id: `cand-${p + 1}`,
      revenue_amount: 15000 + (idx * 5000) + (p * 2000),
      time_to_fill_days: 35 + (idx * 5) + (p * 3),
    });
  }
});

// ============ JOIN HELPERS ============

/**
 * Join recruiter by email (primary) or ID (fallback)
 */
export function joinRecruiter(emailOrId: string): DimRecruiter | undefined {
  return dimRecruiters.find(
    (r) => r.recruiter_email === emailOrId || r.recruiter_id === emailOrId
  );
}

/**
 * Join job by ID
 */
export function joinJob(jobId: string): DimJob | undefined {
  return dimJobs.find((j) => j.job_id === jobId);
}

/**
 * Join client by name
 */
export function joinClient(clientName: string): DimClient | undefined {
  return dimClients.find((c) => c.client_name === clientName);
}

/**
 * Get recruiter's team
 */
export function getRecruiterTeam(recruiterId: string): string | undefined {
  const recruiter = dimRecruiters.find((r) => r.recruiter_id === recruiterId);
  return recruiter?.team;
}

/**
 * Get all team members
 */
export function getTeamMembers(team: string): DimRecruiter[] {
  return dimRecruiters.filter((r) => r.team === team);
}

/**
 * Get unique teams
 */
export function getUniqueTeams(): string[] {
  return Array.from(new Set(dimRecruiters.map((r) => r.team).filter(Boolean))) as string[];
}
