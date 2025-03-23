FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \  
    python3.10 \
    unzip \
    zip \
    curl \
    openjdk-8-jdk 


RUN curl -s "https://get.sdkman.io" | bash && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install gradle && sdk install kotlin"

ENV PATH="/root/.sdkman/candidates/gradle/current/bin:/root/.sdkman/candidates/kotlin/current/bin:$PATH"

WORKDIR /app

COPY . .

RUN gradle build

CMD gradle run
