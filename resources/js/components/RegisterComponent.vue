<template>

	<div class="card">
		<div class="card-header">I am the welcome</div>

		<div class="card-body">
			<form @submit.prevent="registerSubmit()" class="form">
				<input v-model="name" type="text" name="name">
				<input v-model="email" type="text" name="email">
				<input v-model="password" type="password" name="password">
				<button type="submit">Submit</button>
			</form>
		</div>
	</div>

</template>

<script>
    export default {
        mounted() {
            console.log('Register Mounted');
        },
		data(){
			return{
				name: "",
				email: "",
				password: ""
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
					},
					error: function(response){
						console.log(response);
					}
				});
				
			}
		}
    }
</script>
