<template>
	<div class="row justify-content-center">
		<div class="col-6">
			<div class="card mt-5">
				<div class="card-header">
					<h5>Register</h5>
				</div>

				<div class="card-body">
					<form @submit.prevent="registerSubmit()" class="form">
						<div class="form-group">
							<label for="name">Name:</label>
							<input v-model="name" type="text" name="name" class="form-control">
							<small v-if="Array.isArray(errors.name)">{{ errors.name[0] }}</small>
						</div>

						<div class="form-group">
							<label for="email">Email:</label>
							<input v-model="email" type="text" name="email" class="form-control">
							<small v-if="Array.isArray(errors.email)">{{ errors.email[0] }}</small>
						</div>

						<div class="form-group">
							<label for="password">Password:</label>
							<input v-model="password" type="password" name="password" class="form-control">
							<small v-if="Array.isArray(errors.password)">{{ errors.password[0] }}</small>
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
            console.log('Register Mounted');
			let that = this;
			
			that.getUser();
        },
		data(){
			return{
				name: "",
				email: "",
				password: "",
				token: localStorage.getItem("accessToken"),
				errors:{},
				user:{}
			}
		},
		methods:{
			registerSubmit(){
				let that = this;
				console.log(that.name);
				console.log(that.email);
				console.log(that.password);
				
				$.ajax({
					method: 'POST',
					url: "api/register",
					data: {name: that.name, email: that.email, password: that.password},
					dataType: 'json',
					success: function(response){
						console.log(response);
						
						localStorage.setItem("accessToken", response.token);
						localStorage.setItem("name", response.name);
						localStorage.setItem("email", response.email);
						that.$router.push("/");
					},
					error: function(response){
//						console.log(response);
						that.errors = response.responseJSON;
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
