<template>
	<div class="row justify-content-center">
		<div class="col-6">
			<div class="card mt-5">
				<div class="card-header">Login</div>

				<div class="card-body">
					<form @submit.prevent="loginSubmit()" class="form">
						
						<div class="form-group">
							<label for="email">Email:</label>
							<input v-model="email" type="text" name="email" class="form-control">
						</div>
						
						<div class="form-group">
							<label for="password">Password:</label>
							<input v-model="password" type="password" name="password" class="form-control">
						</div>
						
						<button type="submit" class="btn btn-primary">Submit</button>
						
						<router-link to="/"><button class="btn btn-secondary float-right">Home</button></router-link>
					</form>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        mounted() {
            console.log('Login Mounted');
			let that = this;
			
			//validate if a user is logged in
			that.getUser();
        },
		data(){
			return{
				email: "",
				password: "",
				loggedIn: false,
				token: localStorage.getItem("accessToken")
			}
		},
		methods:{
			//login
			loginSubmit(){
				let that = this;
				
				$.ajax({
					method: "POST",
					url: "api/login",
					data: {email: that.email, password: that.password},
					dataType: "json",
					success: function(response){
//						console.log(response);
						localStorage.setItem('accessToken', response.token);
						localStorage.setItem('name', response.name);
						localStorage.setItem('email', response.email);
						
						that.$router.push("/");
					},
					error: function(response){
						alert(response.responseJSON.error);
					}
				});
				
			},
			getUser(){
				let that = this;
				
				$.ajax({
					method: 'GET',
					url: 'api/user',
					headers:{
						Authorization: "Bearer " + that.token
					},
					success: function(response){
						alert("You are already logged in.");
						that.$router.push("/");
					},
					error: function(response){
						
					}
				});
			}
		}
    }
</script>
