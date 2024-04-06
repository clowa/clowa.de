FROM mcr.microsoft.com/dotnet/sdk:8.0 as azure-functions-core-tools

RUN git clone https://github.com/amih90/azure-functions-core-tools.git /tmp/azure-functions-core-tools \
    && cd /tmp/azure-functions-core-tools \
    && git checkout amih90/linux-arm64 \
    && dotnet publish src/Azure.Functions.Cli/Azure.Functions.Cli.csproj --runtime linux-arm64 --output /opt/azure-functions-core-tools


FROM node:18-bullseye as final

# FROM swacli/static-web-apps-cli:1.1.7
FROM node:18-bookworm

ARG TARGETARCH

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get dist-upgrade -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Azure Static web app CLI
RUN npm install -g @azure/static-web-apps-cli

# Install azure function core tools
# Not nativily supported for linux/arm64 see: https://github.com/Azure/azure-functions-core-tools/issues/3112
COPY --from=azure-functions-core-tools /opt/azure-functions-core-tools /opt/azure-functions-core-tools
RUN ln -s /opt/azure-functions-core-tools/func /usr/local/bin/func \
&& chmod +x /opt/azure-functions-core-tools/func \
&& rm -f azure-functions-cli.zip
