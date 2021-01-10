'use strict'

require('./css/style.css')

import { Bootstrap } from './lib/bootstrap'
window.strikeJS = new Bootstrap()
window.strikeJS.version = Bootstrap.version()
