export function parseQuery(query: string) {
  const lowerQuery = query.toLowerCase();

  let template = 'Leadership Dashboard';
  let dashboardPath = '/dashboard/leadership';
  let dateRange = 'Last 30 days';
  let groupBy: string | undefined = undefined;

  if (lowerQuery.includes('recruiter')) {
    template = 'Recruiter Dashboard';
    dashboardPath = '/dashboard/recruiter';
  } else if (lowerQuery.includes('ops') || lowerQuery.includes('utilization') || lowerQuery.includes('contractor')) {
    template = 'Ops/HR Dashboard';
    dashboardPath = '/dashboard/ops';
  } else if (lowerQuery.includes('funnel')) {
    template = 'Funnel Analysis';
    dashboardPath = '/analysis/funnel';
  } else if (lowerQuery.includes('interview') || lowerQuery.includes('offer') || lowerQuery.includes('placement')) {
    if (lowerQuery.includes('recruiter')) {
      template = 'Recruiter Dashboard';
      dashboardPath = '/dashboard/recruiter';
    } else {
      template = 'Leadership Dashboard';
      dashboardPath = '/dashboard/leadership';
    }
  } else if (lowerQuery.includes('revenue') || lowerQuery.includes('margin')) {
    template = 'Leadership Dashboard';
    dashboardPath = '/dashboard/leadership';
  }

  if (lowerQuery.includes('last week') || lowerQuery.includes('this week')) {
    dateRange = 'Last 7 days';
  } else if (lowerQuery.includes('last month') || lowerQuery.includes('this month')) {
    dateRange = 'Last 30 days';
  } else if (lowerQuery.includes('q1') || lowerQuery.includes('quarter')) {
    dateRange = 'Last 90 days';
  } else if (lowerQuery.includes('year') || lowerQuery.includes('ytd')) {
    dateRange = 'Last 365 days';
  }

  if (lowerQuery.includes('by client')) {
    groupBy = 'client';
  } else if (lowerQuery.includes('by recruiter')) {
    groupBy = 'recruiter';
  } else if (lowerQuery.includes('by team')) {
    groupBy = 'team';
  }

  return {
    template,
    dashboardPath,
    filters: {
      dateRange,
      groupBy,
    },
  };
}
