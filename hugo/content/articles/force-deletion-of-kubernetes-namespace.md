---
title: "Force deletion of kubernetes namespace"
date: 2022-02-13T16:13:46+02:00
draft: false
---

# Overview

Sometimes the deletion of a kubernetes namespace is stucked at the `terminating` state. You can force the deletion of the namespace by running the following command.

**CAUTION:** This may lead to infinitely running resources in you cluster. Nothing makes sure to delete running resources in this namespace.

```bash
$ NAMESPACE="test"
$ kubectl get namespace $NAMESPACE -o json | jq -j '.spec.finalizers=null' > tmp.json
$ kubectl replace --raw "/api/v1/namespaces/$NAMESPACE/finalize" -f ./tmp.json
```

Run the following if you have multiple namespaces stucked at `terminating`state

```bash
for NS in $(kubectl get ns 2>/dev/null | grep Terminating | cut -f1 -d ' '); do
  kubectl get ns $NS -o json > /tmp/$NS.json
  sed -i '' "s/\"kubernetes\"//g" /tmp/$NS.json
  kubectl replace --raw "/api/v1/namespaces/$NS/finalize" -f /tmp/$NS.json
done
```

## Source:

- [Deleting namespace stuck at "Terminating" state #60807](https://github.com/kubernetes/kubernetes/issues/60807)
