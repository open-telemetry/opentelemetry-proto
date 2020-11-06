plugins {
    `java-library`
}

repositories {
    mavenCentral()
}

sourceSets {
    main {
        java {
            srcDir("gen/java")
        }
    }
}

dependencies {
    api("com.google.protobuf:protobuf-java:3.13.0")
}

java {
    withJavadocJar()
    withSourcesJar()
}

tasks {
    named("compileJava") {
        doFirst {
            if (!file("gen/java").exists()) {
                throw GradleException("Java generated sources not found, run 'make gen-java' first.")
            }
        }
    }
}
