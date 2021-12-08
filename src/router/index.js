import * as VueRouter from "vue-router";
import EditWindow from "../view/EditWindow.vue"
import UserWindow from "../view/UserWindow.vue"
import NovelCard from "../view/NovelCard.vue"
import PersonWindow from "../view/PersonWindow.vue"
import OpinionWindow from "../components/OpinionWindow.vue"
export default VueRouter.createRouter({
    mode: 'hash',
    history: VueRouter.createWebHashHistory(),
    base: process.env.BASE_URL,
    routes: [{
            path: "/",
            name: "NovelCard",
            component: NovelCard,
        }, {
            path: "/EditWindow",
            name: "EditWindow",
            component: EditWindow,
        },
        {
            path: "/UserWindow",
            name: "UserWindow",
            component: UserWindow,
        }, {
            path: "/PersonWindow",
            name: "PersonWindow",
            component: PersonWindow,
        }, {
            path: "/OpinionWindow",
            name: "OpinionWindow",
            component: OpinionWindow,
        }, {
            path: '/:pathMatch(.*)',
            redirect: '/'
        }
    ]
});