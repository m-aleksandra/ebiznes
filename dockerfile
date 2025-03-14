FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \  
    python3.10 \
    unzip \
    zip \
    curl \
    openjdk-8-jdk 


RUN curl -s "https://get.sdkman.io" | bash && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install gradle && sdk install kotlin"

WORKDIR /app

COPY . .

RUN bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && gradle build"
