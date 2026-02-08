/**
 * Sample data generators for dashboards, metrics, alerts, and user mappings
 * with extended KPI support. All functions accept filters and return deterministic
 * values for prototype consistency. Now uses star-schema as source of truth.
 */

import type { FilterCriteria } from '../utils/filters';
import {
  dimRecruiters,
  dimJobs,
  dimClients,
  factCalls,
  factHours,
  factPipeline,
  factPlacements,
} from './analyticsSchema';
import {
  filterCalls,
  filterHours,
  filterPipeline,
  filterPlacements,
} from '../utils/filters';

export function generateDashboardMetrics(filters: FilterCriteria) {
  const calls = filterCalls(factCalls, filters, dimRecruiters);
  const hours = filterHours(factHours, filters, dimRecruiters);
  const pipeline = filterPipeline(factPipeline, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);

  const totalCalls = calls.length;
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  const pipelineMoves = pipeline.length;
  const totalPlacements = placements.length;
  const interviews = pipeline.filter((p) => p.pipeline_stage === 'interview').length;
  const offers = pipeline.filter((p) => p.pipeline_stage === 'offer').length;
  const totalRevenue = placements.reduce((sum, p) => sum + (p.revenue_amount || 0), 0);

  return {
    calls: totalCalls,
    hours: totalHours,
    pipelineMoves,
    placements: totalPlacements,
    interviews,
    offers,
    revenue: totalRevenue,
    margin: totalRevenue * 0.25, // 25% margin for prototype
    activeContractors: Math.floor(totalPlacements * 0.6),
    activeRecruiters: dimRecruiters.filter((r) => r.is_active).length,
  };
}

export function generateFunnelData(filters: FilterCriteria) {
  const calls = filterCalls(factCalls, filters, dimRecruiters);
  const hours = filterHours(factHours, filters, dimRecruiters);
  const pipeline = filterPipeline(factPipeline, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);

  const submissions = pipeline.filter((p) => p.pipeline_stage === 'submitted').length;
  const interviews = pipeline.filter((p) => p.pipeline_stage === 'interview').length;
  const offers = pipeline.filter((p) => p.pipeline_stage === 'offer').length;

  return [
    { stage: 'Calls', value: calls.length, conversion: 100 },
    { stage: 'Hours', value: Math.round(hours.reduce((sum, h) => sum + h.hours_logged, 0)), conversion: 85 },
    { stage: 'Submissions', value: submissions, conversion: 65 },
    { stage: 'Interviews', value: interviews, conversion: 45 },
    { stage: 'Offers', value: offers, conversion: 25 },
    { stage: 'Placements', value: placements.length, conversion: 15 },
  ];
}

export function generateTrendData(filters: FilterCriteria) {
  // Generate 12 months of trend data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, idx) => ({
    month,
    placements: 8 + Math.floor(Math.sin(idx) * 3) + idx % 3,
    calls: 180 + Math.floor(Math.cos(idx) * 30) + idx * 5,
    hours: 140 + Math.floor(Math.sin(idx) * 20) + idx * 2,
  }));
}

export function generateAlerts(filters: FilterCriteria) {
  return [
    {
      id: 1,
      severity: 'high' as const,
      title: 'Pipeline Stagnation Detected',
      message: 'Multiple candidates stuck in interview stage',
      rule: 'Candidates in interview stage for >14 days',
      impactedEntity: '3 candidates',
      timestamp: '2 hours ago',
      acknowledged: false,
    },
    {
      id: 2,
      severity: 'medium' as const,
      title: 'High Hours, Low Output',
      message: 'Recruiter activity not converting to placements',
      rule: 'Recruiter logged >50 hours with 0 placements',
      impactedEntity: 'Sarah Johnson',
      timestamp: '5 hours ago',
      acknowledged: false,
    },
    {
      id: 3,
      severity: 'low' as const,
      title: 'Data Quality Issue',
      message: 'Missing recruiter email in call records',
      rule: 'Missing recruiter email in 3 call records',
      impactedEntity: 'Aircall integration',
      timestamp: '1 day ago',
      acknowledged: true,
    },
  ];
}

