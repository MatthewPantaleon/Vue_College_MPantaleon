<template>

	<div class="card mt-5">
		<div class="card-header">
			<h5 style="display: inline-block">Students</h5>
			
			<router-link to="/"><button class="btn btn-primary float-right">Home</button></router-link>
			<div class="row" v-if="user.name">
				<div class="col">
					Welcome, {{ user.name }}
				</div>
			</div>
		</div>

		<div class="card-body">
			
		</div>
	</div>

	
</template>

<script>
    export default {
        mounted() {
			let that = this;
            console.log('Students Mounted');
			that.getUser();
        },
		data(){
			return{
				students: [],
				user:{
					name: localStorage.getItem("name"),
					token: localStorage.getItem("accessToken"),
					email: localStorage.getItem("email")
				}
				
			}
		},
		methods:{
			getStudents(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/students',
					headers:{
						Authorization: "Bearer " + localStorage.getItem("accessToken")
					},
					success: function(response){
						console.log(response);
						that.students = response;
					},
					error: function(response){
						
					}
				});
			},
			getUser(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/user',
					headers:{
						Authorization: "Bearer " + that.user.token
					},
					success: function(response){
//						console.log(response);
						that.user.name = response.user.name;
						that.user.email = response.user.email;

						that.getStudents();
					},
					error: function(response){
						alert("You are not logged in.");
						that.$router.push("/");
					}
				});
			}
		}
    }
</script>
