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
		stage('Test') {
			steps {
				sh 'make test-coverage'
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'coverage/lcov-report/', reportFiles: 'index.html', reportName: 'Coverage', reportTitles: ''])
			}
		}
		stage('Documentation') {
			when {
				branch 'master'
			}
			steps {
				sh 'make doc'
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'styleguide/', reportFiles: 'index.html', reportName: 'Documentation', reportTitles: ''])
			}
		}
	}
}
