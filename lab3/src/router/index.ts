import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import EventDetailView from '../views/details/EventDetailView.vue'
import EventLayoutView from '../views/details/EventLayoutView.vue'
import EventAirlineView from '../views/details/EventAirlineView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import NProgress from 'nprogress'
import EventLayoutViewVue from '../views/details/EventLayoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/details/:id', // Adjust the path as per your requirement
      name: 'event-layout',
      component: EventLayoutViewVue, // Replace this with the actual component
      // Add the beforeEnter guard for the event-layout route
      beforeEnter: (to, from, next) => {
        const id: number = parseInt(to.params.id as string)
        const eventStore = useEventStore()
        const store = useMessageStore()

        EventService.getEventById(id)
          .then((response: AxiosResponse<CardItem>) => {
            // Set the event data in the event store
            eventStore.setEvent(response.data)

            // Optionally, show a flash message indicating successful data retrieval
            store.updateMessage('Passenger details loaded successfully.')
            setTimeout(() => {
              store.resetMessage()
            }, 5000)

            // Continue with the route navigation
            next()
          })
          .catch(() => {
            // Handle error if data retrieval fails
            // Redirect to 404 or error page
            next({ name: '404-resource', params: { resource: 'PassengerId' } })
          })
      }
    },
    // other route configurations...
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: (route) => ({
        page: parseInt((route.query?.page as string) || '1')
      })
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/passenger/:id',
      name: 'event-layout',
      component: EventLayoutView,
      props: true,
      children: [
        {
          path: '',
          name: 'event-detail',
          component: EventDetailView,
          props: true
        },
        {
          path: 'airline',
          name: 'event-airline',
          component: EventAirlineView,
          props: true
        }
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView
    },
    {
      path: '/404/:resource',
      name: '404-resource',
      component: NotFoundView,
      props: true
    }
  ]
})
router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})
  // Add the scrollBehavior option
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // If a savedPosition is available, use it
      return savedPosition
    } else {
      // Otherwise, scroll to the top of the page
      return { top: 0 }
    }
  }

  // ...

export default router
