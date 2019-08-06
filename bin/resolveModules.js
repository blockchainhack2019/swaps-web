import path from 'path'
import modPath from 'app-module-path'


const modules = [
  '',
  'local_modules',
  'site',
]


modules.forEach((modulePath) => {
  modPath.addPath(path.join(process.cwd(), modulePath))
})
