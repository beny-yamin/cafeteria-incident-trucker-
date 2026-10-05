export const USER_ROLES = {
  STUDENT: 'student',
  INSPECTOR: 'inspector',
  ADMIN: 'admin'
};

export const INCIDENT_STATUSES = {
  SUBMITTED: {
    label: 'Submitted',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)'
  },
  ACTION_TAKEN: {
    label: 'Action Taken',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)'
  },
  DISMISSED: {
    label: 'Dismissed',
    color: '#9ca3af',
    bg: 'rgba(156, 163, 175, 0.15)',
    border: 'rgba(156, 163, 175, 0.3)'
  }
};

export const INCIDENT_SEVERITIES = {
  Low: {
    label: 'Low',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.25)'
  },
  Medium: {
    label: 'Medium',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.25)'
  },
  High: {
    label: 'High',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.25)'
  },
  Critical: {
    label: 'Critical',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.35)'
  }
};

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

export const INCIDENT_CATEGORIES = [
  'Foreign Object',
  'Undercooked / Raw Food',
  'Hygiene & Cleanliness',
  'Expired / Stale',
  'Temperature Abuse',
  'Allergen Mislabeling',
  'Other'
];

export const INITIAL_MOCK_HALLS = [
  {
    _id: 'hall-1',
    name: 'North Quad Dining Hall',
    campus: 'North Campus',
    supervisorName: 'Chef Marcus Vance',
    isActive: true
  },
  {
    _id: 'hall-2',
    name: 'Centennial Commons',
    campus: 'Central Campus',
    supervisorName: 'Elena Rostova',
    isActive: true
  },
  {
    _id: 'hall-3',
    name: 'South Lakeside Bistro',
    campus: 'South Campus',
    supervisorName: 'David Kim',
    isActive: true
  },
  {
    _id: 'hall-4',
    name: 'Hilltop Food Court',
    campus: 'West Campus',
    supervisorName: 'Patricia Morales',
    isActive: false
  }
];

export const INITIAL_MOCK_INSPECTORS = [
  {
    _id: 'insp-1',
    fullName: 'Sarah Chen (Senior Inspector)',
    email: 'sarah.chen@university.edu',
    role: 'inspector',
    badgeNumber: 'QC-8821',
    assignedHalls: ['hall-1', 'hall-2']
  },
  {
    _id: 'insp-2',
    fullName: 'Jamal Washington (Field Auditor)',
    email: 'jamal.w@university.edu',
    role: 'inspector',
    badgeNumber: 'QC-9044',
    assignedHalls: ['hall-3']
  }
];

export const INITIAL_MOCK_INCIDENTS = [
  {
    _id: 'inc-101',
    studentId: { _id: 'stud-1', fullName: 'Alex Rivera', email: 'alex.r@student.edu' },
    hallId: { _id: 'hall-1', name: 'North Quad Dining Hall', campus: 'North Campus' },
    mealType: 'Lunch',
    category: 'Foreign Object',
    severity: 'High',
    description: 'Found a small piece of plastic packaging embedded inside the grilled chicken wrap.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    status: 'UNDER_REVIEW',
    assignedInspectorId: { _id: 'insp-1', fullName: 'Sarah Chen' },
    inspectorNote: 'Contacted kitchen supervisor Marcus; batch #402 quarantined for metal/plastic detection inspection.',
    resolvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: 'inc-102',
    studentId: { _id: 'stud-1', fullName: 'Alex Rivera', email: 'alex.r@student.edu' },
    hallId: { _id: 'hall-2', name: 'Centennial Commons', campus: 'Central Campus' },
    mealType: 'Dinner',
    category: 'Temperature Abuse',
    severity: 'Critical',
    description: 'Milk dispensers on line B were measuring at room temperature (around 68°F).',
    imageUrl: '',
    status: 'ACTION_TAKEN',
    assignedInspectorId: { _id: 'insp-1', fullName: 'Sarah Chen' },
    inspectorNote: 'Refrigeration compressor power cord was unplugged during floor cleaning. Thermostat re-verified at 38°F, milk cartons replaced.',
    resolvedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    _id: 'inc-103',
    studentId: { _id: 'stud-2', fullName: 'Maya Patel', email: 'maya.p@student.edu' },
    hallId: { _id: 'hall-3', name: 'South Lakeside Bistro', campus: 'South Campus' },
    mealType: 'Breakfast',
    category: 'Hygiene & Cleanliness',
    severity: 'Medium',
    description: 'Cutlery bins had sticky residue and silverware appeared unwashed.',
    imageUrl: '',
    status: 'SUBMITTED',
    assignedInspectorId: null,
    inspectorNote: '',
    resolvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];
