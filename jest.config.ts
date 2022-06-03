module.exports = {
  testTimeout: 30000,
  testRegex: '.*.test.ts$',
  testPathIgnorePatterns: ['<rootDir>/__tests__/__mocks__/', '<rootDir>/node_modules/', '<rootDir>/prod_node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverage: false,
  coverageReporters: ['json', 'html'],
  // needs to be changed as per prod
  modulePathIgnorePatterns: ['<rootDir>/prod_node_modules'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/cleanup.ts'],
};
