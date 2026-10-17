import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import ChangePasswordModal from './components/ChangePasswordModal';
import AppRoutes from './routes/AppRoutes';
import {
  authService,
  diningHallService,
  incidentReportService,
  userService,
  API_URL
} from './services';
import { USER_ROLES } from './utils/constants';
import { useAuthContext } from './context/AuthContext';

// Initial seed facilities if database is completely empty on first launch
const SEED_HALLS = [
  { name: 'North Quad Dining Hall', campus: 'North Campus', supervisorName: 'Chef Marcus Vance', isActive: true },
  { name: 'Centennial Commons', campus: 'Central Campus', supervisorName: 'Elena Rostova', isActive: true },
  { name: 'South Lakeside Bistro', campus: 'South Campus', supervisorName: 'David Kim', isActive: true }
];

function App() {
  const { currentUser: firebaseUser, mongoUser, loading: authLoading } = useAuthContext();
  const [currentRole, setCurrentRole] = useState(USER_ROLES.STUDENT);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [halls, setHalls] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // When authenticated user's database profile syncs, lock active view to their role
  useEffect(() => {
    if (mongoUser && mongoUser.role) {
      setCurrentRole(mongoUser.role);
      setCurrentUser(mongoUser);
    } else if (!firebaseUser) {
      setCurrentUser(null);
      setCurrentRole(USER_ROLES.STUDENT);
    }
  }, [mongoUser, firebaseUser]);

  const loadData = useCallback(async () => {
    if (authLoading || !firebaseUser) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // 1. Sync User Profile with Backend
      const user = await authService.syncUser();
      setCurrentUser(user);

      const activeRole = user?.role || mongoUser?.role || currentRole;

      // 2. Fetch Dining Halls
      let fetchedHalls = await diningHallService.getAll();

      // Auto-seed sample halls if database is completely fresh (Admin only)
      if ((!fetchedHalls || fetchedHalls.length === 0) && activeRole === USER_ROLES.ADMIN) {
        for (const seed of SEED_HALLS) {
          try {
            await diningHallService.create(seed);
          } catch (e) {
            // ignore duplicates
          }
        }
        fetchedHalls = await diningHallService.getAll();
      }
      setHalls(fetchedHalls || []);

      // 3. Fetch Incidents (Role-scoped by backend, requires auth)
      const incidentsResponse = await incidentReportService.getAll();
      setIncidents(incidentsResponse?.reports || []);

      // 4. Fetch Inspectors (for Admin view)
      if (activeRole === USER_ROLES.ADMIN) {
        const inspResponse = await userService.getInspectors();
        setInspectors(inspResponse?.inspectors || []);
      }
    } catch (err) {
      console.error('Error loading data from backend:', err);
      setApiError(err.message || `Could not connect to backend API server at ${API_URL}`);
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser, authLoading, currentRole, mongoUser?.role]);

  useEffect(() => {
    if (firebaseUser) {
      loadData();
    }
  }, [firebaseUser, loadData]);

  // Actions connecting to backend

  // 1. Student submits incident report
  const handleSubmitIncident = async (reportData) => {
    try {
      const created = await incidentReportService.create(reportData);
      setIncidents((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      throw new Error(err.message || 'Failed to submit incident report');
    }
  };

  // 2. Inspector claims report
  const handleClaimReport = async (reportId) => {
    try {
      const updated = await incidentReportService.claim(reportId);
      setIncidents((prev) => prev.map((inc) => (inc._id === reportId ? updated : inc)));
    } catch (err) {
      throw new Error(err.message || 'Failed to claim report');
    }
  };

  // 3. Inspector resolves report
  const handleResolveReport = async (reportId, inspectorNote) => {
    try {
      const updated = await incidentReportService.resolve(reportId, { inspectorNote });
      setIncidents((prev) => prev.map((inc) => (inc._id === reportId ? updated : inc)));
    } catch (err) {
      throw new Error(err.message || 'Failed to resolve report');
    }
  };

  // 4. Inspector dismisses report
  const handleDismissReport = async (reportId, inspectorNote) => {
    try {
      const updated = await incidentReportService.dismiss(reportId, { inspectorNote });
      setIncidents((prev) => prev.map((inc) => (inc._id === reportId ? updated : inc)));
    } catch (err) {
      throw new Error(err.message || 'Failed to dismiss report');
    }
  };

  // 5. Admin adds dining hall
  const handleAddHall = async (hallData) => {
    try {
      const created = await diningHallService.create(hallData);
      setHalls((prev) => [...prev, created]);
    } catch (err) {
      throw new Error(err.message || 'Failed to add dining hall');
    }
  };

  // 6. Admin toggles dining hall active status
  const handleToggleHallStatus = async (hallId, currentIsActive) => {
    try {
      const updated = await diningHallService.update(hallId, { isActive: !currentIsActive });
      setHalls((prev) => prev.map((h) => (h._id === hallId ? updated : h)));
    } catch (err) {
      alert(err.message || 'Failed to update dining hall status');
    }
  };

  // 7. Admin assigns dining halls to inspector
  const handleAssignHallsToInspector = async (inspectorId, hallIds) => {
    try {
      const updated = await userService.assignHalls(inspectorId, hallIds);
      setInspectors((prev) => prev.map((insp) => (insp._id === inspectorId ? updated : insp)));
      loadData();
    } catch (err) {
      throw new Error(err.message || 'Failed to assign dining halls');
    }
  };

  // Screen 1: Loading state while verifying Firebase session
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.25rem',
          backgroundColor: '#07090e',
          color: 'var(--text-main)'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite'
          }}
        />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
            Authenticating Session...
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Connecting to Firebase project jaaamin-rox
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Dedicated Authentication Page if not logged in
  if (!firebaseUser) {
    return <AuthPage />;
  }

  // Screen 3: Authenticated User Application View (Role-based Dashboard)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentRole={currentRole}
        onNewReportClick={() => {
          if (currentRole === USER_ROLES.STUDENT) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenChangePassword={() => setChangePasswordOpen(true)}
      />

      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      <main style={{ flex: 1, padding: '2.5rem 2rem', width: '100%' }}>
        <AppRoutes
          currentRole={currentRole}
          halls={halls}
          inspectors={inspectors}
          incidents={incidents}
          currentUser={currentUser}
          isLoading={isLoading}
          error={apiError}
          onSubmitIncident={handleSubmitIncident}
          onClaimReport={handleClaimReport}
          onResolveReport={handleResolveReport}
          onDismissReport={handleDismissReport}
          onAddHall={handleAddHall}
          onToggleHallStatus={handleToggleHallStatus}
          onAssignHallsToInspector={handleAssignHallsToInspector}
        />
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.75rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(7, 9, 14, 0.7)'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <strong>University Food Quality Assurance & Incident Reporting System</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>Backend: Express + MongoDB</span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>Firebase Auth: jaaamin-rox</span>
            <span>•</span>
            <span>Role: <strong style={{ textTransform: 'capitalize', color: '#f8fafc' }}>{currentRole}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
