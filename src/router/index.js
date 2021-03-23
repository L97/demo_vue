import Vue from 'vue'
import Router from 'vue-router'
import MapData from '@/components/mapData/MapData'
import Firlm from '@/components/FirIm/FirIm'
import PrisonDefense from '@/components/PrisonDefense/PrisonDefense'
import Editor from '@/components/Editor/Editor'
import HgisMap from '@/components/HgisMap/HgisMap'
import LeetCode from '@/components/LeetCode/LeetCode'
import Zrender from '@/components/Zrender/Zrender'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'zrender',
    //   component: Zrender
    // },
    {
      path: '/mapData',
      name: 'mapData',
      component: MapData
    },
    {
      path: '/firlm',
      name: 'firlm',
      component: Firlm
    },
    {
      path: '/prisonDefense',
      name: 'prisonDefense',
      component: PrisonDefense
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    },
    {
      path: '/map',
      name: 'map',
      component: HgisMap
    },
    {
      path: '/leetCode',
      name: 'leetCode',
      component: LeetCode
    },
    {
      path: '/zrender',
      name: 'Zrender',
      component: Zrender
    }
  ]
})
