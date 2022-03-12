import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { Deployment, KubernetesProvider, Namespace, Service } from "@cdktf/provider-kubernetes";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new KubernetesProvider(this, "kubernetesProvider", {
      configPath: "~/.kube/config",
    });

    const kubernetesNamespace = new Namespace(this, "kubernetesNamespace", {
      metadata: {
        name: "nginx"
      },
    });

    const kubernetesDeployment = new Deployment(this, "kubernetesDeployment", {
      metadata: {
        name: "nginx",
        namespace: kubernetesNamespace.metadata.name,
      },
      spec: {
        replicas: "2",
        selector: {
          matchLabels: {
            app: "MyTestApp"
          },
        },
        template: {
          metadata: {
            labels: {
              app: "MyTestApp"
            },
          },
          spec: {
            container: [{
              image: "nginx",
              name: "nginx-container",
              port: [{
                containerPort: 80,
              }],
            }],
          },
        },
      },
    });

    // TO DO: Port forwarding not working
    new Service(this, "kubernetesService", {
      metadata: {
        name: "nginx",
        namespace: kubernetesNamespace.metadata.name,
      },
      spec: {
        selector: {
          app: kubernetesDeployment.spec.template.metadata.labels.app
        },
        type: "NodePort",
        port: [{
          nodePort: 30201,
          port: 80,
          targetPort: "80",
        }],
      },
    });
  }
}

const app = new App();
new MyStack(app, "04-k8s-cdktf-cli");
app.synth();
