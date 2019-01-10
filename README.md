# Light

A Web Application that gives the students more connection with the Staff in school.

The Web consists of several features:
  1) Create a new school environment.
  2) Controlling Staff resources.
  3) Adding new Students/Teachers to the School.
  4) Adding new Course for Teachers and Students to sign up.
  5) Publish new school event that enables the Students to join up and get some rewards.
  6) Enables the need for Students to report uncasual events.

## Prerequisite
  1) Use Linux environment
  
  2) Install Nodejs, npm. Check if your system has it yet by running the command:
    
    $ node --version
    $ npm --version
  
  
  If your system does not have it yet, I prefer using this link: https://github.com/creationix/nvm. After install nvm, you should install node version 11.0.0. If you still have trouble, please contact An Pham.
  
  3) Install VirtualBox, and Vagrant.
  
## Backend Server:
  The Backend Server is hosted inside virtual environment because it involved in configuring mongoDB.
  
  For the first time setting up, just type in below commands:
  
    $ vagrant up          # This command initialize the virtual environment
    $ vagrant ssh         # This command is to go into the virtual environment
    $ bash temp.sh        # Install nvm in the virtual environment
    $ exec bash           # Reload bash shell
    $ nvm install 11.0.0
    $ nvm use 11.0.0
    
  Later when developing, you don't need to run above code again.
  
  To startup the Backend Server:
  
    $ vagrant ssh
    $ bash run
    
  For easily manipulating MongoDB, I recommend using Robo3T in: https://robomongo.org
  
## Frontend Server:
  Frontend Server is hosted on your local machine.
  
  To run Frontend Server, cd inside your repository then:
  
    $ npm start
  
    
