
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

//window.Vue = require('vue');

import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

//Vue.component('example-component', require('./components/ExampleComponent.vue').default);
import WelcomeComponent from './components/WelcomeComponent.vue';
import ViewCourses from './components/courses/ViewCoursesComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import RegisterComponent from './components/RegisterComponent.vue';

import CreateEnrolmentComponent from './components/enrolments/CreateEnrolmentComponent.vue';
import EnrolmentsComponent from './components/enrolments/EnrolmentsComponent.vue';
import ViewStudentsComponent from './components/students/ViewStudentsComponent.vue';

//Vue.component('welcome-component', require('./components/WelcomeComponent.vue'));


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		components:{
			welcomeComponent: WelcomeComponent
		}
	},
	{
		path: '/courses',
		component: ViewCourses,
	},
	{
		path: '/login',
		component: LoginComponent
	},
	{
		path: '/register',
		component: RegisterComponent
	},
	{
		path: '/createEnrolment',
		component: CreateEnrolmentComponent
	},
	{
		path: '/enrolments',
		component: EnrolmentsComponent
	},
	{
		path: '/students',
		component: ViewStudentsComponent
	}

];

const router = new VueRouter({
	routes: routes
});

const app = new Vue({
    el: '#app',
	router: router
});
