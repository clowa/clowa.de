# FROM swacli/static-web-apps-cli:1.1.7
FROM node:18-bullseye

ARG TARGETARCH

# Install Azure Static web app CLI
RUN npm install -g @azure/static-web-apps-cli

# Install Microsoft GPG keys
# RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
#     && mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg \
#     && sh -c 'echo "deb [arch=$TARGETARCH] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/dotnetdev.list'

# Install azure function core tools
# Not nativily supported for linux/arm64 see: https://github.com/Azure/azure-functions-core-tools/issues/3112
RUN curl -L https://github.com/mohsinonxrm/azure-functions-core-tools/releases/download/4.23_arm64/Azure.Functions.Cli.linux-ARM64.zip -o azure-functions-cli.zip \
    && unzip azure-functions-cli.zip -d /opt/ \
    && mv /opt/Azure.Functions.Cli.linux-ARM64 /opt/azure-functions-cli \
    && ln -s /opt/azure-functions-cli/func /usr/local/bin/func \
    && chmod +x /opt/azure-functions-cli/func \
    && rm -f azure-functions-cli.zip

# Install Astro CLI
# RUN npm install -g astro

# Install typescript globally
# RUN npm install -g typescript