export function generateUserMappings() {
  return dimRecruiters.map((recruiter, idx) => ({
    canisterUser: recruiter.recruiter_name,
    loxoUserId: recruiter.recruiter_id,
    aircallUserId: `ac-${recruiter.recruiter_id}`,
    timesheetUserId: `ts-${recruiter.recruiter_id}`,
    autoMatched: true,
    email: recruiter.recruiter_email,
  }));
}

export function generateInterviewActivity(filters: FilterCriteria) {
  const pipeline = filterPipeline(factPipeline, filters, dimRecruiters);
  const interviews = pipeline.filter((p) => p.pipeline_stage === 'interview');

  return interviews.slice(0, 5).map((interview, idx) => {
    const recruiter = dimRecruiters.find((r) => r.recruiter_id === interview.recruiter_id);
    const job = dimJobs.find((j) => j.job_id === interview.job_id);
    
    return {
      candidate: `Candidate ${interview.candidate_id.split('-')[1]}`,
      job: job?.job_title || 'Unknown Job',
      recruiter: recruiter?.recruiter_name || 'Unknown',
      date: interview.stage_start_date.toISOString().split('T')[0],
      status: 'Scheduled',
    };
  });
}

export function generateOfferActivity(filters: FilterCriteria) {
  const pipeline = filterPipeline(factPipeline, filters, dimRecruiters);
  const offers = pipeline.filter((p) => p.pipeline_stage === 'offer');

  return offers.slice(0, 5).map((offer, idx) => {
    const recruiter = dimRecruiters.find((r) => r.recruiter_id === offer.recruiter_id);
    const job = dimJobs.find((j) => j.job_id === offer.job_id);
    
    return {
      candidate: `Candidate ${offer.candidate_id.split('-')[1]}`,
      job: job?.job_title || 'Unknown Job',
      recruiter: recruiter?.recruiter_name || 'Unknown',
      date: offer.stage_start_date.toISOString().split('T')[0],
      status: offer.stage_end_date ? 'Accepted' : 'Pending',
    };
  });
}

export function generatePipelineMovement(filters: FilterCriteria) {
  const pipeline = filterPipeline(factPipeline, filters, dimRecruiters);

  return pipeline.slice(0, 10).map((move) => {
    const recruiter = dimRecruiters.find((r) => r.recruiter_id === move.recruiter_id);
    const job = dimJobs.find((j) => j.job_id === move.job_id);
    
    return {
      candidate: `Candidate ${move.candidate_id.split('-')[1]}`,
      fromStage: move.pipeline_stage === 'sourced' ? 'New' : 'Previous Stage',
      toStage: move.pipeline_stage.charAt(0).toUpperCase() + move.pipeline_stage.slice(1),
      job: job?.job_title || 'Unknown Job',
      recruiter: recruiter?.recruiter_name || 'Unknown',
      date: move.stage_start_date.toISOString().split('T')[0],
    };
  });
}

// Additional helper functions for dashboard pages
export function generateRecruiterMetrics(filters: FilterCriteria) {
  const calls = filterCalls(factCalls, filters, dimRecruiters);
  const hours = filterHours(factHours, filters, dimRecruiters);
  const pipeline = filterPipeline(factPipeline, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);

  const totalCalls = calls.length;
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  const billableHours = hours.filter((h) => h.is_billable).reduce((sum, h) => sum + h.hours_logged, 0);
  const avgCallDuration = calls.length > 0 
    ? Math.round(calls.reduce((sum, c) => sum + c.call_duration_sec, 0) / calls.length / 60) 
    : 0;

  return {
    totalCalls,
    totalHours: Math.round(totalHours),
    billableHours: Math.round(billableHours),
    avgCallDuration,
    pipelineMoves: pipeline.length,
    placements: placements.length,
    interviews: pipeline.filter((p) => p.pipeline_stage === 'interview').length,
    offers: pipeline.filter((p) => p.pipeline_stage === 'offer').length,
  };
}

