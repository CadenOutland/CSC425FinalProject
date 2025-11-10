import '@testing-library/jest-dom';

// Mock Recharts for tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: ({ children }) => <div>{children}</div>,
  XAxis: ({ children }) => <div>{children}</div>,
  YAxis: ({ children }) => <div>{children}</div>,
  CartesianGrid: ({ children }) => <div>{children}</div>,
  Tooltip: ({ children }) => <div>{children}</div>,
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);
