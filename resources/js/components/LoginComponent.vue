<template>
	<div class="row justify-content-center">
		<div class="col-6">
			<div class="card">
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
        },
		data(){
			return{
				email: "",
				password: "",
				loggedIn: false
			}
		},
		methods:{
			loginSubmit(){
				let that = this;
				console.log("You have logged in");
				console.log(that.email);
				console.log(that.password);
				
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
						console.log(response);
					}
				});
				
			}
		}
    }
</script>
