import { createDefaultPreset } from 'ts-jest';

/** @type {import('jest').Config} */
const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
};


