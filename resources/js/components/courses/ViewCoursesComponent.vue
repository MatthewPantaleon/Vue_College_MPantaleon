<template>
    
	<div class="card mt-5">
		<div class="card-header">
			<h5 style="display: inline-block">Courses</h5>
			
			<router-link to="/"><button class="btn btn-primary float-right">Home</button></router-link>
			<div class="row" v-if="user.name">
				<div class="col">
					Welcome, {{ user.name }}
				</div>
			</div>
		</div>

		<div class="card-body">
			<table class="table table-hover table-striped">
				<thead class="thead-dark">
					<tr>
						<th>Id</th>
						<th>Title</th>
						<th>Code</th>
						<th>Description</th>
						<th>Points</th>
						<th>Level</th>
					</tr>
				</thead>
				
				<tbody>
					<tr v-for="c in courses">
						<td>{{ c.id }}</td>
						<td>{{ c.title }}</td>
						<td>{{ c.code }}</td>
						<td>{{ c.description }}</td>
						<td>{{ c.points }}</td>
						<td>{{ c.level }}</td>
					</tr>
				</tbody>
			
			</table>
		</div>
	</div>

</template>

<script>
    export default {
        mounted() {
            console.log('Courses Component.');
			let that = this;
			
			that.getCourses();
			
        },
		data(){
			return{
				courses: [],
				boo: true,
				user:{
					name: localStorage.getItem("name"),
					email: localStorage.getItem("name"),
					token: localStorage.getItem("accessToken")
				}
			}
		},
		methods:{
			
			getCourses(){
				let that = this;
				
				$.ajax({
					url: "api/courses",
					method: "GET",
					success(response){
//						console.log(response);
						that.courses = response;
					},
					error(response){
						console.log(response);
					}
				});
			},
		}
    }
</script>
