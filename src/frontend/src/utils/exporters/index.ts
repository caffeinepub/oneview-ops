export async function exportToCSV(dashboard: string, filters: any) {
  const data = generateCSVData(dashboard, filters);
  const csv = convertToCSV(data);
  downloadFile(csv, `${dashboard}-export.csv`, 'text/csv');
}

export async function exportToPDF(dashboard: string, filters: any) {
  const content = `OneView Ops - ${dashboard}\n\nDate Range: ${filters.dateRange || 'All time'}\n\nThis is a prototype PDF export.\nIn production, this would include charts and detailed metrics.`;
  downloadFile(content, `${dashboard}-export.pdf`, 'application/pdf');
}

export async function exportToPPT(dashboard: string, filters: any) {
  const content = `OneView Ops - ${dashboard}\n\nDate Range: ${filters.dateRange || 'All time'}\n\nThis is a prototype PPT export.\nIn production, this would include slides with charts and KPIs.`;
  downloadFile(content, `${dashboard}-export.pptx`, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
}

function generateCSVData(dashboard: string, filters: any) {
  return [
    ['Metric', 'Value'],
    ['Dashboard', dashboard],
    ['Date Range', filters.dateRange || 'All time'],
    ['Recruiter', filters.recruiter || 'All'],
    ['Client', filters.client || 'All'],
  ];
}

function convertToCSV(data: string[][]) {
  return data.map(row => row.join(',')).join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
