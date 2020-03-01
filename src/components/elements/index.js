import BackToTop from './BackToTop'
import Button from './Button'
import Card from './Card'
import Field from './Field'
import Row from './Row'
import Input from './Input'
import Select from './Select'
import TagInput from './TagInput'
import TagSelect from './TagSelect'

const components = [
  BackToTop,
  Button,
  Card,
  Field,
  Row,
  Input,
  Select,
  TagInput,
  TagSelect
]

components.map(component => {
  Vue.use(component)
})
