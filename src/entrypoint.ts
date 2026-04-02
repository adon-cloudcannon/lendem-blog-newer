import type { Alpine } from 'alpinejs'
import resize from '@alpinejs/resize'

export default (Alpine: Alpine) => {
    Alpine.plugin(resize)
}