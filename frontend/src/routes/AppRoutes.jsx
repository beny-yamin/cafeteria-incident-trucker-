import React from 'react';
import StudentDashboard from '../pages/StudentDashboard';
import InspectorDashboard from '../pages/InspectorDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { USER_ROLES } from '../utils/constants';

export const AppRoutes = ({
  currentRole,
  halls = [],
  inspectors = [],
  incidents = [],
  currentUser = null,
  isLoading = false,
  error = null,
  onSubmitIncident,
  onClaimReport,
  onResolveReport,
  onDismissReport,
  onAddHall,
  onToggleHallStatus,
  onAssignHallsToInspector
}) => {
  switch (currentRole) {
    case USER_ROLES.INSPECTOR:
      return (
        <InspectorDashboard
          incidents={incidents}
          halls={halls}
          inspector={currentUser}
          onClaimReport={onClaimReport}
          onResolveReport={onResolveReport}
          onDismissReport={onDismissReport}
          isLoading={isLoading}
          error={error}
        />
      );

    case USER_ROLES.ADMIN:
      return (
        <AdminDashboard
          halls={halls}
          inspectors={inspectors}
          incidents={incidents}
          onAddHall={onAddHall}
          onToggleHallStatus={onToggleHallStatus}
          onAssignHallsToInspector={onAssignHallsToInspector}
          isLoading={isLoading}
          error={error}
        />
      );

    case USER_ROLES.STUDENT:
    default:
      return (
        <StudentDashboard
          halls={halls}
          incidents={incidents}
          onSubmitIncident={onSubmitIncident}
          isLoading={isLoading}
          error={error}
        />
      );
  }
};

export default AppRoutes;
