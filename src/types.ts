export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'legal_officer' | 'compliance_manager' | 'viewer';
  department?: string;
  createdAt: string;
}

export interface ComplianceTask {
  id: string;
  circularId: string;
  title: string;
  description: string;
  assignedTo: string;
  department: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityId: string;
  entityType: string;
  timestamp: string;
  details: string;
}

export interface Circular {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  status: 'New' | 'Analyzed' | 'Action Taken';
  category?: 'Compliance' | 'Penalty' | 'Scope' | 'Procedural';
  riskScore?: number;
  summary?: string;
  region: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  lastUpdated: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details: string;
}

export interface CausalLink {
  from: string;
  to: string;
  impact: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface ImpactAnalysis {
  circularId: string;
  riskScore: number;
  summary: string;
  affectedDepartments: string[];
  impactedProducts: string[];
  impactedContracts: string[];
  impactedPolicies: string[];
  affectedEntities?: {
    name: string;
    type: string;
    impact: 'High' | 'Medium' | 'Low';
    reason: string;
  }[];
  causalChain: CausalLink[];
  predictiveInsight: string;
  diff: {
    type: 'semantic' | 'structural';
    changes: string[];
  };
}

export interface SimulationResult {
  scenario: string;
  impactScore: number;
  mitigationStrategy: string;
}

export interface Draft {
  type: 'Policy' | 'Contract' | 'Checklist';
  title: string;
  content: string;
  originalContent?: string;
  justification: string;
}
