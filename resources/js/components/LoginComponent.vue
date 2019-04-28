<template>

	<div class="card">
		<div class="card-header">I am the welcome</div>

		<div class="card-body">
			<form @submit.prevent="loginSubmit()" class="form">
				<input v-model="email" type="text" name="email" >
				<input v-model="password" type="password" name="password" >
				<button type="submit" class="btn btn-primary">Submit</button>
			</form>
			
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
				password: ""
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
						console.log(response);
						localStorage.setItem('accessToken', response.token);
					},
					error: function(response){
						console.log(response);
					}
				});
				
			}
		}
    }
</script>
