import nextJest from 'next/jest.js'
import { Config } from 'jest'

const createJestConfig = nextJest({
  dir: './',
})


const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest'
}

export default createJestConfig(config)