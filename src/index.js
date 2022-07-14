import Template from '@templates/Template.js';
import '@styles/main.css';
import '@styles/vars.styl'

console,log("yolo");

(async function App() {
  const main = null || document.getElementById('main');
  main.innerHTML = await Template();
})();
