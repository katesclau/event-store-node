require('dotenv').config({ path: '.env.test' });

module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/test/**/*.spec.ts', '<rootDir>/test/**/*.test.ts'],
  modulePaths: ['<rootDir>/src', '<rootDir>/@types/'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleDirectories: ['node_modules', 'main/node_modules'],
  // Coverage Configuration
  globals: {
    'ts-jest': {
      disableSourceMapSupport: true,
    },
  },
  coverageDirectory: '<rootDir>/test/coverage',
  coverageReporters: ['json', 'lcov', 'text'],
};
