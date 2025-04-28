val ktorVersion = "2.3.11"
val kordVersion = "0.10.0"

plugins {
    kotlin("jvm") version "1.9.0"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("dev.kord:kord-core:$kordVersion")
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("ch.qos.logback:logback-classic:1.4.14")
}

application {
    mainClass.set("MainKt")  
}

kotlin {
    jvmToolchain(16)
}
