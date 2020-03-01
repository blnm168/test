import Overlay from './Overlay'
import Modal from './Modal'
import Alert from './Alert'
import Confirm from './Confirm'
import './Notify'

const components = [Overlay, Modal, Alert, Confirm]

components.map(component => {
  Vue.use(component)
})
