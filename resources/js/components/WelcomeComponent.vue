<template>

	<div class="row justify-content-center">
		<div class="col-6">
			<div class="card mt-5">
				<div class="card-header">Welcome to the College Database<span v-if="user.name" class="float-right">Welcome, {{ user.name }}</span></div>

				<div class="card-body">
					<router-link to="/login" v-if="!user.name"><button class="btn btn-success">Login</button></router-link>
					<router-link to="/register" v-if="!user.name"><button class="btn btn-success float-right">Register</button></router-link>
					<router-link to="" v-else><button @click="logoutUser()" class="btn btn-success">Logout</button></router-link>
					
					<hr>
					
					<router-link to="/courses"><button class="btn btn-primary">Courses</button></router-link>
					<router-link to="/enrolments" v-if="user.token"><button class="btn btn-primary">Enrolments</button></router-link>
					<router-link to="/students" v-if="user.token"><button class="btn btn-primary">Students</button></router-link>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('Welocome Mounted');
        },
		data(){
			return{
				user:{
					name: localStorage.getItem("name"),
					token: localStorage.getItem("accessToken"),
					email: localStorage.getItem("email")
				}
				
			}
		},
		methods:{
			logoutUser(){
				let that = this;

				$.ajax({
					method: 'GET',
					url: 'api/logout',
					headers:{
						Authorization: "Bearer " + that.user.token
					},
					success: function(response){
						console.log(response);
						localStorage.clear();
						that.user.name = "";
						that.user.token = "";
						that.user.email = "";
						alert(response.message);
					},
					error: function(response){
						console.log(response);
					}
				});
			}
		}
    }
</script>
