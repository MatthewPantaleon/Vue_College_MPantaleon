<template>
    
	<div class="card">
		<div class="card-header">View Courses</div>

		<div class="card-body">
			Courses Available:
			<table class="table table-hover table-striped">
				<thead>
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
						
						<div v-if="boo">
							<td><button class="btn btn-primary">YO</button></td>
							<td><button class="btn btn-primary">HEDEAD</button></td>
						</div>
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
				boo: true
			}
		},
		methods:{
			
			getCourses(){
				let that = this;
				
				$.ajax({
					url: "api/courses",
					method: "GET",
					success(response){
						console.log(response);
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
