#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packagePath = path.join(root, 'package.json');
const solutionPath = path.join(root, 'config', 'package-solution.json');

const readJson = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, {
    encoding: 'utf8'
  });
};

const bumpVersion = (current) => {
  const segments = current.split('.').map((segment) => parseInt(segment, 10));
  while (segments.length < 3) {
    segments.push(0);
  }
  segments[2] += 1;
  return segments.join('.');
};

const asSolutionVersion = (version) => {
  const [major, minor, patch] = version.split('.');
  return `${major}.${minor}.${patch}.0`;
};

const pkg = readJson(packagePath);
const newVersion = bumpVersion(pkg.version || '0.0.0');
pkg.version = newVersion;
writeJson(packagePath, pkg);

const solution = readJson(solutionPath);
const solutionVersion = asSolutionVersion(newVersion);
solution.solution = solution.solution || {};
solution.solution.version = solutionVersion;

if (Array.isArray(solution.solution.features)) {
  solution.solution.features = solution.solution.features.map((feature) => ({
    ...feature,
    version: solutionVersion
  }));
}

writeJson(solutionPath, solution);

console.log(`[bump-version] Version bumped to ${newVersion}`);
