#!/usr/bin/env bash
set -e

# Install Node dependencies
npm install

# Install Prisma and Prisma client
npm install prisma @prisma/client --no-save

# Generate Prisma client
npx prisma generate

# Push Prisma schema to database
npx prisma db push
