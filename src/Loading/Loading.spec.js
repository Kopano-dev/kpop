import React from 'react'
import ReactDOM from 'react-dom'
import Loading from './Loading'


it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Loading/>, div)
})

it('renders without crashing erorr=true', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Loading error={true}/>, div)
})

it('renders without crashing timedOut=true', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Loading timedOut={true}/>, div)
})

it('renders without crashing pastDelay=true', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Loading pastDelay={true}/>, div)
})
