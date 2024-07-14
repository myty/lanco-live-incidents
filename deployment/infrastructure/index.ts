import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker-build";

import * as app from "@pulumi/azure-native/app";
import * as containerregistry from "@pulumi/azure-native/containerregistry";
import * as operationalinsights from "@pulumi/azure-native/operationalinsights";
import * as resources from "@pulumi/azure-native/resources";

const resourceGroup = new resources.ResourceGroup("rg");

const workspace = new operationalinsights.Workspace("loganalytics", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: "PerGB2018",
  },
  retentionInDays: 30,
});

const workspaceSharedKeys = operationalinsights.getSharedKeysOutput({
  resourceGroupName: resourceGroup.name,
  workspaceName: workspace.name,
});

const managedEnv = new app.ManagedEnvironment("env", {
  resourceGroupName: resourceGroup.name,
  appLogsConfiguration: {
    destination: "log-analytics",
    logAnalyticsConfiguration: {
      customerId: workspace.customerId,
      sharedKey: workspaceSharedKeys.apply((
        r: operationalinsights.GetSharedKeysResult,
      ) => r.primarySharedKey!),
    },
  },
});

const registry = new containerregistry.Registry("registry", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: "Basic",
  },
  adminUserEnabled: true,
});

const credentials = containerregistry.listRegistryCredentialsOutput({
  resourceGroupName: resourceGroup.name,
  registryName: registry.name,
});
const adminUsername = credentials.apply((
  c: containerregistry.ListRegistryCredentialsResult,
) => c.username!);
const adminPassword = credentials.apply((
  c: containerregistry.ListRegistryCredentialsResult,
) => c.passwords![0].value!);

const customImage = "og-incident-images";

const imageTag = pulumi
  .interpolate`${registry.loginServer}/${customImage}:latest`;

export const myImage = new docker.Image(customImage, {
  tags: [imageTag],
  context: {
    location: `../../apps/${customImage}/`,
  },
  platforms: [
    "linux/amd64",
  ],
  push: true,
  registries: [{
    address: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  }],
});

const containerApp = new app.ContainerApp("app", {
  resourceGroupName: resourceGroup.name,
  managedEnvironmentId: managedEnv.id,
  configuration: {
    ingress: {
      external: true,
      targetPort: 80,
    },
    registries: [{
      server: registry.loginServer,
      username: adminUsername,
      passwordSecretRef: "pwd",
    }],
    secrets: [{
      name: "pwd",
      value: adminPassword,
    }],
  },
  template: {
    scale: {
      minReplicas: 0,
      maxReplicas: 1,
    },
    containers: [{
      name: "app",
      image: imageTag,
      resources: {
        cpu: 0.25,
        memory: "0.5Gi",
      },
      env: [{
        name: "INCIDENTS_API",
        value: "https://lanco-live-incidents.azurewebsites.net/api/incidents",
      }],
    }],
  },
});

export const url = pulumi.interpolate`https://${
  containerApp.configuration.apply((c: any) => c?.ingress?.fqdn)
}`;
