import { execSync } from 'node:child_process';
execSync('pagefind --site dist', { stdio: 'inherit' });
