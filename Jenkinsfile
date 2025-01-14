pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"
        IMAGE_NAME_BACKEND= "grandspace-fullstack"
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'  // Update this to your Docker Hub credentials ID in Jenkins
        BUILD_TAG = "${env.BUILD_NUMBER}"
        SPRING_DATASOURCE_URL = "jdbc:mysql://172.22.0.2:3306/grandspace?createDatabaseIfNotExist=true" // Updated hostname to 'db' as per Docker network
        SPRING_DATASOURCE_USERNAME = "root"
        SPRING_DATASOURCE_PASSWORD = "root"
        DOCKER_NETWORK = "grandspace_network"
        DB_CONTAINER = "grandspace-db"
        PHPMYADMIN_CONTAINER = "grandspace-phpmyadmin"
        BACKEND_CONTAINER = "grandspace-container"
    }

    tools {
        maven 'maven'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    echo "Cloning repository..."
                    checkout scm
                }
            }
        }

        stage('Create Docker Network') {
            steps {
                script {
                    echo "Creating Docker network if not exists..."
                    sh """
                    docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1 || docker network create ${DOCKER_NETWORK}
                    """
                }
            }
        }

        stage('Start MySQL') {
    steps {
        script {
            echo "Starting MySQL container..."
            sh """
            # Check if the container is running or exists
            if docker ps --filter "name=${DB_CONTAINER}" | grep -q ${DB_CONTAINER}; then
                echo "Container ${DB_CONTAINER} is already running."
            elif docker ps -a --filter "name=${DB_CONTAINER}" | grep -q ${DB_CONTAINER}; then
                echo "Container ${DB_CONTAINER} exists but is stopped. Restarting it..."
                docker start ${DB_CONTAINER}
            else
                echo "Container ${DB_CONTAINER} does not exist. Creating and starting a new container..."
                docker run -d --name ${DB_CONTAINER} \
                    --network ${DOCKER_NETWORK} \
                    -e MYSQL_ROOT_PASSWORD=${SPRING_DATASOURCE_PASSWORD} \
                    -e MYSQL_DATABASE=grandspace \
                    -p 3308:3306 mysql:5.7
            fi
            """
        }
    }
}

        stage('Start phpMyAdmin') {
            steps {
                script {
                    echo "Starting phpMyAdmin container..."
                    sh """
                    docker ps -q --filter "name=${PHPMYADMIN_CONTAINER}" | grep -q . || \
                    docker run -d --name ${PHPMYADMIN_CONTAINER} \
                        --network ${DOCKER_NETWORK} \
                        -e PMA_HOST=${DB_CONTAINER} \
                        -e MYSQL_ROOT_PASSWORD=${SPRING_DATASOURCE_PASSWORD} \
                        -p 8182:80 phpmyadmin/phpmyadmin
                    """
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    echo "Logging in to Docker Hub..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        echo 'Docker login successful'
                    }
                }
            }
        }

        stage('Build GrandSpaceProject') {
            steps {
                dir('GrandSpaceProject') {
                    script {
                        echo "Building GrandSpaceProject..."
                        sh 'mvn clean install'
                        echo "Building Docker image for GrandSpaceProject..."
                        sh """
                        docker build -t ${REGISTRY}/${IMAGE_NAME_BACKEND}:${BUILD_TAG} .
                        """
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    echo "Pushing images to Docker Hub..."
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        // Tagging and pushing backend image
                        sh """
                        docker tag ${REGISTRY}/${IMAGE_NAME_BACKEND}:${BUILD_TAG} ${REGISTRY}/cyfrifprotech/${IMAGE_NAME_BACKEND}:${BUILD_TAG}
                        docker push ${REGISTRY}/cyfrifprotech/${IMAGE_NAME_BACKEND}:${BUILD_TAG}
                        """
                    }
                }
            }
        }

        stage('Deploy Grandspace') {
    steps {
        script {
            echo "Updating GrandSpaceProject container..."
            sh """
            # Check if the backend container exists and remove it if necessary
            docker ps -a -q --filter "name=${BACKEND_CONTAINER}" | grep -q . && \
            docker rm -f ${BACKEND_CONTAINER} || echo "No existing backend container to remove."

            # Run a new backend container
            docker run -d --name ${BACKEND_CONTAINER} \
                --network ${DOCKER_NETWORK} \
                -e SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL} \
                -e SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME} \
                -e SPRING_DATASOURCE_PASSWORD=${SPRING_DATASOURCE_PASSWORD} \
                -p 9080:9090 ${REGISTRY}/cyfrifprotech/${IMAGE_NAME_BACKEND}:${BUILD_TAG}
            """
        }
    }
}

        stage('Cleanup Unused Resources') {
            steps {
                script {
                    echo "Cleaning up unused Docker resources..."
                    sh """
                    docker image prune -f
                    docker container prune -f
                    """
                }
            }
        }
    }
}