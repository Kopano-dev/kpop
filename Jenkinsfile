#!/usr/bin/env groovy

pipeline {
	agent {
		docker {
			image 'node:9'
			args '-u 0'
		}
	}
	// Set CI enabled for jest
	environment {
		CI = 'true'
	}
	stages {
		stage('lint') {
			steps {
				sh 'make lint-checkstyle'
				checkstyle pattern: 'test/tests.eslint.xml', canComputeNew: false, failedTotalAll: '5', unstableTotalAll: '50'
			}
		}
		stage('build') {
			steps {
				sh 'make'
			}
		}
		stage('docs') {
			when {
				branch 'master'
			}
			steps {
				sh 'make doc'
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'styleguide/', reportFiles: 'index.html', reportName: 'Documentation', reportTitles: ''])
			}
		}
		stage('dist') {
			when {
				branch 'master'
			}
			steps {
				sh 'make dist'
				archiveArtifacts artifacts: 'dist/*.tgz', fingerprint: true
			}
		}
	}
    post {
        always {
            cleanWs()
        }
    }
}
