#!/bin/bash

# LBRY Desktop Development Startup Script
# This script fixes the OpenSSL compatibility issue with Node.js v17+

echo "🚀 Starting LBRY Desktop Development Server..."

# Set the legacy OpenSSL provider for Node.js compatibility
export NODE_OPTIONS="--openssl-legacy-provider"

# Start the development server
yarn dev 