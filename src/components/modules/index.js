import Layout from './Layout'
import Form from './Form'
import Table from './Table'
import ColumnWrapper from './ColumnWrapper'
import Column from './Column'
import PageSize from './PageSize'
import Dates from './Dates'
import './Tab'

const components = [Layout, Form, Table, ColumnWrapper, Column, PageSize, Dates]

components.map(component => {
  Vue.use(component)
})
