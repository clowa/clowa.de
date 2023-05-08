---
title: "Setup my microk8s kubernetes cluster"
date: 2021-09-20T17:36:46+02:00
draft: false
---

# Setting up microk8s node

1. Setup ubuntu server for raspberry pi with ssh enabled.
2. Login via `ubuntu` with password `ubuntu`
3. Change password of user `ubuntu`
4. Rename user `ubuntu`

   1. Create temporary user `tmpUser`

      ```bash
      # Create user without homeDir and without creating a user group.
      # Add user to admin group to grant sudo privileges.
      useradd -M -N -G admin tmpUser
      # Set password for user.
      passwd tmpUser
      ```

   2. Login as `tmpUser` to rename user `ubuntu`.

      ```bash
      # Rename user and homeDir of user ubuntu
      usermod --login <NEW_USERNAME> --move-home --home /home/<NEW_USERNAME> ubuntu
      # Rename user group of user ubuntu
      groupmod --new-name <NEW_USERNAME> ubuntu
      ```

   3. Now you can login again with the new name of `ubuntu`.
   4. Delete the `tmpUser`

      ```bash
      # Remove tmpUser and it's not created home dir.
      deluser tmpUser --remove-home
      ```

5. Edit the network configuration of `netplan` as needed. Config file is located in `/etc/netplan/50-cloud-init.yaml`

   ```yaml
   # This file is generated from information provided by the datasource.  Changes
   # to it will not persist across an instance reboot.  To disable cloud-init's
   # network configuration capabilities, write a file
   # /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
   # network: {config: disabled}
   network:
     ethernets:
       eth0:
         dhcp4: true
         optional: true
         dhcp4-overrides:
           use-dns: no
         nameservers:
           addresses:
             - 1.1.1.1
             - 1.0.0.1
             - 2606:4700:4700::1111
             - 2606:4700:4700::1001
     version: 2
   ```

6. Change hostname of node by editing file `/etc/hostname`.
7. Set a static IP for the node via you DHCP server.
8. Reboot the node by running the following command `shutdown -r 1`
9. Update the os and installed packages and reboot the node again if needed.

   ```bash
   # Update everything and remove unnecessary stuff
   apt update && apt full-upgrade -y && apt dist-upgrade -y && apt autoremove -y
   ```

10. Edit file `/etc/hosts` and add all nodes of the cluster with its hostname an IPv4 address.

    ```txt
    127.0.0.1 localhost

    # The following lines are desirable for IPv6 capable hosts
    ::1 ip6-localhost ip6-loopback
    fe00::0 ip6-localnet
    ff00::0 ip6-mcastprefix
    ff02::1 ip6-allnodes
    ff02::2 ip6-allrouters
    ff02::3 ip6-allhosts

    # k8s cluster node discovery
    192.168.178.203 microk8s-00
    192.168.178.204 microk8s-01
    192.168.178.205 microk8s-02
    ```

11. Configure SSH key authentication.

    1. Copy SSH key of your client to the remote server.

       ```bash
       ssh-copy-id <USERNAME>@<SERVER_IP>
       ```

    2. Disable SSH password login by editing the following line in `/etc/ssh/sshd_config`

       ```txt
       PasswordAuthentication no
       ```

    3. Reboot the server.

12. Setup micok8s cluster. Do the following for each additional host of your cluster.

    1. Install snap package `micok8s` on each node by running

    ```bash
    snap install microk8s --channel=<RELEASE_VERSION>/stable --classic
    ```

    2. Enable `microk8s` by running

       ```bash
       microk8s.start
       ```

13. Repeat this for each node of your cluster

    1. Run the following commands on the future master node of the cluster to generate a join command.

    ```bash
    microk8s.add-node
    # Example output:
    # From the node you wish to join to this cluster, run the following:
    # microk8s join 192.168.178.203:25000/<TOKEN>

    # If the node you are adding is not reachable through the default interface you can use one of the following:
    # microk8s join 192.168.178.203:25000/<TOKEN>
    ```

    1. Copy the displayed joining command
    2. Switch to the new node and paste and run the command copied above.

14. Get the config to connect to the cluster via `kubectl` by simply running `micok8s.config`. Copy the output and paste it to one of your cluster config files e.g. `~/.kube/config`.

## Mounting NFS volumes

To mount a `NFS` based `StorageClass` you must install `nfs-common`. On ubuntu simply run

```bash
sudo apt install nfs-common
```

## Known problems

- On Raspberry Pi 3B you may need to install a previous Version (`1.18/stable`) and then refresh the snap to the desired version.

## Install Docker

If you like to build docker images within the cluster you may need dockerd running. Run the following to install docker on `arm64`.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
sudo apt-get update && \
sudo apt-get install docker-ce docker-ce-cli containerd.io && \
sudo usermod -aG docker $(whoami)
```

You may need to enable `docker` and `containerd` to start on boot:

```bash
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

if you like to disable start on boot run:

```bash
sudo systemctl disable docker.service
sudo systemctl disable containerd.service
```

## Uninstall Docker

```bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io && \
sudo rm -rf /var/lib/docker && \
sudo rm -rf /var/lib/containerd
```
