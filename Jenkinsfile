@Library("Shared") _
pipeline {
    agent {
        label 'ritesh'
    }
    
    stages {
        stage('Code'){
            steps {
                script { 
                    echo "This is cloning the code"
                    sh "whoami"
                    GitClone("https://github.com/jayvaghela1209/Notespace", "main")
                }
            }
        }
        stage('Build'){
            steps {
                script {
                    echo "This is building the code"
                    BuildCode("notespace", "v1", "jayvaghela0304")
                }
            }
        }
        stage('push to DockerHub'){
            steps{
                script {
                    echo "pushing docker hub"
                    DockerPush("notespace", "v1", "jayvaghela0304")
                }
            }
        }
        
        stage('Test'){
            steps {
                echo "This is Testing the code"
            }
        }
        stage('Deploy'){
            steps {
                script {
                    echo "Deploying the container...."
                    Deploy()
                }
            }
        }
    }
    
}
