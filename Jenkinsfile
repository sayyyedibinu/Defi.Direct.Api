pipeline {
  agent { 
    dockerfile {            // We are using a Docker container as our build agent
      dir 'cd-pipeline'
      args "-v /var/run/docker.sock:/var/run/docker.sock"
      customWorkspace "workspace/$BUILD_TAG"
    }
  }
  options {
        buildDiscarder(logRotator(daysToKeepStr: '400', artifactDaysToKeepStr: '30')) // Cleanup builds older than 60 days
        timeout(time: 30, unit: 'MINUTES') // Kill the build after 30 minutes (takes too long, tweak as necessary)
        disableConcurrentBuilds() // Don't allow concurrent executions so we don't enter race conditions of old commits being deployed over newer ones
  }
  environment {
    AWS_REGION = "us-east-1"
	MYGET_NUGET_CONFIG = credentials('MYGET_NUGET_CONFIG')
	DATADOG_API_KEY = credentials('DATA_DOG_API_KEY')
	DATADOGOPTIONS_SERVERNAME = "datadog-agent-statsd.default.svc.cluster.local"
    /* CD Secrets */
    CD_HEALTH_CHECK_KEY = credentials('CD_ESIGNATURE_LOGIN_USERNAME')
	  CD_API_KEY = credentials('QA_DIRECT_API_KEY')
    CD_AES_KEY = credentials('QA_DIRECT_AES_KEY')
    CD_AES_IV = credentials('QA_DIRECT_AES_IV')
    CD_S3_BUCKET = credentials('QA_DIRECT_S3_BUCKET')
    CD_S3_KEY = credentials('QA_DIRECT_S3_KEY')
    CD_DIRECT_BUILD = 'false'
	  CD_DIRECT_USER = credentials('QA_DIRECT_USER')
    CD_DIRECT_TOKEN = credentials('QA_DIRECT_TOKEN')
  	CD_DIRECT_BUILD_URL = credentials('QA_DIRECT_BUILD_URL')
    CD_MYSQL_DIRECT_CONNECTION_STRING = 'Server=defi-apps-nonprod-cd-db-direct-eks-01.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct;Uid=DirectCd;Pwd=Direct2114!0;'
    CD_MYSQL_DIRECTAUTH_CONNECTION_STRING = 'Server=defi-apps-nonprod-cd-db-direct-eks-01.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct_auth;Uid=DirectCd;Pwd=Direct2114!0;'
	CD_DATADOGOPTIONS_ENABLED = "true"
	CD_DATADOGOPTIONS_TAGS = "service:defi-direct-cd"
    
    /* STAGING Secrets */
    STAGING_HEALTH_CHECK_KEY = credentials('STAGING_ESIGNATURE_LOGIN_USERNAME')
    STAGING_NEW_RELIC_LICENSE_KEY = credentials('STAGING_NEW_RELIC_LICENSE_KEY')
		STAGING_NEW_RELIC_API_KEY = credentials('STAGING_NEW_RELIC_API_KEY')
	  STAGING_API_KEY = credentials('QA_DIRECT_API_KEY')
    STAGING_AES_KEY = credentials('QA_DIRECT_AES_KEY')
    STAGING_AES_IV = credentials('QA_DIRECT_AES_IV')
    STAGING_S3_BUCKET = credentials('QA_DIRECT_S3_BUCKET')
    STAGING_S3_KEY = credentials('QA_DIRECT_S3_KEY')
    STAGING_DIRECT_BUILD = 'false'
	  STAGING_DIRECT_USER = credentials('QA_DIRECT_USER')
    STAGING_DIRECT_TOKEN = credentials('QA_DIRECT_TOKEN')
  	STAGING_DIRECT_BUILD_URL = credentials('QA_DIRECT_BUILD_URL')
    // Staging DB is same as CD
    STAGING_MYSQL_DIRECT_CONNECTION_STRING = 'Server=defi-apps-nonprod-cd-db-direct-eks-01.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct;Uid=DirectCd;Pwd=Direct2114!0;'
    STAGING_MYSQL_DIRECTAUTH_CONNECTION_STRING = 'Server=defi-apps-nonprod-cd-db-direct-eks-01.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct_auth;Uid=DirectCd;Pwd=Direct2114!0;'
	STAGING_DATADOGOPTIONS_ENABLED = "true"
	STAGING_DATADOGOPTIONS_TAGS = "service:defi-direct-staging"

    /* QA Secrets */
    QA_HEALTH_CHECK_KEY = credentials('QA_ESIGNATURE_LOGIN_USERNAME')
    QA_LOGGLY_ENDPOINT_HOSTNAME = credentials('QA_LOGGLY_ENDPOINT_HOSTNAME')
		QA_LOGGLY_CUSTOMER_TOKEN = credentials('QA_LOGGLY_CUSTOMER_TOKEN')
	  QA_API_KEY = credentials('QA_DIRECT_API_KEY')
    QA_AES_KEY = credentials('QA_DIRECT_AES_KEY')
    QA_AES_IV = credentials('QA_DIRECT_AES_IV')
    QA_S3_BUCKET = credentials('QA_DIRECT_S3_BUCKET')
    QA_S3_KEY = credentials('QA_DIRECT_S3_KEY')
    QA_DIRECT_BUILD = 'true'
	  QA_DIRECT_USER = credentials('QA_DIRECT_USER')
    QA_DIRECT_TOKEN = credentials('QA_DIRECT_TOKEN')
  	QA_DIRECT_BUILD_URL = credentials('QA_DIRECT_BUILD_URL')
    QA_MYSQL_DIRECT_CONNECTION_STRING = 'Server=defi-apps-nonprod-qa-db-direct-eks-02.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct;Uid=DirectTest;Pwd=Direct2114!0;'
    QA_MYSQL_DIRECTAUTH_CONNECTION_STRING = 'Server=defi-apps-nonprod-qa-db-direct-eks-02.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct_auth;Uid=DirectTest;Pwd=Direct2114!0;'
	QA_DATADOGOPTIONS_ENABLED = "true"
	QA_DATADOGOPTIONS_TAGS = "service:defi-direct-qa"

    /* PROD Secrets */
    PROD_HEALTH_CHECK_KEY = credentials('PROD_ESIGNATURE_LOGIN_USERNAME')
    PROD_LOGGLY_ENDPOINT_HOSTNAME = credentials('PROD_LOGGLY_ENDPOINT_HOSTNAME')
		PROD_LOGGLY_CUSTOMER_TOKEN = credentials('PROD_LOGGLY_CUSTOMER_TOKEN')
	  PROD_API_KEY = credentials('PROD_DIRECT_API_KEY')
    PROD_AES_KEY = credentials('PROD_DIRECT_AES_KEY')
    PROD_AES_IV = credentials('PROD_DIRECT_AES_IV')
    PROD_S3_BUCKET = credentials('PROD_DIRECT_S3_BUCKET')
    PROD_S3_KEY = credentials('PROD_DIRECT_S3_KEY')
    PROD_DIRECT_BUILD = 'true'
	  PROD_DIRECT_USER = credentials('PROD_DIRECT_USER')
    PROD_DIRECT_TOKEN = credentials('PROD_DIRECT_TOKEN')
  	PROD_DIRECT_BUILD_URL = credentials('PROD_DIRECT_BUILD_URL')
    PROD_MYSQL_DIRECT_CONNECTION_STRING = 'Server=defi-apps-prod-db-direct-eks-02.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct;Uid=DirectProd;Pwd=Direct2231!!2;'
    PROD_MYSQL_DIRECTAUTH_CONNECTION_STRING = 'Server=defi-apps-prod-db-direct-eks-02.cluster-cktexlr9o6uj.us-east-1.rds.amazonaws.com;Database=direct_auth;Uid=DirectProd;Pwd=Direct2231!!2;'
	PROD_DATADOGOPTIONS_ENABLED = "true"
	PROD_DATADOGOPTIONS_TAGS = "service:defi-direct-prod"

    // aws access - empty by default so will use EC2 instances role
    AWS_ACCESS_KEY_ID = credentials('AWS_PROD_ACCESS_KEY')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_PROD_ACCESS_SECRET')
    AWS_DEFAULT_REGION = "us-east-1"
  }
  stages {
    stage('Create/update Docker image repository') {
      steps {
        sh('bash ./cd-pipeline/updateEcrRepository.sh')
      }
    }
    stage('Deploy to Cloudfront-nonprod-CD') {
      when {
				expression {
					return env.BRANCH_NAME != 'master' && env.BRANCH_NAME != 'qa' && env.BRANCH_NAME != 'prod';
				}
			}
      steps {
        sh("bash ./cd-pipeline/cd-deployment/deployCloudFormation.sh")
      }
    }
    stage('Deploy to Cloudfront-nonprod-QA') {
      when {
        branch 'qa'
      }
      steps {
        sh("bash ./cd-pipeline/qa-deployment/deployCloudFormation.sh")
      }
    }
    stage('Deploy to Cloudfront-prod') {
      when {
        anyOf { branch 'prod' }
      }
      steps {
        sh("bash ./cd-pipeline/prod-deployment/deployCloudFormation.sh")
      }
    }
    stage('Build') {
      steps {
        sh('bash ./cd-pipeline/build.sh')
      }
    }
    stage('Tests') {
      steps {
        sh('bash ./cd-pipeline/tests.sh')
      }
      post {
        always {
          junit 'TestResults/*.xml'
        }
      }
    }
    stage('Publish projects') {
      steps {
        sh("bash ./cd-pipeline/publish.sh")
      }
    }
    stage('Push Docker images') {
      steps {
        sh("bash ./cd-pipeline/dockerize.sh")
      }
    }
    stage('Deploy to CD environment') {
      when {
				expression {
					return env.BRANCH_NAME != 'master' && env.BRANCH_NAME != 'qa' && env.BRANCH_NAME != 'prod';
				}
			}
      steps {
        sh("bash ./cd-pipeline/deployToCdEnvironment.sh")
      }
      post {
        always {
          archiveArtifacts artifacts: 'cd-pipeline/k8s/cd-deployment.yaml'
          archiveArtifacts artifacts: 'Defi.Direct.Api/bin/Release/netcoreapp3.1/publish/*.json'
          // TODO: Move the CD environment cleanup to after CD tests if you create some.
          sh("kubectl delete -f ./cd-pipeline/k8s/cd-deployment.yaml --namespace=cd")
        }
      }
    }
    stage('Setup deployment artifacts') {
      steps {
        sh("bash ./cd-pipeline/setupDeploymentArtifacts.sh")
        archiveArtifacts artifacts: 'cd-pipeline/manual-deployments/**/*.*'
        archiveArtifacts artifacts: 'cd-pipeline/qa-deployment/**/*.*'
        archiveArtifacts artifacts: 'cd-pipeline/prod-deployment/**/*.*'
      }
    }
    stage('Deploy to Staging') {
      when { anyOf { branch 'master' } }
      steps {
        sh("bash ./cd-pipeline/staging-deployment/stagingDeploy.sh")
      }
    }
    stage('Deploy to QA') {
      when {
        branch 'qa'
      }
      steps {
        sh("bash ./cd-pipeline/qa-deployment/qaDeploy.sh")
      }
    }
    stage('Deploy to Prod') {
      when {
        anyOf { branch 'prod' }
      }
      steps {
        sh("bash ./cd-pipeline/prod-deployment/prodDeploy.sh")
      }
    }
  }
  post {
    always {
      cleanWs()
    }
    failure {
			script {
				if (env.BRANCH_NAME == 'master') {
					office365ConnectorSend(color: '#bb2124', status: 'Failure', webhookUrl: env.TEAMS_RELEASE_INT_WEBHOOK_URL, message: "Build #${env.BUILD_NUMBER} failed!")
				}
        else if (env.BRANCH_NAME == 'qa') {
					slackSend(color: "danger", channel: "#release-qa", message: "Build ${env.JOB_NAME} #${env.BUILD_NUMBER} has failed! (<${env.BUILD_URL}|Open>)")office365ConnectorSend(color: '#bb2124', status: 'Failure', webhookUrl: env.TEAMS_RELEASE_QA_WEBHOOK_URL, message: "Build #${env.BUILD_NUMBER} failed!")				
				}
        else if (env.BRANCH_NAME == 'prod') {
					office365ConnectorSend(color: '#bb2124', status: 'Failure', webhookUrl: env.TEAMS_RELEASE_PROD_WEBHOOK_URL, message: "Build #${env.BUILD_NUMBER} failed!")
				}
			}
		}
    success {
      script {
        if (env.BRANCH_NAME == 'prod') {
          office365ConnectorSend(color: '#22bb33', status: 'Success', webhookUrl: env.TEAMS_RELEASE_INT_WEBHOOK_URL, message: "Build #${env.BUILD_NUMBER} succeeded!")
        }
        else if (env.BRANCH_NAME == 'master') {
          office365ConnectorSend(color: '#22bb33', status: 'Success', webhookUrl: env.TEAMS_RELEASE_QA_WEBHOOK_URL, message: "Build #${env.BUILD_NUMBER} succeeded!")
        }
        else if (env.BRANCH_NAME == 'qa') {
          office365ConnectorSend(color: '#22bb33', status: 'Success', webhookUrl: env.TEAMS_RELEASE_PROD_WEBHOOK_URL, message: "Build #${env.BUILD_NUMBER} succeeded!")
        }
      }
		}
  }
}