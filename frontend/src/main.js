import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'
import App from './App.vue'
import Home from './pages/index.vue'
import Dashboard from './pages/dashboard.vue'
import StoryView from './pages/StoryView.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: "/stories/:id", component: StoryView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App)
    .use(router)
    .mount('#app')