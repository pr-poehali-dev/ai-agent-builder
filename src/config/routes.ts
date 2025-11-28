export const ROUTES = {
  HOME: '/',
  SCENARIO_SELECTION: '/scenario',
  DATA_UPLOAD: '/upload',
  VALIDATION: '/validation',
  PUBLISH: '/publish',
  DASHBOARD: '/dashboard',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