export function generateInterviewOfferData(filters: FilterCriteria) {
  const interviews = generateInterviewActivity(filters);
  const offers = generateOfferActivity(filters);
  
  return [
    ...interviews.map((i) => ({ ...i, event: 'Interview', stage: 'Interview' })),
    ...offers.map((o) => ({ ...o, event: 'Offer', stage: o.status })),
  ].slice(0, 10);
}

export function generateOpsMetrics(filters: FilterCriteria) {
  const hours = filterHours(factHours, filters, dimRecruiters);
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  const billableHours = hours.filter((h) => h.is_billable).reduce((sum, h) => sum + h.hours_logged, 0);
  
  return {
    utilization: totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0,
    burnoutRisk: 'Low',
    dataCompleteness: 94,
    activeContractors: Math.floor(filterPlacements(factPlacements, filters, dimRecruiters, dimJobs).length * 0.6),
  };
}

export function generateDataGaps(filters: FilterCriteria) {
  return [
    { system: 'Loxo', field: 'candidate_source', count: 3 },
    { system: 'Aircall', field: 'call_notes', count: 12 },
    { system: 'Timesheets', field: 'project_code', count: 5 },
  ];
}

export function generateFunnelAnalysis(filters: FilterCriteria) {
  const calls = filterCalls(factCalls, filters, dimRecruiters);
  const hours = filterHours(factHours, filters, dimRecruiters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);

  const totalCalls = calls.length;
  const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
  const outcomes = placements.length;

  return {
    calls: totalCalls,
    hours: Math.round(totalHours),
    outcomes,
    avgCallsPerDay: Math.round(totalCalls / 30),
    hoursPerCall: totalCalls > 0 ? (totalHours / totalCalls).toFixed(2) : '0',
    callsPerOutcome: outcomes > 0 ? Math.round(totalCalls / outcomes) : 0,
    hoursPerOutcome: outcomes > 0 ? Math.round(totalHours / outcomes) : 0,
    conversionRate: totalCalls > 0 ? ((outcomes / totalCalls) * 100).toFixed(1) : '0',
  };
}

export function generateTopPerformers(filters: FilterCriteria) {
  return dimRecruiters.slice(0, 5).map((recruiter, idx) => {
    const recruiterFilters = { ...filters, recruiter: recruiter.recruiter_name.toLowerCase().replace(' ', '-') };
    const calls = filterCalls(factCalls, recruiterFilters, dimRecruiters);
    const hours = filterHours(factHours, recruiterFilters, dimRecruiters);
    const placements = filterPlacements(factPlacements, recruiterFilters, dimRecruiters, dimJobs);

    const totalHours = hours.reduce((sum, h) => sum + h.hours_logged, 0);
    const efficiency = totalHours > 0 ? (placements.length / totalHours).toFixed(2) : '0.00';

    return {
      name: recruiter.recruiter_name,
      calls: calls.length,
      hours: Math.round(totalHours),
      outcomes: placements.length,
      efficiency,
    };
  });
}

// Leadership dashboard specific functions
export function getRevenueMetrics(filters: FilterCriteria) {
  const metrics = generateDashboardMetrics(filters);
  const placements = filterPlacements(factPlacements, filters, dimRecruiters, dimJobs);
  
  const avgTimeToFill = placements.length > 0
    ? Math.round(placements.reduce((sum, p) => sum + p.time_to_fill_days, 0) / placements.length)
    : 0;

  return {
    placements: metrics.placements,
    interviews: metrics.interviews,
    offers: metrics.offers,
    activeContractors: metrics.activeContractors,
    revenue: metrics.revenue,
    margin: 25, // 25% margin
    avgTimeToFill,
    activeRecruiters: metrics.activeRecruiters,
  };
}

export function getOutcomeTrend(filters: FilterCriteria) {
  return generateTrendData(filters);
}

export function getFunnelData(filters: FilterCriteria) {
  return generateFunnelData(filters);
}
