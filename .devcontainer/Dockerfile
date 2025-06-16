# [Choice] Node.js version: 20, 18, 16
ARG VARIANT="20-bullseye"
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

# [Optional] Install Azure Functions Core Tools
RUN npm install -g azure-functions-core-tools@4 --unsafe-perm true

# [Optional] Install additional utilities
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/* 
