#!/bin/bash
echo "Running plugin build script"
npm install && \
echo "✓ dist dependencies installed successfully" && \
cd vite-app/app && \
npm install && \
echo "✓ build dependencies installed successfully" && \
npm run build && \
echo "✓ built successfully" && \
echo "SKIPPING TESTS" && \
cd ../.. && \
npm run update-dist && \
echo "✓ plugin setup successfully" && \
echo "✓ plugin dist created successfully"