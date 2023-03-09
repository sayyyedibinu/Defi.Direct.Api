FROM node:8.15.1

# Install sudo
RUN apt-get update \
      && apt-get install -y sudo \
      && rm -rf /var/lib/apt/lists/*

RUN echo "go ALL=NOPASSWD: ALL" >> /etc/sudoers

# Install the prerequisites to use awscli and kubectl
RUN apt-get update && apt-get install -y \
  && apt-get install -y sudo \
  apt-transport-https \
  apparmor \
  ca-certificates \
  curl \
  gnupg2 \
  software-properties-common \
  libyaml-dev \
  libpython2.7-dev \
  python-pip \
  jq \
  git \
  xsltproc \
 && rm -rf /var/lib/apt/lists/*  

# Install awscli
RUN pip install awscli

# Install kubectl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
 && chmod +x ./kubectl \
 && mv ./kubectl /usr/local/bin/kubectl

# Add kubectl to our path
ENV PATH="~/.local/bin:${PATH}"

# Install the latest version of Docker
RUN curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add - \
 && sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable" \
 && sudo apt-get update \
 && sudo apt-get install -y docker-ce