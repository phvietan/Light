# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|

  # vagrant box
  config.vm.box = "ubuntu/trusty64"

  # Network configuration
  # config.vm.network "forwarded_port", guest: 80, host: 8080
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"
  config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network"

  # Files configuration
  config.vm.synced_folder ".", "/light/"

  # VB configuration
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Provision configuration
  config.vm.provision "shell", inline: <<-SHELL
    # Install MongoDB
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org

    # Install nvm
    apt-get update
    apt-get install -y build-essential libssl-dev
    curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh 2>/dev/null > ./temp.sh

    echo '
    cd /light
    npm run start:backend' > run.sh

    echo "If this is your first time setup the Vagrant, after doing vagrant ssh please read the README.md on Github to setup environment"
  SHELL
end
