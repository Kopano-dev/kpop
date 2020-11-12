#!/usr/bin/env groovy

pipeline {
	agent {
		docker {
			image 'node:14'
		}
	}
	environment {
		CI = 'true'
		YARN_CACHE_FOLDER = '/tmp/.yarn-cache'
	}
	stages {
		stage('Lint') {
			steps {
				sh 'make lint-checkstyle'
				recordIssues qualityGates: [[threshold: 5, type: 'TOTAL', unstable: false]], tools: [esLint(pattern: 'test/tests.eslint.xml')], unhealthy: 50
			}
		}
		stage('Build') {
			steps {
				sh 'make'
			}
		}
		stage('Test') {
			steps {
				sh 'make test-coverage'
				junit allowEmptyResults: true, testResults: 'test/jest-test-results.xml'
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'coverage/lcov-report/', reportFiles: 'index.html', reportName: 'Test Coverage Report', reportTitles: ''])
			}
		}
		stage('Docs') {
			steps {
				sh 'make doc'
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'styleguide/', reportFiles: 'index.html', reportName: 'Documentation', reportTitles: ''])
			}
		}
		stage('Dist') {
			steps {
				sh 'make dist'
				sh '$(git diff --stat)'
				sh 'test -z "$(git diff --shortstat 2>/dev/null |tail -n1)" && echo "Clean check passed."'
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
