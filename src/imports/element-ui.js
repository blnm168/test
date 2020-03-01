import {
  Input,
  Button,
  ButtonGroup,
  Pagination,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Autocomplete,
  DatePicker,
  // TimeSelect,
  // TimePicker,
  Popover,
  Tooltip,
  Tabs,
  TabPane,
  Tag,
  Badge,
  Container,
  Loading,
  Message,
  Notification,
  OptionGroup,
  Form,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  Collapse,
  CollapseItem,
  Scrollbar,
  Progress
} from 'element-ui'

import { Select, Option, Tagify } from 'element-ui-extensions'

Vue.use(Select)
Vue.use(Option)
Vue.use(Tagify)
Vue.use(Progress)

Vue.use(Scrollbar)

Vue.use(Input)

// Vue.use(Select)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Pagination)
Vue.use(Autocomplete)
Vue.use(DatePicker)
// Vue.use(TimeSelect)
// Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Badge)
// Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Container)
Vue.use(Form)
// Vue.use(Table)
// Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Collapse)
Vue.use(CollapseItem)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
