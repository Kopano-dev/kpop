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
		stage('Documentation') {
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
}
